import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import * as app from "tns-core-modules/application";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Product } from "./product.model";
import { ProductService } from "./product.service";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "scan", loadChildren: "./scan/scan.module#ScanModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Scan",
    moduleId: module.id,
    templateUrl: "./scan.component.html"
})
export class ScanComponent implements OnInit {

    private scanned = false;
    private scannedFormat = "";
    private scannedText = "";
    private scannedProduct: Product;
    private product: Product;
    private productList: Product[];
    private confirmOptions: dialogs.ConfirmOptions = {};

    // orientation = require("nativescript-orientation");        formats: "QR_CODE, EAN_13",

    constructor(private barcodeScanner: BarcodeScanner,
                private productService: ProductService) {
    }

    ngOnInit(): void {
    }

    onScan() {
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
            console.log("Formátum: " + result.format + ",\nTartalom: " + result.text);
            this.scanned = true;
            this.scannedFormat = result.format;
            this.scannedText = result.text;
            const confirmOptions: dialogs.ConfirmOptions = {
                title: "Scan eredménye",
                message: "Formátum: " + result.format + ",\nTartalom: " + result.text,
                okButtonText: "Tovább a " + result.text + " vonalkódú termékhez",
                cancelButtonText: "Vissza"
            };
            setTimeout(() => {
                dialogs.confirm(confirmOptions).then((action) => {
                    console.log("Dialog result: " + action);
                    if (action) {
                        // this.productService.search({"barcode.equals": result.text})
                        this.productService.search({query: "barcode.equals=" + result.text})
                        .subscribe(
                            (res: HttpResponse<Product[]>) => {
                                this.productList = res.body;
                                this.scannedProduct = this.productList[0];
                                const alertOptions: dialogs.AlertOptions = {
                                    title: "Leolvasott termék",
                                    message: "A " + this.scannedProduct.barcode +
                                        " vonalkódú termék ára: " + this.scannedProduct.price + ",\n" +
                                        "Raktáron: " + this.scannedProduct.quantity + " " +
                                        this.scannedProduct.unitOfMeasurement,
                                    okButtonText: "OK"
                                };

                                setTimeout(() => {
                                    dialogs.confirm(alertOptions).then((action2) => {
                                        console.log("Dialog result: " + action2);
                                        if (action2) {

                                        }
                                    });
                                }, 0);
                            }, (errorMessage) => {
                                console.log("Hiba a termék lekérésekor: " + errorMessage);
                            });
                        /*
                        this.productService.find(parseInt(this.scannedText, 10))
                        .subscribe(
                            (res: HttpResponse<Product>) => {
                                this.product = res.body;
                                console.log(res.body);
                            },
                            (res: HttpErrorResponse) => console.log(res.message)
                        );*/
                    }
                });
            }, 0);
        }, (errorMessage) => {
            console.log("Hiba a beolvasáskor: " + errorMessage);
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
