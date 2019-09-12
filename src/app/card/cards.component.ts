import { Component, ViewContainerRef, OnDestroy } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { from, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { confirm } from 'tns-core-modules/ui/dialogs';

import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { CardDialogComponent } from './card-dialog.component';
import { CardDialogResult } from './card-dialog-result.enum';
import { ICardInstanceDetail } from './card-instance-detail.interface';

@Component({
    selector: 'ns-cards',
    moduleId: module.id,
    styleUrls: ['./cards.component.css'],
    templateUrl: './cards.component.html'
})
export class CardsComponent extends SubscriptionComponent implements OnDestroy {
    public cards: ObservableArray<ICardInstanceDetail>;
    public showDialog: boolean;

    private _cardInstanceDetails: ICardInstanceDetail[];

    constructor(
        private _dataService: DataService,
        private _modalDialogService: ModalDialogService,
        private _viewContainerRef: ViewContainerRef
    ) {
        super();

        this.populateCards();
    }

    public openDialog(card: ICardInstanceDetail): void {
        // Selected instance is last representation of its definition, send this info to the card dialog
        const isOnlyInstanceOfDefinition = card ? !this._cardInstanceDetails.some(detail => card.id !== detail.id && card.cardDefinitionId === detail.cardDefinitionId) : false;

        const options: ModalDialogOptions = {
            context: { card, isOnlyInstanceOfDefinition },
            fullscreen: true,
            viewContainerRef: this._viewContainerRef
        };

        this._modalDialogService.showModal(CardDialogComponent, options).then((result: CardDialogResult) => {
            if (result === CardDialogResult.Submit) this.populateCards();
        });
    }

    public deleteCard(card: ICardInstanceDetail): void {
        const confirmOptions = {
            title: 'Confirm',
            message: 'Are you sure you want to delete this card?',
            okButtonText: 'Yes',
            cancelButtonText: 'No'
        };

        let deleteObs: Observable<number> = from(confirm(confirmOptions)).pipe(
            concatMap(confirm => confirm ? this._dataService.deleteCardInstance(card.id) : of(null))
        );

        // Delete card definition if this deleted instace is the last one to use it
        if (!this._cardInstanceDetails.some(detail => detail.id !== card.id && detail.cardDefinitionId === card.cardDefinitionId))
            deleteObs = deleteObs.pipe(
                concatMap(result => result ? this._dataService.deleteCardDefinition(card.cardDefinitionId) : of(null))
            );

        this.subscriptions.push(deleteObs.subscribe(result => {
            if (!result) return;

            this._cardInstanceDetails = this._cardInstanceDetails.filter(detail => detail.id !== card.id);
            this.cards = new ObservableArray(this._cardInstanceDetails);
        }));
    }

    private populateCards(): void {
        this.subscriptions.push(this._dataService.getCardInstanceDetails().subscribe(details => {
            details = details.sort((a, b) => {
                if (a.cardDefinitionName === b.cardDefinitionName)
                    return a.currentDeckName > b.currentDeckName ? 1 : -1;

                return a.cardDefinitionName > b.cardDefinitionName ? 1 : -1;
            });
            this._cardInstanceDetails = details;
            this.cards = new ObservableArray(details);
        }));
    }
}
