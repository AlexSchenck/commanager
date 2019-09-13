import { Injectable } from '@angular/core';
import { concat, Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

import { ICardDefinition } from '../card/card-definition.interface';
import { ICardInstance } from '../card/card-instance.interface';
import { ICardInstanceDetail } from '../card/card-instance-detail.interface';
import { ICatalog } from '../catalog/catalog.interface';
import { DatabaseTable } from '../common/database/database-table.enum';
import { DatabaseService } from '../common/database/database.service';
import { IRecord } from '../common/database/record.interface';
import { IDeck } from '../deck/deck.interface';
import { DataTranslatorService } from './data-translator.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(
        private _databaseService: DatabaseService,
        private _dataTranslatorService: DataTranslatorService
    ) { }

    public getCardDefinition(id: number): Observable<ICardDefinition> {
        const condition = {
            column: 'id',
            value: id
        };
        return this._databaseService.query(DatabaseTable.CardDefinition, [condition]).pipe(
            map(rows => rows && rows.length > 0 ? this._dataTranslatorService.toCardDefinition(rows[0]) : null)
        );
    }

    public getCardDefinitions(): Observable<ICardDefinition[]> {
        return this._databaseService.select(DatabaseTable.CardDefinition).pipe(
            map(rows => rows ? rows.map(row => this._dataTranslatorService.toCardDefinition(row)) : null)
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
            map(rows => rows ? rows.map(row => this._dataTranslatorService.toCardInstanceDetail(row)) : null)
        );
    }

    public getCardInstanceDetailsForCardDefinition(cardDefinitionId: number): Observable<ICardInstanceDetail[]> {
        const condition = {
            column: 'cardDefinitionId',
            value: cardDefinitionId
        };
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
        return this._databaseService.query(DatabaseTable.CardInstance, [condition], joins).pipe(
            map(rows => rows ? rows.map(row => this._dataTranslatorService.toCardInstanceDetail(row)) : null)
        );
    }

    public getCatalogs(deckId: number): Observable<ICatalog[]> {
        const condition = { column: 'deckId', value: deckId };
        return this._databaseService.query(DatabaseTable.Catalog, [condition]).pipe(
            map(rows => rows ? rows.map(row => this._dataTranslatorService.toCatalog(row)) : null)
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
            map(rows => rows ? rows.map(row => this._dataTranslatorService.toDeck(row)) : null)
        );
    }

    public saveCardDefinition(cardDefinition: ICardDefinition): Observable<ICardDefinition> {
        if (!cardDefinition) return of(null);

        return this.save(DatabaseTable.CardDefinition, cardDefinition, ...this._dataTranslatorService.toDatabaseColumnsAndValues(cardDefinition)).pipe(
            tap(id => cardDefinition.id = id),
            map(id => cardDefinition)
        );
    }

    public saveCardInstance(cardInstance: ICardInstance): Observable<ICardInstance> {
        if (!cardInstance) return of(null);

        return this.save(DatabaseTable.CardInstance, cardInstance, ...this._dataTranslatorService.toDatabaseColumnsAndValues(cardInstance)).pipe(
            tap(id => cardInstance.id = id),
            map(id => cardInstance)
        );
    }

    public saveCatalogs(deckId: number, cardDefinitionIds: number[]): Observable<number> {
        if (!deckId || !cardDefinitionIds) return of(null);

        // Delete catalogs assigned to this deckId, then save all of them if any to save
        let resultObs = this.deleteCatalogs(deckId);

        if (cardDefinitionIds.length > 0) {
            const catalogs: ICatalog[] = cardDefinitionIds.map(id => ({ cardDefinitionId: id, deckId }));
            resultObs = resultObs.pipe(
                concatMap(_ => this.saveMany(DatabaseTable.Catalog, ...this._dataTranslatorService.toDatabaseColumnsAndManyValues(catalogs)))
            );
        }

        return resultObs;
    }

    public saveDeck(deck: IDeck): Observable<IDeck> {
        if (!deck) return of(null);

        return this.save(DatabaseTable.Deck, deck, ...this._dataTranslatorService.toDatabaseColumnsAndValues(deck)).pipe(
            tap(id => deck.id = id),
            map(id => deck)
        );
    }

    public deleteCardDefinition(id: number): Observable<number> {
        return this._databaseService.delete(DatabaseTable.CardDefinition, [{ column: 'id', value: id }]);
    }

    public deleteCardInstance(id: number): Observable<number> {
        return this._databaseService.delete(DatabaseTable.CardInstance, [{ column: 'id', value: id }]);
    }

    public deleteCatalogs(deckId: number): Observable<number> {
        return this._databaseService.delete(DatabaseTable.Catalog, [{ column: 'deckId', value: deckId }]);
    }

    public deleteDeck(id: number): Observable<number> {
        return this._databaseService.delete(DatabaseTable.Deck, [{ column: 'id', value: id }]);
    }

    private save(table: DatabaseTable, record: IRecord, columns: string[], values: any[]): Observable<number> {
        // Insert if id is null, update otherwise. Always returns new or given id
        return !record.id ?
            this._databaseService.insert(table, columns, values) :
            this._databaseService.update(table, columns, values, record.id).pipe(
                map(numberOfRowsAffected => record.id)
            );
    }

    private saveMany(table: DatabaseTable, columns: string[], values: any[][]): Observable<number> {
        // Insert only for now, no updates
        return this._databaseService.insertMany(table, columns, values);
    }
}