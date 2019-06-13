import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "nativescript-angular";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ProductDialogComponent } from "./product-dialog.component";
import { Product } from "./product.model";
import { ProductService } from "./product.service";

@Component({
    selector: "Product",
    moduleId: module.id,
    templateUrl: "./product.component.html"
})
export class ProductComponent implements OnInit {

    private products: Product[];

    constructor(private productService: ProductService,
                private modal: ModalDialogService,
                private vcRef: ViewContainerRef,
                private routerExtensions: RouterExtensions) {
    }

    ngOnInit(): void {
        this.loadAll();
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    loadAll() {
        this.productService.query().subscribe(
            (res: HttpResponse<Product[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onSuccess(data, headers) {
        // this.links = this.parseLinks.parse(headers.get('link'));
        // this.totalItems = headers.get('X-Total-Count');
        // this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.products = data;
        console.log(this.products);
    }

    private onError(error) {
        console.log("Hiba a termékek lekérésekor");
    }

    private onNewProduct() {
        // this.routerExtensions.navigate(["/products/new"]);
        const options = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(ProductDialogComponent, options).then((res) => {
            console.log(res);
            if (res) {
                this.loadAll();
                // this.onDetailTap(res);
            }
        });
    }

    private onDetailTap(product: Product) {
        this.routerExtensions.navigate(["/products", product.id]);
    }
}
