import { User } from "~/app/shared/user.model";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, Headers } from "@angular/http";
import * as ApplicationSettings from "tns-core-modules/application-settings";
// import "rxjs/Rx";
import { map } from "rxjs/operators";
import { Account } from "~/app/shared/account.model";

// import { Observable } from "rxjs";

@Injectable()
export class UserService {

    private resourceUrl =  "https://storage-management-spring.herokuapp.com";
    private resourceUrl2 =  "http://192.168.0.213:8080";

    constructor(private http: HttpClient) { }

    isUserLoggedIn(): boolean {
        // return !!Kinvey.User.getActiveUser();
        // return null;

        return !!ApplicationSettings.getString("authenticationToken");
    }

    register(user: User) {
        const headers = new HttpHeaders({ "Content-Type": "application/json" });
        // const options = new HttpParams({ headers: headers });

        user.createdBy = "android";
        user.activated = true;

        return this.http.post(this.resourceUrl + "/api/register", JSON.stringify(
            { email: "", login: user.login, password: user.password, rememberMe: true }), {headers: headers})
        .pipe(map((result) => result)).toPromise();
        // return this.http.post(this.resourceUrl + "api/register", user).subscribe(null);

        /*return Kinvey.User.signup({ username: user.email, password: user.password })
        .catch(this.handleErrors);*/
    }

    login(user: User) {
        /*return Kinvey.User.login(user.email, user.password)
        .catch(this.handleErrors);*/
        // return this.http.post(this.resourceUrl + "/api/authenticate", user).toPromise();

        const headers = new HttpHeaders({ "Content-Type": "application/json" });
        // const options = new RequestOptions({ headers: headers });

        return this.http.post(this.resourceUrl + "/api/authenticate", JSON.stringify(
            { username: user.username, password: user.password, rememberMe: user.rememberMe }),
            {headers: headers, observe: "response"})
        .pipe(map((result) => {
            // result.json();
            const bearerToken = result.headers.get("Authorization");
            if (bearerToken && bearerToken.slice(0, 7) === "Bearer ") {
                const jwt = bearerToken.slice(7, bearerToken.length);
                ApplicationSettings.setString("authenticationToken", jwt);

                return jwt;
            }
        })).toPromise();
    }

    logout() {
        /*return Kinvey.User.logout()
        .catch(this.handleErrors);*/
        ApplicationSettings.setString("authenticationToken", "");
        ApplicationSettings.setBoolean("isAdmin", false);
        ApplicationSettings.setBoolean("isUser", false);
        ApplicationSettings.setBoolean("isStoreKeeper", false);
        ApplicationSettings.setString("username", "");
        // ApplicationSettings.clear();
    }

    resetPassword(email) {
        /*return Kinvey.User.resetPassword(email)
        .catch(this.handleErrors);*/
        return null;
    }

    getUser() {
        const headers = new HttpHeaders({ Authorization: "Bearer " + ApplicationSettings.getString("authenticationToken")});

        return this.http.get<Account>(this.resourceUrl + "/api/account", {headers: headers}).toPromise().then((response) => {

            ApplicationSettings.setString("username", response.login);
            if (response.authorities.indexOf("ROLE_ADMIN") !== -1) {
                ApplicationSettings.setBoolean("isAdmin", true);
            }
            if (response.authorities.indexOf("ROLE_USER") !== -1) {
                ApplicationSettings.setBoolean("isUser", true);
            }
            if (response.authorities.indexOf("ROLE_STOREKEEPER") !== -1) {
                ApplicationSettings.setBoolean("isStoreKeeper", true);
            }
        });
    }

    /*handleErrors(error: Kinvey.BaseError) {
        console.error(error.message);

        return Promise.reject(error.message);
    }*/
}
