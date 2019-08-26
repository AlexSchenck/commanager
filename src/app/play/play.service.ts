import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../data/data.service';
import { IDeck } from '../deck/deck.interface';

@Injectable({
	providedIn: 'root'
})
export class PlayService {
    public decks: Observable<IDeck[]>;
    public deck: IDeck;
    
	constructor(
        private _dataService: DataService
    ) {
        this.decks = this.loadDecks();
    }

    private loadDecks(): Observable<IDeck[]> {
        return this._dataService.getDecks();
    }
}