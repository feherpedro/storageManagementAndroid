import { OrderItem } from "~/order-entity/order-item.model";

export class OrderEntity {
    constructor(
        public id?: number,
        public createDate?: any,
        public paymentDate?: any,
        public dueDate?: any,
        public statusId?: number,
        public statusName?: string,
        public orderItemList?: OrderItem[]
    ) {
        this.orderItemList = [];
    }
}
