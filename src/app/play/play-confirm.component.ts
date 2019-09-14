import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Observable } from 'rxjs';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

import { ICardInstance } from '../card/card-instance.interface';
import { ICardInstanceDetail } from '../card/card-instance-detail.interface';
import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { IDeck } from '../deck/deck.interface';

interface IListViewItem {
    deckId: number;
    cardNames: string[];
}

@Component({
    selector: 'ns-play-confirm',
    moduleId: module.id,
    templateUrl: './play-confirm.component.html'
})
export class PlayConfirmComponent extends SubscriptionComponent implements OnInit, OnDestroy {
    public decks: Observable<IDeck[]>;
    public updates: ObservableArray<IListViewItem>;

    private _deckId: number;
    private _cardInstanceDetails: ICardInstanceDetail[];
    private _cardInstanceIds: number[];

    constructor(
        private _dataService: DataService,
        private _route: ActivatedRoute,
        private _routerExtensions: RouterExtensions
    ) {
        super();
    }

    public ngOnInit(): void {
        this._deckId = +this._route.snapshot.queryParams['deckId'];
        this._cardInstanceIds = this._route.snapshot.queryParams['cardInstanceIds'].map(id => +id);

        this.subscriptions.push(this._dataService.getCardInstanceDetails(this._cardInstanceIds).subscribe(cardInstanceDetails => {
            this._cardInstanceDetails = cardInstanceDetails;
            const updates = this.toUpdates(this._cardInstanceDetails);
            this.updates = new ObservableArray(Object.keys(updates).map(updateKey => ({ deckId: +updateKey, cardNames: updates[updateKey] })));
        }));
    }

    public submit(): void {
        const instancesToSave: ICardInstance[] = this._cardInstanceDetails.map(detail => ({ id: detail.id, cardDefinitionId: detail.cardDefinitionId, currentDeckId: this._deckId }));
        this.subscriptions.push(this._dataService.saveCardInstances(instancesToSave).subscribe(_ => {
            this._routerExtensions.navigateByUrl('decks');
        }));
    }

    private toUpdates(details: ICardInstanceDetail[]): { [deckId: number]: string[] } {
        if (!details) return {};

        const result: { [deckId: number]: string[] } = {};
        details.forEach(detail => {
            const deckId = detail.currentDeckId || 0;
            return result[deckId] ?
                result[deckId].push(detail.cardDefinitionName) :
                result[deckId] = [detail.cardDefinitionName];
        });

        return result;
    }
}
