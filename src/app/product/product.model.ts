export class Product {
    constructor(
        public id?: number,
        public name?: string,
        public price?: number,
        public quantity?: number,
        public unitOfMeasurement?: string,
        public barcode?: string,
        public productCategoryId?: number,
        public productCategoryName?: string,
        public priceCategoryId?: number,
        public priceCategoryName?: string,
        public statusId?: number,
        public statusName?: string
    ) {
    }
}
