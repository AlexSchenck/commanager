import { Injectable } from '@angular/core';
import { concat, from, Observable, of } from 'rxjs';

var Sqlite = require('nativescript-sqlite');

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	private _database: Observable<any> = null;

	constructor() {	}

	// TODO: Error handling
	public initialize(): Observable<any> {
		// Previously initialized, just give current DB connection
		if (this._database) return this._database;

		// Not previously initialized, create new connection
		this._database = from(new Sqlite('Commanager'));

		// Pass back an Observable with all of the table creation attached
		return concat(
			this._database,
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
}