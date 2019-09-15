import { Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { ActionBar } from 'tns-core-modules/ui/action-bar/action-bar';
import { EventData } from 'tns-core-modules/ui/page/page';

import { ICatalog } from '../catalog/catalog.interface';
import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { IDeck } from '../deck/deck.interface';
import { PlayItemComponent } from './play-item.component';

@Component({
    selector: 'ns-play',
    moduleId: module.id,
    styleUrls: ['./play.component.css'],
    templateUrl: './play.component.html'
})
export class PlayComponent extends SubscriptionComponent implements OnDestroy {
    public catalogs: ObservableArray<ICatalog>;
    public deck: IDeck;
    public deckId: number;
    public hasCatalogs: boolean;

    @ViewChildren('playItem') public playItems: QueryList<PlayItemComponent>;

    constructor(
        private _dataService: DataService,
        private _route: ActivatedRoute,
        private _routerExtensions: RouterExtensions
    ) {
        super();

        this.deckId = +this._route.snapshot.params.deckId;
        this.hasCatalogs = false;

        this.subscriptions.push(this._dataService.getDeck(this.deckId).subscribe(deck => {
            this.deck = deck;
        }));
        this.subscriptions.push(this._dataService.getCatalogsForDeck(this.deckId).subscribe(catalogs => {
            this.catalogs = new ObservableArray(catalogs);
            this.hasCatalogs = this.catalogs ? this.catalogs.length > 0 : null;
        }));
    }

    public setActionBarTitle(args: EventData): void {
        const actionBar: ActionBar = args.object as ActionBar;
        actionBar.title = 'Play: ' + this.deck.name;
    }

    public submit(): void {
        const selectedCardInstanceIds: number[] = this.playItems.map(playItem => playItem.selectedCardInstanceId).filter(id => !!id);
        const queryParams = { deckId: this.deckId, cardInstanceIds: selectedCardInstanceIds };
        this._routerExtensions.navigate(['playConfirm'], { queryParams });
    }
}
