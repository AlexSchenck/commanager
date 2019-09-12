import { Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckBox } from '@nstudio/nativescript-checkbox';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';
import { from, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { confirm } from 'tns-core-modules/ui/dialogs';
import { TextField } from 'tns-core-modules/ui/text-field/text-field';

import { ICardDefinition } from '../card/card-definition.interface';
import { CardDialogComponent } from '../card/card-dialog.component';
import { CardDialogResult } from '../card/card-dialog-result.enum';
import { ICatalog } from '../catalog/catalog.interface';
import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { Color } from './color.enum';
import { DeckDetailResult } from './deck-detail-result.enum';
import { IDeck } from './deck.interface';

@Component({
    selector: 'ns-deck-details',
    moduleId: module.id,
    styleUrls: ['./deck-detail.component.css'],
    templateUrl: './deck-detail.component.html'
})
export class DeckDetailComponent extends SubscriptionComponent implements OnDestroy {
    public cards: ObservableArray<ICardDefinition>;
    public catalogs: ObservableArray<ICatalog>;
    public deck: IDeck;
    public isDeleteEnabled: boolean;
    public isSubmitEnabled: boolean;
    public title: string;

    public get color() { return Color; }
    public get deckDetailResult() { return DeckDetailResult; }

    @ViewChild('nameTextField', { static: false }) public nameTextField: ElementRef<TextField>;
    @ViewChild('commanderTextField', { static: false }) public commanderTextField: ElementRef<TextField>;
    @ViewChildren('catalogCheckbox') public catalogCheckboxes: QueryList<ElementRef<CheckBox>>;
    @ViewChildren('colorCheckbox') public colorCheckboxes: QueryList<ElementRef<CheckBox>>;

    constructor(
        private _dataService: DataService,
        private _modalDialogService: ModalDialogService,
        private _route: ActivatedRoute,
        private _routerExtensions: RouterExtensions,
        private _viewContainerRef: ViewContainerRef
    ) {
        super();

        this.isDeleteEnabled = false;
        this.isSubmitEnabled = false;
        this.title = 'New Deck';

        this.populateCards();

        const id = +this._route.snapshot.params.id;
        if (!id) return;

        this.isDeleteEnabled = true;
        this.isSubmitEnabled = true;

        this.subscriptions.push(this._dataService.getDeck(id).subscribe(deck => {
            this.deck = deck;
            this.title = this.deck.name;
        }));
        this.subscriptions.push(this._dataService.getCatalogs(id).subscribe(catalogs => {
            this.catalogs = new ObservableArray(catalogs);
        }));
    }

    public setSubmitEnabled(eventArgs: any): void {
        this.isSubmitEnabled = !!eventArgs.value;
    }

    public hasCatalog(cardDefinitionId: number): boolean {
        return this.catalogs ? !!(this.catalogs.some(catalog => catalog.cardDefinitionId === cardDefinitionId)) : false;
    }

    public hasColor(color: Color): boolean {
        return this.deck ? !!(this.deck.colorIdentity & color) : false;
    }

    public close(result: DeckDetailResult): void {
        let resultObs = of(null);

        switch (result) {
            case DeckDetailResult.Submit:
                let colorIdentity: Color = null;
                this.colorCheckboxes.forEach(checkboxRef => {
                    const checkbox = checkboxRef.nativeElement;
                    if (!checkbox.checked) return;

                    // Add the color to the color identity if the checkbox is checked
                    const colorValue: Color = +checkbox.id;
                    colorIdentity = colorIdentity ? colorIdentity |= colorValue : colorValue;
                });

                resultObs = this._dataService.saveDeck({
                    id: this.deck ? this.deck.id : null,
                    name: this.nameTextField.nativeElement.text,
                    commander: this.commanderTextField.nativeElement.text,
                    colorIdentity
                }).pipe(
                    concatMap(deck => {
                        const cardDefinitionIds: number[] = [];
                        this.catalogCheckboxes.forEach(checkboxRef => {
                            // If checked, add this card definition to the deck's catalog
                            const checkbox = checkboxRef.nativeElement;
                            if (checkbox.checked) cardDefinitionIds.push(+checkbox.id);
                        });
                        return this._dataService.saveCatalogs(deck.id, cardDefinitionIds);
                    })
                );
                break;
            case DeckDetailResult.Delete:
                const confirmOptions = {
                    title: 'Confirm',
                    message: 'Are you sure you want to delete this deck?',
                    okButtonText: 'Yes',
                    cancelButtonText: 'No'
                };

                resultObs = from(confirm(confirmOptions)).pipe(
                    map(confirm => confirm ? this._dataService.deleteDeck(this.deck.id) : null)
                );
                break;
        }

        this.subscriptions.push(resultObs.subscribe(_ => this.navigateToDeckPage()));
    }

    public openCardDialog(): void {
        const options: ModalDialogOptions = {
            fullscreen: true,
            viewContainerRef: this._viewContainerRef
        };

        this._modalDialogService.showModal(CardDialogComponent, options).then((result: CardDialogResult) => {
            if (result === CardDialogResult.Submit) this.populateCards();
        });
    }

    private populateCards(): void {
        this.subscriptions.push(this._dataService.getCardDefinitions().subscribe(cardDefinitions => {
            cardDefinitions = cardDefinitions.sort((a, b) => a.name > b.name ? 1 : -1);
            this.cards = new ObservableArray(cardDefinitions);
        }));
    }

    private navigateToDeckPage(): void {
        this._routerExtensions.navigateByUrl('decks');
    }
}
