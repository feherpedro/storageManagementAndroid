import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UserService } from "~/app/shared/user.service";
import { NativeScriptFormsModule, NativeScriptHttpModule } from "nativescript-angular";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { LoginComponent } from "~/app/login/login.component";
// import { registerElement } from "nativescript-angular";
// registerElement("PreviousNextView", () => require("nativescript-iqkeyboardmanager").PreviousNextView);

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        NativeScriptHttpModule,
        NativeScriptUISideDrawerModule
    ],
    declarations: [
        AppComponent,
        LoginComponent
    ],
    providers: [
        UserService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
