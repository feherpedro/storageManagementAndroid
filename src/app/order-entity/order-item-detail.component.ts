import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import * as app from "application";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { switchMap } from "rxjs/operators";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { OrderItem } from "~/order-entity/order-item.model";
import { OrderItemService } from "~/order-entity/order-item.service";

@Component({
    selector: "OrderItemDetail",
    moduleId: module.id,
    templateUrl: "./order-item-detail.component.html"
})
export class OrderItemDetailComponent implements OnInit {

    private orderItem: OrderItem;
    private orderEntityId: number;

    constructor(private barcodeScanner: BarcodeScanner,
                private pageRoute: PageRoute,
                private routerExtensions: RouterExtensions,
                private orderItemService: OrderItemService) {
    }

    ngOnInit(): void {
        this.pageRoute.activatedRoute.pipe(
            switchMap((activatedRoute) => activatedRoute.params)
        ).forEach((params) => {
            const id = +params["orderItemId"];
            this.orderEntityId = +params["id"];
            this.load(id);
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    load(id: number) {
        this.orderItemService.find(id).subscribe(
            (res: HttpResponse<OrderItem>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onSuccess(data, headers) {
        this.orderItem = data;
        console.log(this.orderItem);
    }

    private onError(error) {
        dialogs.alert({
            title: "Hiba a bevételezési tétel lekérésekor",
            message: error.status + error.statusMessage,
            okButtonText: "Bezárás"
        }).then(() => {
            console.log("Hiba a bevételezési tétel lekérésekor");
            this.routerExtensions.navigate(["/order-entities", this.orderEntityId]);
        });
    }

    private onEdit() {
    }

    private onDelete() {
        this.orderItemService.delete(this.orderItem.id).subscribe(
            (res: HttpResponse<any>) => this.routerExtensions.navigate(["/order-entities", this.orderEntityId]),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
}
