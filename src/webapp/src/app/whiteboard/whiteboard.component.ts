import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private screenSize: [number, number];
  private isMouseDown: boolean = false;
  private offset: number;
  private pixels = 0;
  private lastPoint: [number, number];
  private currentColor: string = "#000000";
  private currentLineWidth: number = 1;
  private ws: WebSocket;
  roomNo: number;

  constructor(private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(res => {
      this.roomNo = res.wid;
      this.ws = new WebSocket("ws://localhost:8080/whiteboard?room=" + res.wid);
      this.ws.binaryType = "arraybuffer";
      this.ws.addEventListener("message", this.test);
    })
    document.onmousedown = this.onMouseDown;
    document.onmouseup = this.onMouseUp;
    document.onmousemove = this.onMouseMove;
  }

  ngOnInit(): void {
    this.canvas = document.getElementById('board') as HTMLCanvasElement;
    this.screenSize = [window.innerWidth, window.innerHeight];
    this.canvas.setAttribute("height", `${this.screenSize[1] - 85}px`);
    this.canvas.setAttribute("width", `${this.screenSize[0]}px`);
    this.offset = 80;
    this.context = this.canvas.getContext('2d');
    this.context.beginPath();
    this.pixels = 0;
  }

  test: { (event): void } = (event) => {
    this.context.beginPath();
    let view = new Int16Array(event.data);
    if (view[8] == 0) {
      this.draw(view[0], view[1], view[2], view[3], WhiteboardComponent.rgbToHex(view[4], view[5], view[6]), view[7]);
    } else {
      this.clearScreen();
    }
  }

  onMouseMove: { (event: MouseEvent): void } = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    if (this.isMouseDown) {
      this.pixels += 1;
      if (this.pixels >= 3) {
        const rgb = WhiteboardComponent.hexToRgb(this.currentColor);
        this.ws.send(Int16Array.of(this.lastPoint[0], this.lastPoint[1], x, y, rgb.r, rgb.g, rgb.b, this.currentLineWidth, 0));
        this.pixels = 0;
        this.lastPoint = [x, y];
      }
    }
  }

  onMouseDown: { (event: MouseEvent): void } = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    this.context.beginPath();
    this.isMouseDown = true;
    this.lastPoint = [x, y];
  }

  onMouseUp: { (event: MouseEvent): void } = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    this.isMouseDown = false;
  }

  draw(x1, y1, x2, y2, color, lineWidth) {
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.moveTo(x1, y1 - this.offset);
    this.context.lineTo(x2, y2 - this.offset);
    this.context.stroke();
  }

  onStrokeSizeChange(size: number) {
    this.currentLineWidth = size;
  }

  onStrokeColorChange(color: string) {
    this.context.strokeStyle = color;
    this.currentColor = this.context.strokeStyle;
  }

  onClearScreen() {
    this.ws.send(Int16Array.of(0, 0, 0, 0, 0, 0, 0, 0, 1));
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private static componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  private static rgbToHex(r, g, b) {
    return "#" + WhiteboardComponent.componentToHex(r) + WhiteboardComponent.componentToHex(g) + WhiteboardComponent.componentToHex(b);
  }

  private static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

}
