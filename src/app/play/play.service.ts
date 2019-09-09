import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../data/data.service';
import { IDeck } from '../deck/deck.interface';

@Injectable({
    providedIn: 'root'
})
export class PlayService {
    public deck: IDeck;
    public decks: Observable<IDeck[]>;
    public updates: Map<string, number>;

    constructor(
        private _dataService: DataService
    ) {
        this.decks = this.loadDecks();
    }

    private loadDecks(): Observable<IDeck[]> {
        return this._dataService.getDecks();
    }
}