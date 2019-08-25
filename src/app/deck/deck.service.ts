import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DatabaseService } from '../database/database.service';
import { IDeck } from './deck.interface';

@Injectable({
	providedIn: 'root'
})
export class DeckService {
    public decks: Observable<IDeck[]>;

	constructor(
        private _databaseService: DatabaseService
    ) {
        this.decks = this.getDecks();
    }

    private getDecks(): Observable<IDeck[]> {
        return this._databaseService.getDecks();
    }
}