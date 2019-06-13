import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import { FormsModule } from "@angular/forms";
import { ModalDialogService, NativeScriptFormsModule } from "nativescript-angular";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { DateHelperService } from "~/date-helper.service";
import { OrderEntityDetailComponent } from "~/order-entity/order-entity-detail.component";
import { OrderEntityDialogComponent } from "~/order-entity/order-entity-dialog.component";
import { OrderEntityRoutingModule } from "~/order-entity/order-entity-routing.module";
import { OrderEntityComponent } from "~/order-entity/order-entity.component";
import { OrderEntityService } from "~/order-entity/order-entity.service";
import { OrderItemDetailComponent } from "~/order-entity/order-item-detail.component";
import { OrderItemDialogComponent } from "~/order-entity/order-item-dialog.component";
import { OrderItemService } from "~/order-entity/order-item.service";
import { ProductService } from "~/product/product.service";

@NgModule({
    imports: [
        NativeScriptHttpClientModule,
        NativeScriptCommonModule,
        FormsModule,
        NativeScriptFormsModule,
        NativeScriptUIListViewModule,
        OrderEntityRoutingModule
    ],
    declarations: [
        OrderEntityComponent,
        OrderEntityDialogComponent,
        OrderEntityDetailComponent,
        OrderItemDialogComponent,
        OrderItemDetailComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        NativeScriptHttpClientModule,
        ProductService,
        OrderEntityService,
        OrderItemService,
        DateHelperService,
        ModalDialogService,
        BarcodeScanner
    ],
    entryComponents: [
        OrderEntityDialogComponent,
        OrderItemDialogComponent
    ]
})
export class OrderEntityModule { }
