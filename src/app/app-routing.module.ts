import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { CardsComponent } from './card/cards.component';
import { DecksComponent } from './deck/decks.component';
import { DeckDetailComponent } from './deck/deck-detail.component';
import { PlayComponent } from './play/play.component';
import { PlayConfirmComponent } from './play/play-confirm.component';

const routes: Routes = [
    { path: '', redirectTo: '/decks', pathMatch: 'full' },
    { path: 'cards', component: CardsComponent },
    { path: 'deck', component: DeckDetailComponent },
    { path: 'deck/:id', component: DeckDetailComponent },
    { path: 'decks', component: DecksComponent },
    { path: 'play/:id', component: PlayComponent },
    { path: 'playConfirm', component: PlayConfirmComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
