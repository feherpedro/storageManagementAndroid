import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import * as app from "application";
import { ModalDialogService } from "nativescript-angular";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { switchMap } from "rxjs/operators";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { OrderEntity } from "~/order-entity/order-entity.model";
import { OrderEntityService } from "~/order-entity/order-entity.service";
import { OrderItemDialogComponent } from "~/order-entity/order-item-dialog.component";
import { OrderItem } from "~/order-entity/order-item.model";
import { OrderItemService } from "~/order-entity/order-item.service";

@Component({
    selector: "OrderEntityDetail",
    moduleId: module.id,
    templateUrl: "./order-entity-detail.component.html"
})
export class OrderEntityDetailComponent implements OnInit {

    private orderEntity: OrderEntity = new OrderEntity();
    private orderItems: OrderItem[] = [];

    constructor(private barcodeScanner: BarcodeScanner,
                private orderEntityService: OrderEntityService,
                private orderItemService: OrderItemService,
                private pageRoute: PageRoute,
                private modal: ModalDialogService,
                private vcRef: ViewContainerRef,
                private routerExtensions: RouterExtensions) {
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
        this.orderEntityService.find(id).subscribe(
            (res: HttpResponse<OrderEntity>) => {
                this.onSuccess(res.body, res.headers);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onSuccess(data, headers) {
        this.orderEntity = data;
        console.log(this.orderEntity);
    }

    private onOrderItemSuccess(data, headers, id) {
        this.orderItems = data;
        this.orderEntity.orderItemList = this.orderItems.filter((x) => x.orderEntityId === id);
        console.log(this.orderItems);
    }

    private onError(error) {
        console.log("Hiba a bevételezés lekérésekor");
    }

    private onNewOrderItem() {
        const options = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(OrderItemDialogComponent, options).then((res) => {
            console.log(res);
            if (res) {
                this.loadOrderItems(this.orderEntity.id);
                // this.onDetailTap(res);
            }
        });
    }

    private onDetailTap(orderItem: OrderItem) {
        this.routerExtensions.navigate(["/order-entities", this.orderEntity.id, "order-items", orderItem.id]);
    }

    private loadOrderItems(id) {
        this.orderItemService.query().subscribe(
            (res: HttpResponse<OrderItem[]>) => this.onOrderItemSuccess(res.body, res.headers, id),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onRaktarba() {
        this.orderEntityService.placeIntoProducts(this.orderEntity.orderItemList, this.orderEntity.id).subscribe(
            (res: HttpResponse<OrderEntity>) => {
                this.load(this.orderEntity.id);
                dialogs.alert({
                    title: "Sikeres művelet",
                    message: "Sikeresen hozzáadta a raktárkészlethez a bevételezendő termékeket",
                    okButtonText: "Bezárás"
                }).then(() => {
                    console.log("Dialog closed!");
                });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
}
