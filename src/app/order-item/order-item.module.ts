import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { OrderItemRoutingModule } from "~/order-item/order-item-routing.module";
import { OrderItemComponent } from "~/order-item/order-item.component";
import { OrderItemService } from "~/order-item/order-item.service";
import { ProductService } from "~/scan/product.service";

@NgModule({
    imports: [
        NativeScriptHttpClientModule,
        NativeScriptCommonModule,
        OrderItemRoutingModule
    ],
    declarations: [
        OrderItemComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        NativeScriptHttpClientModule,
        ProductService,
        OrderItemService,
        BarcodeScanner
    ]
})
export class OrderItemModule { }
