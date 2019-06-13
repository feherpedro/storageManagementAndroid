import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { StockTakingComponent } from "~/stockTaking/stock-taking.component";

const routes: Routes = [
    { path: "", component: StockTakingComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class StockTakingRoutingModule { }
