import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuilderUIComponent } from "./builder-ui/builder-ui.component";
import { StoreUIComponent } from "./store-ui/store-ui.component";
import { ScriptBuilderComponent } from "./script-builder/script-builder.component";

const routes: Routes = [
  { path: "store", component: StoreUIComponent},
  { path: "compose", component: BuilderUIComponent},
  { path: "script", component: ScriptBuilderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
