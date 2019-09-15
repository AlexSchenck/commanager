import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListPicker } from 'tns-core-modules/ui/list-picker/list-picker';

import { ICardDefinition } from '../card/card-definition.interface';
import { ICardInstanceDetail } from '../card/card-instance-detail.interface';
import { IListPickerItem } from '../common/interfaces/list-picker-item.interface';
import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';

@Component({
    selector: 'ns-play-item',
    moduleId: module.id,
    templateUrl: './play-item.component.html'
})
export class PlayItemComponent extends SubscriptionComponent implements OnInit, OnDestroy {
    public cardDefinition: ICardDefinition;
    @Input() public cardDefinitionId: number;
    public cardInstanceDetails: ICardInstanceDetail[];
    @Input() public deckId: number;
    public deckItems: IListPickerItem[];
    public hideListPicker: boolean;
    public get selectedCardInstanceId(): number { return this.hideListPicker ? null : this.deckItems[this.deckListPicker.nativeElement.selectedIndex].id; }

    @ViewChild('deckListPicker', { static: false }) public deckListPicker: ElementRef<ListPicker>;

    private readonly DEFAULT_DECK_NAME = 'Collection';

    constructor(
        private _dataService: DataService
    ) {
        super();

        this.cardInstanceDetails = [];
        this.hideListPicker = false;
    }

    public ngOnInit(): void {
        this.subscriptions.push(this._dataService.getCardDefinition(this.cardDefinitionId).subscribe(cardDefinition => {
            this.cardDefinition = cardDefinition;
        }));

        this.subscriptions.push(this._dataService.getCardInstanceDetailsForCardDefinition(this.cardDefinitionId).subscribe(cardInstances => {
            this.cardInstanceDetails = cardInstances;

            if (this.cardInstanceDetails.some(instanceDetail => instanceDetail.currentDeckId === this.deckId)) {
                // An instance of this card definition is already in this deck, no need to show this
                this.hideListPicker = true;
                return;
            }

            // Get distinct deck names for these instances, then sort, putting "Collection" first
            this.deckItems = this.cardInstanceDetails
                .map(instanceDetail => ({ id: instanceDetail.id, toString: () => instanceDetail.currentDeckName || this.DEFAULT_DECK_NAME }))
                .filter((value: IListPickerItem, index: number, array: IListPickerItem[]) => array.indexOf(value) === index)
                .sort((a, b) => this.sortInstances(a.toString(), b.toString()));
        }));
    }

    private sortInstances(a: string, b: string): number {
        if (a === this.DEFAULT_DECK_NAME) return -1;
        if (b === this.DEFAULT_DECK_NAME) return 1;

        return a > b ? 1 : -1;
    }
}
