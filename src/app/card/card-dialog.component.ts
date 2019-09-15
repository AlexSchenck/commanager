import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ListPicker } from 'tns-core-modules/ui/list-picker/list-picker';

import { IListPickerItem } from '../common/interfaces/list-picker-item.interface';
import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { IDeck } from '../deck/deck.interface';
import { ICardDefinition } from './card-definition.interface';
import { CardDialogResult } from './card-dialog-result.enum';
import { ICardInstanceDetail } from './card-instance-detail.interface';

@Component({
    selector: 'ns-card-dialog',
    styleUrls: ['./card-dialog.component.css'],
    templateUrl: './card-dialog.component.html'
})
export class CardDialogComponent extends SubscriptionComponent implements AfterViewInit, OnDestroy {
    public cardDefinitionTokens: ObservableArray<TokenModel>;
    public cardInstance: ICardInstanceDetail;
    public deckItems: IListPickerItem[];
    public isSubmitEnabled: boolean;

    public get cardDialogResult() { return CardDialogResult; }

    @ViewChild('cardAutoComplete', { static: false }) public cardAutoComplete: RadAutoCompleteTextViewComponent;
    @ViewChild('deckListPicker', { static: false }) public deckListPicker: ElementRef<ListPicker>;

    private _cardDefinitions: ICardDefinition[];
    private _decks: IDeck[];
    private _isOnlyInstanceOfDefinition: boolean;

    constructor(
        private _dataService: DataService,
        private _params: ModalDialogParams
    ) {
        super();

        this.cardInstance = this._params.context.card;
        this.cardDefinitionTokens = new ObservableArray<TokenModel>();
        this.isSubmitEnabled = false;
        this._isOnlyInstanceOfDefinition = !!this._params.context.isOnlyInstanceOfDefinition;

        this.subscriptions.push(this._dataService.getAllCardDefinitions().subscribe(cards => {
            this._cardDefinitions = cards;
            this.cardDefinitionTokens = new ObservableArray<TokenModel>(cards.map(card => new TokenModel(card.name, null)));
        }));
        this.subscriptions.push(this._dataService.getAllDecks().subscribe(decks => {
            this._decks = decks;
            this.deckItems = [{ id: null, toString: () => ' ' }].concat(this._decks.map(deck => ({ id: deck.id, toString: () => deck.name })));
            this.setListPickerIndex();
        }));
    }

    public ngAfterViewInit(): void {
        this.setListPickerIndex();
    }

    public onAutoCompleteLoaded(): void {
        this.cardAutoComplete.autoCompleteTextView.text = this.cardInstance ? this.cardInstance.cardDefinitionName : '';
    }

    public setSubmitEnabled(eventArgs: any): void {
        this.isSubmitEnabled = !!eventArgs.text;
    }

    public close(result: CardDialogResult): void {
        if (result === CardDialogResult.Cancel) {
            return this._params.closeCallback(result);
        }

        // Get the card definition object from the name given in the control (case-insensitive), if any
        const cardName = this.cardAutoComplete.autoCompleteTextView.text;
        const cardNameForCompare = cardName.toLowerCase();
        const existingCardDefinition = this._cardDefinitions.find(card => card.name.toLowerCase() === cardNameForCompare);

        // Get the deck object from the item selected in the control, if any
        const listPicker = this.deckListPicker.nativeElement;
        const deckItem = listPicker.selectedIndex !== 0 ? this.deckItems[listPicker.selectedIndex] : null;
        const deck = deckItem ? this._decks.find(deck => deck.id === deckItem.id) : null;

        // If this instance name is being changed, and is the last instance of its definition, update the definition name
        const cardDefinition: ICardDefinition = {
            id: this._isOnlyInstanceOfDefinition && this.cardInstance ? this.cardInstance.cardDefinitionId : null,
            name: cardName
        };

        // Save the card definition, then the card instance using that definition, then close the dialog
        const cardDefinitionSaveObs = existingCardDefinition ? of(existingCardDefinition) : this._dataService.saveCardDefinition(cardDefinition);
        this.subscriptions.push(cardDefinitionSaveObs.pipe(
            concatMap(cardDefinition =>
                this._dataService.saveCardInstance({
                    id: this.cardInstance ? this.cardInstance.id : null,
                    cardDefinitionId: cardDefinition.id,
                    currentDeckId: deck ? deck.id : null
                })
            )
        ).subscribe(_ => this._params.closeCallback(result)));
    }

    private setListPickerIndex(): void {
        if (this.cardInstance && this.cardInstance.currentDeckId && this.deckListPicker) {
            this.deckListPicker.nativeElement.selectedIndex = this.deckItems.findIndex(deckItem => this.cardInstance.currentDeckId === deckItem.id);
        }
    }
}