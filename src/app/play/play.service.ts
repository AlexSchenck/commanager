import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DatabaseService } from '../database/database.service';
import { IDeck } from '../deck/deck.interface';

@Injectable({
	providedIn: 'root'
})
export class PlayService {
    public decks: Observable<IDeck[]>;
    public deck: IDeck;
    
	constructor(
        private _databaseService: DatabaseService
    ) {
        this.decks = this.loadDecks();
    }

    private loadDecks(): Observable<IDeck[]> {
        return this._databaseService.getDecks();
    }
}