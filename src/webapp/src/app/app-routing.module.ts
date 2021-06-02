import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {StartScreenComponent} from "./start-screen/start-screen.component";
import {WhiteboardComponent} from "./whiteboard/whiteboard.component";

const routes: Routes = [
  {
    path: "",
    component: StartScreenComponent
  },
  {
    path: "whiteboard/:wid",
    component: WhiteboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
