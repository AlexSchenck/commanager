import { Component, ViewChild } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from "nativescript-ui-autocomplete/angular";
import { ObservableArray } from 'tns-core-modules/data/observable-array';

import { DataService } from '../data/data.service';
import { ICardInstance } from './card-instance.interface';
import { ICardDefinition } from './card-definition.interface';

@Component({
    selector: 'ns-card-dialog',
    templateUrl: './card-dialog.component.html'
})
export class CardDialogComponent {
    public cardDefinitionTokens: ObservableArray<TokenModel>;
    public cardInstance: ICardInstance;

    private _cardDefinitions: ICardDefinition[];

    @ViewChild("autocomplete", { static: false }) autocomplete: RadAutoCompleteTextViewComponent;

    constructor(
        private _dataService: DataService,
        private _params: ModalDialogParams
    ) {
        this.cardInstance = this._params.context.card;
        this.cardDefinitionTokens = new ObservableArray<TokenModel>();

        this._dataService.getCardDefinitions().subscribe(cards => {
            this._cardDefinitions = cards;
            this.cardDefinitionTokens = new ObservableArray<TokenModel>(cards.map(card => new TokenModel(card.name, null)))
        });
    }

    public close(result: 'submit' | 'cancel') {
        if (result === 'cancel') {
            this._params.closeCallback(result);
            return;
        }

        const cardName = this.autocomplete.nativeElement.text;
        if (!cardName) return; // TODO add form to require this field

        const cardDefinition = this._cardDefinitions.find(card => card.name === cardName);

        // Save the card definition, then close the dialog
        this._dataService.saveCardDefinition({ id: cardDefinition ? cardDefinition.id : null, name: cardName }).subscribe(cardDefinition => {
            this._params.closeCallback(result);
        });
    }
}