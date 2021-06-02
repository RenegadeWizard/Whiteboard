import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input()
  roomNo = 4;
  @Output()
  strokeSize = new EventEmitter<number>();
  @Output()
  strokeColor = new EventEmitter<string>();
  @Output()
  clearScreen = new EventEmitter();

  constructor() {}

  ngOnInit(): void {

  }

  changeStrokeSize(size: number) {
    this.strokeSize.emit(size);
  }

  changeStrokeColor(color: string) {
    this.strokeColor.emit(color);
  }

  onClearScreen() {
    this.clearScreen.emit();
  }

}
