import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../data/data.service';
import { IDeck } from './deck.interface';
import { Color } from './color.enum';

@Component({
    selector: 'ns-deck-details',
    moduleId: module.id,
    templateUrl: './deck-detail.component.html'
})
export class DeckDetailComponent {
    public deck: IDeck;
    public title: string;

    public get color() { return Color; }

    constructor(
        private _dataService: DataService,
        private _route: ActivatedRoute
    ) {
        const id = +this._route.snapshot.params.id;

        if (id) {
            this._dataService.getDeck(id).subscribe(deck => {
                this.deck = {
                    id: 1,
                    name: 'Izzet',
                    commander: 'blah',
                    colorIdentity: Color.Blue | Color.Red
                }
                this.title = this.deck.name;
            });
        } else {
            this.title = 'New Deck';
        }
    }

    public hasColor(color: Color): boolean {
        return this.deck ? !!(this.deck.colorIdentity & color) : false;
    }
}
