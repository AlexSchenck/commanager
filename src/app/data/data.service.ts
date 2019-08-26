import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { DatabaseTable } from '../common/database/database-table.enum';
import { DatabaseService } from '../common/database/database.service';
import { IDeck } from '../deck/deck.interface';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	constructor(
        private _databaseService: DatabaseService
    ) {
    }
    
    // <Get>
    public getDecks(): Observable<IDeck[]> {
		return this._databaseService.select(DatabaseTable.Deck).pipe(
			map(rows =>
				rows.map(row => {
					const deck: IDeck = {
						id: row[1],
						name: row[2],
						colorIdentity: row[3],
						commander: row[4]
					};
					return deck;
				})
			)
		);
	}
    // </Get>

    // <Save>
    public saveDeck(deck: IDeck): Observable<IDeck> {
        if (!deck) return of(null);

        return this._databaseService.insert(DatabaseTable.Deck, ...this.toDatabaseColumnsAndValues(deck)).pipe(
            tap(id => deck.id = id),
            map(id => deck)
        );
    }
    // </Save>

    private toDatabaseColumnsAndValues(object: Object): [string[], any[]] {
        if (!object) return null;

        let columns: string[] = [];
        let values: any[] = [];
        for(let key of Object.keys(object)) {
            columns.push(key[0].toUpperCase() + key.slice(1)); // to upper
            values.push(object[key]); // property value
        }

        return [columns, values];
    }
}