import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { DecksComponent } from './deck/decks.component'
import { DeckDetailComponent } from './deck/deck-detail.component';
import { ItemsComponent } from './item/items.component';
import { ItemDetailComponent } from './item/item-detail.component';
import { PlayComponent } from './play/play.component';
import { PlayConfirmComponent } from './play/play-confirm.component';

const routes: Routes = [
    { path: '', redirectTo: '/decks', pathMatch: 'full' },
    { path: 'deck', component: DeckDetailComponent },
    { path: 'deck/:id', component: DeckDetailComponent },
    { path: 'decks', component: DecksComponent },
    { path: 'item/:id', component: ItemDetailComponent },
    { path: 'items', component: ItemsComponent },
    { path: 'play/:id', component: PlayComponent },
    { path: 'playConfirm', component: PlayConfirmComponent }

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
