import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ListPicker } from 'tns-core-modules/ui/list-picker/list-picker';

import { DataService } from '../data/data.service';
import { IDeck } from '../deck/deck.interface';
import { ICardDefinition } from './card-definition.interface';
import { ICardInstanceDetail } from './card-instance-detail.interface';

@Component({
    selector: 'ns-card-dialog',
    styleUrls: ['./card-dialog.component.css'],
    templateUrl: './card-dialog.component.html'
})
export class CardDialogComponent implements AfterViewInit, OnDestroy {
    public cardDefinitionTokens: ObservableArray<TokenModel>;
    public cardInstance: ICardInstanceDetail;
    public deckItems: string[];
    public isSubmitEnabled: boolean;

    private _cardDefinitions: ICardDefinition[];
    private _decks: IDeck[];
    private _subscriptions: Subscription[];

    @ViewChild('cardAutoComplete', { static: false }) cardAutoComplete: RadAutoCompleteTextViewComponent;
    @ViewChild('deckListPicker', { static: false }) deckListPicker: ElementRef<ListPicker>;

    constructor(
        private _dataService: DataService,
        private _params: ModalDialogParams
    ) {
        this.cardInstance = this._params.context.card;
        this.cardDefinitionTokens = new ObservableArray<TokenModel>();
        this.isSubmitEnabled = false;
        this._subscriptions = [];

        this._subscriptions.push(this._dataService.getCardDefinitions().subscribe(cards => {
            this._cardDefinitions = cards;
            this.cardDefinitionTokens = new ObservableArray<TokenModel>(cards.map(card => new TokenModel(card.name, null)))
        }));
        this._subscriptions.push(this._dataService.getDecks().subscribe(decks => {
            this._decks = decks;
            this.deckItems = [' '].concat(this._decks.map(deck => deck.name));
            this.setListPickerIndex();
        }));
    }

    public ngAfterViewInit(): void {
        this.setListPickerIndex()
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private setListPickerIndex(): void {
        if (this.cardInstance && this.cardInstance.currentDeckId && this.deckListPicker) {
            this.deckListPicker.nativeElement.selectedIndex = this.deckItems.findIndex(deckItem => this.cardInstance.currentDeckName === deckItem);
        }
    }

    public onAutoCompleteLoaded(): void {
        this.cardAutoComplete.autoCompleteTextView.text = this.cardInstance ? this.cardInstance.cardDefinitionName : '';
    }

    public setSubmitEnabled(eventArgs: any): void {
        this.isSubmitEnabled = !!eventArgs.text;
    }

    public close(result: 'submit' | 'cancel'): void {
        if (result === 'cancel') {
            return this._params.closeCallback(result);
        }

        // Get the card definition object from the name given in the control, if any
        const cardName = this.cardAutoComplete.autoCompleteTextView.text;
        const cardDefinition = this._cardDefinitions.find(card => card.name === cardName);

        // Get the deck boject from the item selected in the control, if any
        const listPicker = this.deckListPicker.nativeElement;
        const deckName = listPicker.selectedIndex !== 0 ? this.deckItems[listPicker.selectedIndex] : null;
        const deck = deckName ? this._decks.find(deck => deck.name === deckName) : null;

        // Save the card definition, then the card instance using that definition, then close the dialog
        const cardDefinitionSaveObs = cardDefinition ? of(cardDefinition) : this._dataService.saveCardDefinition({ name: cardName });
        this._subscriptions.push(cardDefinitionSaveObs.pipe(
            concatMap(cardDefinition => {
                return this._dataService.saveCardInstance({
                    id: this.cardInstance ? this.cardInstance.id : null,
                    cardDefinitionId: cardDefinition.id,
                    currentDeckId: deck ? deck.id : null
                });
            })
        ).subscribe(_ => this._params.closeCallback(result)));
    }
}