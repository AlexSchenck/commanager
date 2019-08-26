import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { DatabaseTable } from '../common/database/database-table.enum';
import { DatabaseService } from '../common/database/database.service';
import { IDeck } from '../deck/deck.interface';
import { DataTranslatorService } from './data-translator.service';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	constructor(
        private _databaseService: DatabaseService,
        private _dataTranslatorService: DataTranslatorService
    ) {
    }
    
    // <Get>
    public getDeck(id: number): Observable<IDeck> {
        const condition = { column: 'id', value: id };
        return this._databaseService.query(DatabaseTable.Deck, [condition]).pipe(
            map(rows => rows && rows.length > 0 ? this._dataTranslatorService.toDeck(rows[0]) : null)
        );
    }
    
    public getDecks(): Observable<IDeck[]> {
		return this._databaseService.select(DatabaseTable.Deck).pipe(
			map(rows => rows.map(row => this._dataTranslatorService.toDeck(row)))
		);
	}
    // </Get>

    // <Save>
    public saveDeck(deck: IDeck): Observable<IDeck> {
        if (!deck) return of(null);

        return this._databaseService.insert(DatabaseTable.Deck, ...this._dataTranslatorService.toDatabaseColumnsAndValues(deck)).pipe(
            tap(id => deck.id = id),
            map(id => deck)
        );
    }
    // </Save>
}