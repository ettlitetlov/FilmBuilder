import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuilderUIComponent } from "./builder-ui/builder-ui.component";
import { StoreUIComponent } from "./store-ui/store-ui.component";

const routes: Routes = [
  { path: "store", component: StoreUIComponent},
  { path: "compose", component: BuilderUIComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
