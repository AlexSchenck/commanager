import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../data/data.service';
import { IDeck } from './deck.interface';

@Injectable({
	providedIn: 'root'
})
export class DeckService {
    public decks: Observable<IDeck[]>;

	constructor(
        private _dataService: DataService
    ) {
        this.decks = this.loadDecks();
    }

    private loadDecks(): Observable<IDeck[]> {
        return this._dataService.getDecks();
    }
}