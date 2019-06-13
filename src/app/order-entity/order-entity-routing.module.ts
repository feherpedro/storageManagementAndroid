import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { OrderEntityDetailComponent } from "~/order-entity/order-entity-detail.component";
import { OrderEntityComponent } from "~/order-entity/order-entity.component";
import { OrderItemDetailComponent } from "~/order-entity/order-item-detail.component";

const routes: Routes = [
    { path: "", component: OrderEntityComponent },
    { path: ":id", component: OrderEntityDetailComponent },
    { path: ":id/order-items/:orderItemId", component: OrderItemDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class OrderEntityRoutingModule { }
