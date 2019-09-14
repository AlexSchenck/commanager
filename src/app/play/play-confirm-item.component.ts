import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { IDeck } from '../deck/deck.interface';

@Component({
    selector: 'ns-play-confirm-item',
    moduleId: module.id,
    templateUrl: './play-confirm-item.component.html'
})
export class PlayConfirmItemComponent extends SubscriptionComponent implements OnInit, OnDestroy {
    @Input() public cardNames: string[];
    public deckName: string;
    @Input() public deckId: number;

    constructor(
        private _dataService: DataService
    ) {
        super();
    }

    public ngOnInit(): void {
        const obs: Observable<IDeck> = this.deckId === 0 ? of({ name: 'Collection' }) : this._dataService.getDeck(this.deckId);
        this.subscriptions.push(obs.subscribe(deck => {
            this.deckName = deck.name;
        }));
    }
}
