import { User } from "~/app/shared/user.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Http, RequestOptions, Headers } from "@angular/http";
// import "rxjs/Rx";
import { map } from "rxjs/operators";
// import { Observable } from "rxjs";

@Injectable()
export class UserService {

    private resourceUrl =  "https://storage-management-spring.herokuapp.com";

    constructor(private http: Http) { }

    static isUserLoggedIn() {
        // return !!Kinvey.User.getActiveUser();
        return null;
    }

    register(user: User) {
        const headers = new Headers({ "Content-Type": "application/json" });
        const options = new RequestOptions({ headers: headers });

        user.createdBy = "android";
        user.activated = true;

        return this.http.post(this.resourceUrl + "api/users", JSON.stringify(
            { email: user.email, login: user.login, password: user.password, rememberMe: true }), options)
        .pipe(map((result) => result.json()));
        // return this.http.post(this.resourceUrl + "api/register", user).subscribe(null);

        /*return Kinvey.User.signup({ username: user.email, password: user.password })
        .catch(this.handleErrors);*/
    }

    login(user: User) {
        /*return Kinvey.User.login(user.email, user.password)
        .catch(this.handleErrors);*/
        return this.http.post(this.resourceUrl + "api/authenticate", user).toPromise();
    }

    logout() {
        /*return Kinvey.User.logout()
        .catch(this.handleErrors);*/
        return null;
    }

    resetPassword(email) {
        /*return Kinvey.User.resetPassword(email)
        .catch(this.handleErrors);*/
        return null;
    }

    /*handleErrors(error: Kinvey.BaseError) {
        console.error(error.message);

        return Promise.reject(error.message);
    }*/
}
