import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnInit, ViewContainerRef } from "@angular/core";
import * as app from "application";
import { ModalDialogService } from "nativescript-angular";
import { RouterExtensions } from "nativescript-angular/router";
import { BarcodeScanner } from "nativescript-barcodescanner";
// import { TNSFancyAlert } from "nativescript-fancyalert";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as FrameModule from "ui/frame";
import * as Utils from "utils/utils";
import { OrderEntityDialogComponent } from "~/order-entity/order-entity-dialog.component";
import { OrderEntity } from "~/order-entity/order-entity.model";
import { OrderEntityService } from "~/order-entity/order-entity.service";

@Component({
    selector: "OrderEntity",
    moduleId: module.id,
    templateUrl: "./order-entity.component.html"
})
export class OrderEntityComponent implements OnInit, AfterViewInit {

    private orderEntities: OrderEntity[];

    private MIN_X = -80;
    private MAX_X = 80;
    private THRESHOLD = 0.5;
    private selected: number;
    private isBusy = true;

    constructor(private barcodeScanner: BarcodeScanner,
                private orderEntityService: OrderEntityService,
                private modal: ModalDialogService,
                private vcRef: ViewContainerRef,
                private routerExtensions: RouterExtensions) {
    }

    ngOnInit(): void {
        // setTimeout(() => {
        //     this.loadAll();
        // }, 0);
    }

    ngAfterViewInit(): void {
        // setTimeout(() => {
            this.loadAll();
        // }, 0);
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    loadAll() {
        this.orderEntityService.query().subscribe(
            (res: HttpResponse<OrderEntity[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onSuccess(data, headers) {
        // this.links = this.parseLinks.parse(headers.get('link'));
        // this.totalItems = headers.get('X-Total-Count');
        // this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.orderEntities = data;
        this.isBusy = false;
        console.log(this.orderEntities);
    }

    private onError(error) {
        console.log("Hiba a bevételezések lekérésekor");
    }

    private onNewOrderEntity() {
        const options = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(OrderEntityDialogComponent, options).then((res) => {
            console.log(res);
            if (res) {
                this.loadAll();
                this.onDetailTap(res);
            }
        });
    }

    private onDetailTap(orderEntity: OrderEntity) {
        this.routerExtensions.navigate(["/order-entities", orderEntity.id]);
    }

    /*private onForegroundPan(arg: PanGestureEventData) {
        const absLayout: AbsoluteLayout = <AbsoluteLayout>arg.object,
            newX: number = absLayout.translateX + arg.deltaX;

        if (newX >= this.MIN_X && newX <= this.MAX_X) {
            absLayout.translateX = newX;
        }
        if (arg.state === GestureStateTypes.ended && !(newX === this.MIN_X || newX === this.MAX_X)) {
            // init our destination X coordinate to 0, in case neither THRESHOLD has been hit
            let destX: number = 0;

            // if user hit or crossed the THESHOLD either way, let's finish in that direction
            if (newX <= this.MIN_X * this.THRESHOLD) {
                destX = this.MIN_X;
            } else if (newX >= this.MAX_X * this.THRESHOLD) {
                destX = this.MAX_X;
            }

            absLayout.animate({
                translate: { x: destX, y: 0 },
                duration: 200
            });
        }
    }

    private editPerson(arg: EventData) {
        const dataItem = (<View>arg.object).bindingContext,
            personList: any[] = (<View>arg.object).page.bindingContext.orderEntities,
            idxToEdit = personList.indexOf(dataItem);

        console.log(`Edit item #${idxToEdit + 1} - ${dataItem.id}`);
    }

    private deletePerson(arg: EventData) {
        const dataItem = (<View>arg.object).bindingContext,
            personList: any[] = (<View>arg.object).page.bindingContext.orderEntities,
            idxToDelete = personList.indexOf(dataItem);

        console.log(`Delete item #${idxToDelete + 1} - ${dataItem.id}`);
    }*/
    private onPullToRefreshInitiated(args: any) {
        const radListView = args.object;
        setTimeout(() => {
            this.loadAll();
            radListView.notifyPullToRefreshFinished();
        }, 500);
    }
    private onSwipeCellStarted(args: ListViewEventData) {
        const swipeLimits = args.data.swipeLimits;
        swipeLimits.threshold = 40 * Utils.layout.getDisplayDensity();
        swipeLimits.left = 80 * Utils.layout.getDisplayDensity();
        swipeLimits.right = 80 * Utils.layout.getDisplayDensity();
        this.selected = args.index;
    }
    private onDelete() {
        const radListView = <RadListView> FrameModule.topmost().currentPage.getViewById("radlistview");
        // Toast.makeText("Deleted").show();
        // this.orderEntities.splice(this.selected, 1);
        // TNSFancyAlert.showSuccess("Sikeresen törölve", "Something finished successfully.", "Bezárás");
        radListView.notifySwipeToExecuteFinished();
    }
    private onEdit() {
        const radListView = <RadListView> FrameModule.topmost().currentPage.getViewById("radlistview");
        // Toast.makeText("Archived").show();
        // this.orderEntities.splice(this.selected, 1);
        // TNSFancyAlert.showSuccess("Sikeresen módosítva", "Something finished successfully.", "Bezárás");
        radListView.notifySwipeToExecuteFinished();
    }
}
