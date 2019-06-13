import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import * as app from "application";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { switchMap } from "rxjs/operators";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Product } from "~/product/product.model";
import { ProductService } from "~/product/product.service";

@Component({
    selector: "ProductDetail",
    moduleId: module.id,
    templateUrl: "./product-detail.component.html"
})
export class ProductDetailComponent implements OnInit {

    private product: Product;

    constructor(private barcodeScanner: BarcodeScanner,
                private pageRoute: PageRoute,
                private routerExtensions: RouterExtensions,
                private productService: ProductService) {
    }

    ngOnInit(): void {
        this.pageRoute.activatedRoute.pipe(
            switchMap((activatedRoute) => activatedRoute.params)
        ).forEach((params) => {
            const id = +params["id"];
            this.load(id);
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    load(id: number) {
        this.productService.find(id).subscribe(
            (res: HttpResponse<Product>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onSuccess(data, headers) {
        // this.links = this.parseLinks.parse(headers.get('link'));
        // this.totalItems = headers.get('X-Total-Count');
        // this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.product = data;
        console.log(this.product);
    }

    private onError(error) {
        dialogs.alert({
            title: "Hiba a termék lekérésekor",
            message: error.status + error.statusMessage,
            okButtonText: "Bezárás"
        }).then(() => {
            console.log("Hiba a termék lekérésekor");
            this.routerExtensions.navigate(["/products"]);
        });
    }

    private onDelete() {
        this.productService.delete(this.product.id).subscribe(
            (res: HttpResponse<any>) => this.routerExtensions.navigate(["/products"]),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
}
