import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardDialogComponent } from './card/card-dialog.component';
import { CardsComponent } from './card/cards.component';
import { IfAndroidDirective } from './common/directives/android-platform.directive';
import { IfIosDirective } from './common/directives/ios-platform.directive';
import { DecksComponent } from './deck/decks.component';
import { DeckDetailComponent } from './deck/deck-detail.component';
import { PlayComponent } from './play/play.component';
import { PlayConfirmComponent } from './play/play-confirm.component';

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
export class AppModule { }
