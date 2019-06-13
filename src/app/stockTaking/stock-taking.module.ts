import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { ProductService } from "../scan/product.service";
import { StockTakingRoutingModule } from "./stock-taking-routing.module";
import { StockTakingComponent } from "./stock-taking.component";

@NgModule({
    imports: [
        NativeScriptHttpClientModule,
        StockTakingRoutingModule
    ],
    declarations: [
        StockTakingComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        NativeScriptHttpClientModule,
        ProductService,
        BarcodeScanner
    ]
})
export class StockTakingModule { }
