import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IfAndroidDirective } from './common/directives/android-platform.directive';
import { IfIosDirective } from './common/directives/ios-platform.directive';
import { CardDialogComponent } from "./card/card-dialog.component";
import { CardsComponent } from "./card/cards.component";
import { DecksComponent } from './deck/decks.component';
import { DeckDetailComponent } from './deck/deck-detail.component';
import { ItemsComponent } from './item/items.component';
import { ItemDetailComponent } from './item/item-detail.component';
import { PlayComponent } from "./play/play.component"
import { PlayConfirmComponent } from "./play/play-confirm.component";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUIAutoCompleteTextViewModule,
        NativeScriptUISideDrawerModule,
        TNSCheckBoxModule
    ],
    declarations: [
        AppComponent,
        CardDialogComponent,
        CardsComponent,
        DecksComponent,
        DeckDetailComponent,
        IfAndroidDirective,
        IfIosDirective,
        ItemsComponent,
        ItemDetailComponent,
        PlayComponent,
        PlayConfirmComponent
    ],
    entryComponents: [
        CardDialogComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
