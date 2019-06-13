import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { UserService } from "~/app/shared/user.service";
import { LoginComponent } from "~/app/login/login.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    // { path: "browse", loadChildren: "~/app/browse/browse.module#BrowseModule" },
    // { path: "search", loadChildren: "~/app/search/search.module#SearchModule" },
    // { path: "featured", loadChildren: "~/app/featured/featured.module#FeaturedModule" },
    // { path: "settings", loadChildren: "~/app/settings/settings.module#SettingsModule" },
    // { path: "", redirectTo: UserService.isUserLoggedIn() ? "/home" : "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    // { path: "home", loadChildren: "./home/home.module#HomeModule" },
    { path: "scan", loadChildren: "./scan/scan.module#ScanModule" },
    { path: "products", loadChildren: "./product/product.module#ProductModule" },
    { path: "order-entities", loadChildren: "./order-entity/order-entity.module#OrderEntityModule" }
    // { path: "login", loadChildren: "./login/login.module#LoginModule" },
    // { path: "signup", loadChildren: "./signup/signup.module#SignupModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
