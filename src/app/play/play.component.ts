import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { ActionBar } from 'tns-core-modules/ui/action-bar/action-bar';
import { EventData } from 'tns-core-modules/ui/page/page';

import { ICatalog } from '../catalog/catalog.interface';
import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { IDeck } from '../deck/deck.interface';

@Component({
    selector: 'ns-play',
    moduleId: module.id,
    templateUrl: './play.component.html'
})
export class PlayComponent extends SubscriptionComponent implements OnDestroy {
    public catalogs: ObservableArray<ICatalog>;
    public deck: IDeck;

    private _deckId: number;

    constructor(
        private _dataService: DataService,
        private _route: ActivatedRoute
    ) {
        super();

        this._deckId = +this._route.snapshot.params.deckId;

        this.subscriptions.push(this._dataService.getDeck(this._deckId).subscribe(deck => {
            this.deck = deck;
        }));
        this.subscriptions.push(this._dataService.getCatalogs(this._deckId).subscribe(catalogs => {
            this.catalogs = new ObservableArray(catalogs);
        }));
    }

    public setActionBarTitle(args: EventData): void {
        const actionBar: ActionBar = args.object as ActionBar;
        actionBar.title = 'Play: ' + this.deck.name;
    }
}
