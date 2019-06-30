import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import { UserService } from "~/app/shared/user.service";
import { alert } from "tns-core-modules/ui/dialogs";
import * as ApplicationSettings from "tns-core-modules/application-settings";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(private router: Router, private routerExtensions: RouterExtensions, private userService: UserService) {
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    logout() {
        this.userService.logout();
        this.onNavItemTap("/login");
        // this.routerExtensions.navigate(["/login"]);
        alert({
            title: "Kijelentkezés",
            okButtonText: "OK",
            message: "Sikeres kijelentkezés"
        });
    }

    isUserLoggedIn() {
        return this.userService.isUserLoggedIn();
    }

    get username() {
        if (this.userService.isUserLoggedIn()) {
            return ApplicationSettings.getString("username", "");
        } else {
            return "";
        }
    }

    isAdminOrStoreKeeper() {

        return ApplicationSettings.getBoolean("isAdmin") || ApplicationSettings.getBoolean("isStoreKeeper");
    }
}
