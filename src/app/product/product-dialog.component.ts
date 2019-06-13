import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular";
import { RouterExtensions } from "nativescript-angular/router";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { Observable } from "rxjs/Observable";
import * as dialogs from "ui/dialogs";
import { Product } from "~/product/product.model";
import { ProductService } from "~/product/product.service";

@Component({
    selector: "ProductDialog",
    moduleId: module.id,
    templateUrl: "./product-dialog.component.html"
})
export class ProductDialogComponent implements OnInit {

    @ViewChild("barcodeModel") barcodeModel: ElementRef;
    @ViewChild("nameModel") nameModel: ElementRef;

    product = new Product();
    isSaving: boolean;

    constructor(private barcodeScanner: BarcodeScanner,
                private params: ModalDialogParams,
                private routerExtensions: RouterExtensions,
                private productService: ProductService) {
    }

    ngOnInit(): void {
        this.isSaving = false;
    }
    /*
        ngAfterViewInit(): void {
            /!*setTimeout(() => {
                this.loadAll();
            }, 0);*!/
        }*/

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(
            this.productService.create(this.product));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Product>>) {
        result.subscribe((res: HttpResponse<Product>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError(res));
    }

    private onSaveError(error) {
        this.isSaving = false;
        dialogs.alert({
            title: "Hiba a mentés során",
            message: error.status + error.statusMessage,
            okButtonText: "Bezárás"
        }).then(() => {
            console.log("Dialog closed!");
        });
        console.log("Hiba: " + error.message);
    }

    private onSaveSuccess(result: Product) {
        console.log(result);
        this.params.closeCallback(result);
        // this.routerExtensions.navigate(["/products"]);
    }

    private onClose() {
        this.params.closeCallback(false);
        // this.routerExtensions.navigate(["/products"]);
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
            this.product.barcode = result.text;
        }, (errorMessage) => {
            console.log("Hiba a beolvasáskor: " + errorMessage);
        });
    }

    private isFormValid(): boolean {
        return this.nameModel.nativeElement.valid && this.barcodeModel.nativeElement.valid;
    }
}
