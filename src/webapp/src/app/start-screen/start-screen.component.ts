import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
})
export class StartScreenComponent implements OnInit {

  roomNumberInput: HTMLInputElement;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.roomNumberInput = document.getElementById("roomNumberInput") as HTMLInputElement;
  }

  createNewRoom() {
    const roomNo = parseInt(this.roomNumberInput.value);
    if (roomNo) {
      this.router.navigate(["/whiteboard/" + roomNo]);
    }

  }

}
