import { Injectable } from '@angular/core';
import { concat, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DatabaseTable } from './database-table.enum';

var Sqlite = require('nativescript-sqlite');

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	private _connection: Observable<any>;
	private _database: Observable<any>;

	constructor() {
		// For use when making SQL statements. Default to _initialize if _connection is undefined/closed
		this._database = this._connection || this.initialize();
	}

	// TODO: Error handling
	public initialize(): Observable<any> {
		this._connection = from(new Sqlite('Commanager'));

		// Pass back an Observable with all of the table creation attached
		return concat(
			this._connection,
			this.createDeckTable(),
			this.createCardDefinitionTable(),
			this.createCardInstanceTable(),
			this.createCatalogTable()
		);
	}

	private createDeckTable(): Observable<void> {
		return of(null); // TODO
	}

	private createCardDefinitionTable(): Observable<void> {
		return of(null); // TODO
	}

	private createCardInstanceTable(): Observable<void> {
		return of(null); // TODO
	}

	private createCatalogTable(): Observable<void> {
		return of(null); // TODO
	}

	public select<T>(table: DatabaseTable): Observable<T[]> {
		return this._database.pipe(
			map(db => db.all('SELECT * FROM ' + table.toString()))
		);
	}

	public selectOne<T>(table: DatabaseTable): Observable<T> {
		return this._database.pipe(
			map(db => db.get('SELECT * FROM ' + table.toString()))
		);
	}
}