export class OrderItem {
    constructor(
        public id?: number,
        public quantity?: number,
        public orderEntityId?: number,
        public productId?: number,
        public productName?: string,
        public productUnitOfMeasurement?: string,
        public productBarcode?: string,
        public statusId?: number,
        public statusName?: string
    ) {
    }
}
