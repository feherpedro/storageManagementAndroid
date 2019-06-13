import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DateHelperService } from "../date-helper.service";
import { OrderEntity } from "./order-entity.model";
import { OrderItem } from "./order-item.model";

import { map } from "rxjs/operators";
// import { createRequestOption } from "../../shared";

export type EntityResponseType = HttpResponse<OrderEntity>;

@Injectable()
export class OrderEntityService {

    private resourceUrl =  "https://storage-management-spring.herokuapp.com/api/order-entities";
    private resourceSearchUrl = "https://storage-management-spring.herokuapp.com/api/_search/order-entities";

    constructor(private http: HttpClient, private dateHelperService: DateHelperService) { }

    create(orderEntity: OrderEntity): Observable<EntityResponseType> {
        const copy = this.convert(orderEntity);

        return this.http.post<OrderEntity>(this.resourceUrl, copy, { observe: "response" })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    placeIntoProducts(orderItems: OrderItem[], id: number): Observable<EntityResponseType> {

        return this.http.post(`${this.resourceUrl}/${id}/placeIntoProducts`, orderItems, { observe: "response" })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(orderEntity: OrderEntity): Observable<EntityResponseType> {
        const copy = this.convert(orderEntity);

        return this.http.put<OrderEntity>(this.resourceUrl, copy, { observe: "response" })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    find(id: number): Observable<EntityResponseType> {

        return this.http.get<OrderEntity>(`${this.resourceUrl}/${id}`, { observe: "response"})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<OrderEntity[]>> {
        // const options = createRequestOption(req);

        return this.http.get<OrderEntity[]>(this.resourceUrl, { observe: "response" })/*params: options,*/
            .pipe(map((res: HttpResponse<OrderEntity[]>) => this.convertArrayResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {

        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: "response"});
    }

    search(req?: any): Observable<HttpResponse<OrderEntity[]>> {
        // const options = createRequestOption(req);

        return this.http.get<OrderEntity[]>(this.resourceSearchUrl, { observe: "response" })/*params: options,*/
            .pipe(map((res: HttpResponse<OrderEntity[]>) => this.convertArrayResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: OrderEntity = this.convertItemFromServer(res.body);

        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<OrderEntity[]>): HttpResponse<OrderEntity[]> {
        const jsonResponse: OrderEntity[] = res.body;
        const body: OrderEntity[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }

        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to OrderEntity.
     */
    private convertItemFromServer(orderEntity: OrderEntity): OrderEntity {
        const copy: OrderEntity = Object.assign({}, orderEntity);
        copy.createDate = this.dateHelperService
        .convertLocalDateFromServer(orderEntity.createDate);
        copy.paymentDate = this.dateHelperService
        .convertLocalDateFromServer(orderEntity.paymentDate);
        copy.dueDate = this.dateHelperService
        .convertLocalDateFromServer(orderEntity.dueDate);

        return copy;
    }

    /**
     * Convert a OrderEntity to a JSON which can be sent to the server.
     */
    private convert(orderEntity: OrderEntity): OrderEntity {
        const copy: OrderEntity = Object.assign({}, orderEntity);
        /*copy.createDate = this.dateHelperService
        .convertLocalDateToServer(orderEntity.createDate);
        copy.paymentDate = this.dateHelperService
        .convertLocalDateToServer(orderEntity.paymentDate);
        copy.dueDate = this.dateHelperService
        .convertLocalDateToServer(orderEntity.dueDate);*/

        return copy;
    }
}
