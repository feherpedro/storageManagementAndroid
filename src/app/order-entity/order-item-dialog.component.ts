import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { Observable } from "rxjs/Observable";
import { switchMap } from "rxjs/operators";
import * as dialogs from "ui/dialogs";
import { OrderItem } from "~/order-entity/order-item.model";
import { OrderItemService } from "~/order-entity/order-item.service";
import { Product } from "~/product/product.model";
import { ProductService } from "~/product/product.service";

@Component({
    selector: "OrderItemtDialog",
    moduleId: module.id,
    templateUrl: "./order-item-dialog.component.html"
})
export class OrderItemDialogComponent implements OnInit {

    product = new Product();
    orderItem = new OrderItem();
    isSaving: boolean;
    products: Product[];

    constructor(private barcodeScanner: BarcodeScanner,
                private params: ModalDialogParams,
                private pageRoute: PageRoute,
                private routerExtensions: RouterExtensions,
                private orderItemService: OrderItemService,
                private productService: ProductService) {
    }

    ngOnInit(): void {
        this.isSaving = false;
        this.pageRoute.activatedRoute.pipe(
            switchMap((activatedRoute) => activatedRoute.params)
        ).forEach((params) => {
            this.orderItem.orderEntityId = +params["id"];
            console.log(this.orderItem.orderEntityId);
        });
    }

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(
            this.orderItemService.create(this.orderItem));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<OrderItem>>) {
        result.subscribe((res: HttpResponse<OrderItem>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError(res));
    }

    private onSaveError(error) {
        this.isSaving = false;
        dialogs.alert({
            title: "Hiba a mentés során",
            message: error.message,
            okButtonText: "Bezárás"
        }).then(() => {
            console.log("Dialog closed!");
        });
        console.log("Hiba: " + error.message);
        console.log(error.status + error.statusMessage);
    }

    private onSaveSuccess(result: OrderItem) {
        console.log(result);
        this.params.closeCallback(result);
    }

    private onClose() {
        this.params.closeCallback(false);
    }

    private onScan() {
        this.barcodeScanner.scan({
            showFlipCameraButton: true,
            preferFrontCamera: false,
            showTorchButton: true,
            beepOnScan: true,
            torchOn: false,
            resultDisplayDuration: 500,
            orientation: undefined,
            openSettingsIfPermissionWasPreviouslyDenied: true
        }).then((result) => {
            this.productService.query().subscribe(
                (res: HttpResponse<Product[]>) => this.onProductSuccess(res.body, res.headers, result.text),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
            // this.product.barcode = result.text;
        }, (errorMessage) => {
            console.log("Hiba a beolvasáskor: " + errorMessage);
        });
    }

    private onProductSuccess(data, headers, text) {
        this.products = data;
        this.product = this.products.filter((x) => x.barcode === text)[0];
        if (this.product) {
            this.orderItem.productId = this.product.id;
            this.orderItem.productName = this.product.name;
            this.orderItem.productUnitOfMeasurement = this.product.unitOfMeasurement;
            this.orderItem.productBarcode = this.product.barcode;
        } else {
            dialogs.alert({
                title: "Hiba a termék lekérésekor",
                message: "Nincs ilyen vonalkódú termék",
                okButtonText: "Bezárás"
            }).then(() => {
                console.log("Hiba a termék lekérésekor: Nincs ilyen vonalkódú termék");
            });
        }
        console.log(this.orderItem);
    }

    private onError(error) {
        dialogs.alert({
            title: "Hiba a termék lekérésekor",
            message: error.message,
            okButtonText: "Bezárás"
        }).then(() => {
            console.log("Hiba a termék lekérésekor");
        });
    }
}
