import { Component, ViewContainerRef, OnDestroy } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

import { DataService } from '../data/data.service';
import { CardDialogComponent } from './card-dialog.component';
import { ICardInstanceDetail } from './card-instance-detail.interface';

@Component({
    selector: 'ns-cards',
    moduleId: module.id,
    styleUrls: ['./cards.component.css'],
    templateUrl: './cards.component.html'
})
export class CardsComponent implements OnDestroy {
    public cards: ObservableArray<ICardInstanceDetail>;
    public showDialog: boolean;

    private _cardInstanceDetails: ICardInstanceDetail[];
    private _subscriptions: Subscription[];

    constructor(
        private _dataService: DataService,
        private _modalDialogService: ModalDialogService,
        private _viewContainerRef: ViewContainerRef
    ) {
        this._subscriptions = [];
        this.populateCards();
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    public openDialog(card: ICardInstanceDetail): void {
        const options: ModalDialogOptions = {
            context: { card },
            fullscreen: true,
            viewContainerRef: this._viewContainerRef
        };

        this._modalDialogService.showModal(CardDialogComponent, options).then((result: 'submit' | 'cancel') => {
            if (result === 'submit') this.populateCards();
        });
    }

    public deleteCard(card: ICardInstanceDetail): void {
        let deleteObs = this._dataService.deleteCardInstance(card.id);

        // Delete card definition if this deleted instace is the last one to use it
        if (!this._cardInstanceDetails.some(detail => detail.id !== card.id && detail.cardDefinitionId === card.cardDefinitionId))
            deleteObs = deleteObs.pipe(
                concatMap(_ => {
                    return this._dataService.deleteCardDefinition(card.cardDefinitionId);
                })
            );

        this._subscriptions.push(deleteObs.subscribe(_ => {
            this._cardInstanceDetails = this._cardInstanceDetails.filter(detail => detail.id !== card.id);
            this.cards = new ObservableArray(this._cardInstanceDetails);
        }));
    }

    private populateCards(): void {
        this._subscriptions.push(this._dataService.getCardInstanceDetails().subscribe(details => {
            this._cardInstanceDetails = details;
            this.cards = new ObservableArray(details);
        }));
    }
}
