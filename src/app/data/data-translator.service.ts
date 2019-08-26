import { Injectable } from '@angular/core';

import { IDeck } from '../deck/deck.interface';

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

    public toDeck(databaseRow: any[]): IDeck {
        return {
            id: databaseRow[1],
            name: databaseRow[2],
            colorIdentity: databaseRow[3],
            commander: databaseRow[4]
        };
    }
}