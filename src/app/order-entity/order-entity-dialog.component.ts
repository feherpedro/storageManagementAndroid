import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { Observable } from "rxjs/Observable";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { OrderEntity } from "~/order-entity/order-entity.model";
import { OrderEntityService } from "~/order-entity/order-entity.service";

@Component({
    selector: "OrderEntityDialog",
    moduleId: module.id,
    templateUrl: "./order-entity-dialog.component.html"
})
export class OrderEntityDialogComponent implements OnInit {

    @ViewChild("datePicker") datePicker: ElementRef;

    orderEntity = new OrderEntity();
    isSaving: boolean;

    constructor(private barcodeScanner: BarcodeScanner,
                private params: ModalDialogParams,
                private orderEntityService: OrderEntityService) {
    }

    ngOnInit(): void {
        this.isSaving = false;
    }

    save() {
        this.isSaving = true;
        const datePickerView = <DatePicker>this.datePicker.nativeElement;
        this.orderEntity.createDate = new Date(datePickerView.year, datePickerView.month - 1, datePickerView.day + 1);
        this.subscribeToSaveResponse(
            this.orderEntityService.create(this.orderEntity));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<OrderEntity>>) {
        result.subscribe((res: HttpResponse<OrderEntity>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError(res));
    }

    private onSaveError(error) {
        this.isSaving = false;
        console.log("Hiba: " + error.message);
    }

    private onSaveSuccess(result: OrderEntity) {
        console.log(result);
        this.params.closeCallback(result);
    }

    private onClose() {
        this.params.closeCallback(false);
    }
}
