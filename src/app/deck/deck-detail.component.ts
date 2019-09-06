import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

import { ICardDefinition } from '../card/card-definition.interface';
import { DataService } from '../data/data.service';
import { Color } from './color.enum';
import { IDeck } from './deck.interface';

@Component({
    selector: 'ns-deck-details',
    moduleId: module.id,
    styleUrls: ['./deck-detail.component.css'],
    templateUrl: './deck-detail.component.html'
})
export class DeckDetailComponent implements OnDestroy {
    public cards: ObservableArray<ICardDefinition>;
    public deck: IDeck;
    public title: string;

    public get color() { return Color; }

    private _subscriptions: Subscription[]

    constructor(
        private _dataService: DataService,
        private _route: ActivatedRoute
    ) {
        this.title = "New Deck";
        this._subscriptions = [];

        this._subscriptions.push(this._dataService.getCardDefinitions().subscribe(cardDefinitions => {
            this.cards = new ObservableArray(cardDefinitions);
        }));

        const id = +this._route.snapshot.params.id;
        if (!id) return;

        this._subscriptions.push(this._dataService.getDeck(id).subscribe(deck => {
            this.deck = deck;
            this.title = this.deck.name;
        }));
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    public hasColor(color: Color): boolean {
        return this.deck ? !!(this.deck.colorIdentity & color) : false;
    }
}
