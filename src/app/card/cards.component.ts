import { Component, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

import { DataService } from '../data/data.service';
import { CardDialogComponent } from './card-dialog.component';
import { ICardInstance } from './card-instance.interface';

@Component({
    selector: 'ns-cards',
    moduleId: module.id,
    templateUrl: './cards.component.html'
})
export class CardsComponent {
    public cards: ObservableArray<ICardInstance>;
    public showDialog: boolean;

    constructor(
        private _dataService: DataService,
        private _modalDialogService: ModalDialogService,
        private _viewContainerRef: ViewContainerRef
    ) {
        this._dataService.getCardDefinitions().subscribe(cards => {
            this.cards = new ObservableArray([
                {
                    id: 1,
                    name: 'Sol Ring'
                },
                {
                    id: 2,
                    name: 'Sad Robot'
                }
            ]);
        });
    }

    public openDialog(card: ICardInstance): void {
        const options: ModalDialogOptions = {
            context: { card },
            fullscreen: true,
            viewContainerRef: this._viewContainerRef
        };

        this._modalDialogService.showModal(CardDialogComponent, options);
    }
}
