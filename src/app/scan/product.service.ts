import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

import { Product } from "./product.model";
// import { createRequestOption } from "../../shared";

export type EntityResponseType = HttpResponse<Product>;

@Injectable()
export class ProductService {

    private resourceUrl =  "https://storage-management-spring.herokuapp.com/api/products";
    private resourceSearchUrl = "https://storage-management-spring.herokuapp.com/api/_search/products";

    constructor(private http: HttpClient) { }

    create(product: Product): Observable<EntityResponseType> {
        const copy = this.convert(product);

        return this.http.post<Product>(this.resourceUrl, copy, { observe: "response" })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(product: Product): Observable<EntityResponseType> {
        const copy = this.convert(product);

        return this.http.put<Product>(this.resourceUrl, copy, { observe: "response" })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {

        return this.http.get<Product>(`${this.resourceUrl}/${id}`, { observe: "response"})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Product[]>> {
        // const options = createRequestOption(req);

        return this.http.get<Product[]>(this.resourceUrl, { observe: "response" })/* params: options,*/
            .map((res: HttpResponse<Product[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {

        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: "response"});
    }

    search(req?: any): Observable<HttpResponse<Product[]>> {
        // const options = createRequestOption(req);

        return this.http.get<Product[]>(this.resourceSearchUrl, { observe: "response" })/* params: options,*/
            .map((res: HttpResponse<Product[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Product = this.convertItemFromServer(res.body);

        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Product[]>): HttpResponse<Product[]> {
        const jsonResponse: Product[] = res.body;
        const body: Product[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }

        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Product.
     */
    private convertItemFromServer(product: Product): Product {
        const copy: Product = Object.assign({}, product);

        return copy;
    }

    /**
     * Convert a Product to a JSON which can be sent to the server.
     */
    private convert(product: Product): Product {
        const copy: Product = Object.assign({}, product);

        return copy;
    }
}
