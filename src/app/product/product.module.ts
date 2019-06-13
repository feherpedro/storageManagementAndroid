import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ModalDialogService, NativeScriptFormsModule } from "nativescript-angular";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { ProductDetailComponent } from "./product-detail.component";
import { ProductDialogComponent } from "./product-dialog.component";
import { ProductService } from "./product.service";
import { ProductRoutingModule } from "./product-routing.module";
import { ProductComponent } from "./product.component";

@NgModule({
    imports: [
        NativeScriptHttpClientModule,
        NativeScriptCommonModule,
        FormsModule,
        NativeScriptUIDataFormModule,
        NativeScriptFormsModule,
        ProductRoutingModule
    ],
    declarations: [
        ProductComponent,
        ProductDetailComponent,
        ProductDialogComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        NativeScriptHttpClientModule,
        ProductService,
        ModalDialogService,
        BarcodeScanner
    ],
    entryComponents: [
        ProductDialogComponent
    ]
})
export class ProductModule { }
