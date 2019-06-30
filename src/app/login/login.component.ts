import { Component, ElementRef, ViewChild } from "@angular/core";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";

import { User } from "../shared/user.model";
import { UserService } from "../shared/user.service";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

@Component({
    selector: "app-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
    isLoggingIn = true;
    user: User;
    processing = false;
    @ViewChild("login", {static: false}) username: ElementRef;
    @ViewChild("password", {static: false}) password: ElementRef;
    @ViewChild("confirmPassword", {static: false}) confirmPassword: ElementRef;

    constructor(private page: Page, private userService: UserService, private routerExtensions: RouterExtensions) {
        // this.page.actionBarHidden = true;
        this.user = new User();
        // this.user.email = "admin";
        // this.user.login = "admin";
        // this.user.username = "admin";
        // this.user.password = "admin";
        this.user.rememberMe = true;
    }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    submit() {
        if (!this.user.username || !this.user.password) {
            this.alert("Kérem adja meg felhasználónevét és jelszavát is!");

            return;
        }

        this.processing = true;
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {
        this.userService.login(this.user)
            .then(() => {
                this.userService.getUser();
                this.processing = false;
                this.routerExtensions.navigate(["/home"], { clearHistory: true });
            })
            .catch(() => {
                this.processing = false;
                this.alert("Sikertelen bejelentkezés");
            });
    }

    register() {
        if (this.user.password !== this.user.confirmPassword) {
            this.alert("Nem egyezik a két jelszó!");

            return;
        }
        this.user.login = this.user.username;
        this.userService.register(this.user)
            .then(() => {
                this.processing = false;
                this.alert("A felhasználói fiók sikeresen létrehozva!");
                this.isLoggingIn = true;
                this.userService.getUser();
                this.routerExtensions.navigate(["/home"], { clearHistory: true });
            }, () => {
                this.processing = false;
                this.alert("Sikertelen regisztráció");
            });
            /*.catch(() => {
                this.processing = false;
                this.alert("Sikertelen regisztráció");
            });*/
    }

    forgotPassword() {
        prompt({
            title: "Elfelejtett jelszó",
            message: "Adja meg fiókja email címét",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Mégse"
        }).then((data) => {
            if (data.result) {
                this.userService.resetPassword(data.text.trim())
                    .then(() => {
                        this.alert("Jelszó visszaállítása sikeres, ellenőrizze email fiókját");
                    }).catch(() => {
                        this.alert("Hiba történt a jelszó visszaállítása közben");
                    });
            }
        });
    }

    focusLogin() {
        this.username.nativeElement.focus();
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPassword.nativeElement.focus();
        }
    }

    alert(message: string) {
        return alert({
            title: "Raktár",
            okButtonText: "OK",
            message: message
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
