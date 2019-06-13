import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ProductDetailComponent } from "./product-detail.component";
import { ProductDialogComponent } from "./product-dialog.component";
import { ProductComponent } from "./product.component";

const routes: Routes = [
    { path: "", component: ProductComponent },
    { path: "new", component: ProductDialogComponent },
    { path: ":id", component: ProductDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ProductRoutingModule { }
