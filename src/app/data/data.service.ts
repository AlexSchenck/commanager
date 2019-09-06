import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ICardDefinition } from '../card/card-definition.interface';
import { ICardInstance } from '../card/card-instance.interface';
import { ICardInstanceDetail } from '../card/card-instance-detail.interface';
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
    public getCardDefinitions(): Observable<ICardDefinition[]> {
        return this._databaseService.select(DatabaseTable.CardDefinition).pipe(
            map(rows => rows.map(row => this._dataTranslatorService.toCardDefinition(row)))
        );
    }

    public getCardInstanceDetails(): Observable<ICardInstanceDetail[]> {
        const joins = [
            {
                leftTable: DatabaseTable.CardInstance,
                leftColumnName: 'cardDefinitionId',
                rightTable: DatabaseTable.CardDefinition,
                rightColumnName: 'id'
            },
            {
                leftTable: DatabaseTable.CardInstance,
                leftColumnName: 'currentDeckId',
                rightTable: DatabaseTable.Deck,
                rightColumnName: 'id'
            }
        ];
        return this._databaseService.select(DatabaseTable.CardInstance, joins).pipe(
            map(rows => rows.map(row => this._dataTranslatorService.toCardInstanceDetail(row)))
        );
    }

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
    public saveCardDefinition(cardDefinition: ICardDefinition): Observable<ICardDefinition> {
        if (!cardDefinition) return of(null);

        return this._databaseService.insert(DatabaseTable.CardDefinition, ...this._dataTranslatorService.toDatabaseColumnsAndValues(cardDefinition)).pipe(
            tap(id => cardDefinition.id = id),
            map(id => cardDefinition)
        );    
    }

    public saveCardInstance(cardInstance: ICardInstance): Observable<ICardInstance> {
        if (!cardInstance) return of(null);

        return this._databaseService.insert(DatabaseTable.CardInstance, ...this._dataTranslatorService.toDatabaseColumnsAndValues(cardInstance)).pipe(
            tap(id => cardInstance.id = id),
            map(id => cardInstance)
        );    
    }

    public saveDeck(deck: IDeck): Observable<IDeck> {
        if (!deck) return of(null);

        return this._databaseService.insert(DatabaseTable.Deck, ...this._dataTranslatorService.toDatabaseColumnsAndValues(deck)).pipe(
            tap(id => deck.id = id),
            map(id => deck)
        );
    }
    // </Save>
}