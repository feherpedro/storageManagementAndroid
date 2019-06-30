import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { UserService } from "~/app/shared/user.service";
import { RouterExtensions } from "nativescript-angular";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    message = "You have successfully authenticated. This is where you build your core application functionality.";

    constructor(private userService: UserService, private routerExtensions: RouterExtensions) {
    }

    ngOnInit(): void {
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    logout() {
        this.userService.logout();
        this.routerExtensions.navigate(["/login"], { clearHistory: true });
    }
}
