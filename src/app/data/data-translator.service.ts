import { Injectable } from '@angular/core';

import { ICardDefinition } from '../card/card-definition.interface';
import { ICardInstanceDetail } from '../card/card-instance-detail.interface';
import { IDeck } from '../deck/deck.interface';
import { ICatalog } from '../catalog/catalog.interface';

@Injectable({
	providedIn: 'root'
})
export class DataTranslatorService {
    public toDatabaseColumnsAndValues(object: Object): [string[], any[]] {
        if (!object) return null;

        let columns: string[] = [];
        let values: any[] = [];
        for(let key of Object.keys(object)) {
            columns.push(key[0].toUpperCase() + key.slice(1)); // to upper
            values.push(object[key]); // property value
        }

        return [columns, values];
    }

    public toDatabaseColumnsAndManyValues(objects: Object[]): [string[], any[][]] {
        if (!objects || objects.length === 0) return null;

        let columns: string[] = [];
        for(let key of Object.keys(objects[0])) {
            columns.push(key[0].toUpperCase() + key.slice(1)); // to upper
        }

        let values: any[][] = [];
        for (let object of objects) {
            values.push(Object.keys(object).map(key => object[key])) // property values
        }

        return [columns, values];
    }

    public toCardDefinition(databaseRow: any[]): ICardDefinition {
        return {
            id: databaseRow[0],
            name: databaseRow[1]
        }
    }

    public toCardInstanceDetail(databaseRow: any[]): ICardInstanceDetail {
        return {
            id: databaseRow[0],
            cardDefinitionId: databaseRow[1],
            currentDeckId: databaseRow[2],
            cardDefinitionName: databaseRow[4],
            currentDeckName: databaseRow[6]
        };
    }

    public toCatalog(databaseRow: any[]): ICatalog {
        return  {
            id: databaseRow[0],
            cardDefinitionId: databaseRow[1],
            deckId: databaseRow[2]
        }
    }

    public toDeck(databaseRow: any[]): IDeck {
        return {
            id: databaseRow[0],
            name: databaseRow[1],
            colorIdentity: databaseRow[2],
            commander: databaseRow[3]
        };
    }
}