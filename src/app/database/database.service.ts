import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

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
		return this._connection.pipe(
			concatMap(db => this.createDeckTable(db)),
			concatMap(db => this.createCardDefinitionTable(db)),
			concatMap(db => this.createCardInstanceTable(db)),
			concatMap(db => this.createCatalogTable(db))
		);
	}

	public close(): Observable<any> {
		// Get connection, close it, then remove our connection definition. If no connection just return null
		return !this._connection ? null : this._connection.pipe(
			map(connection =>
				from(connection.close()).pipe(map(this._connection = null))
			)	
		);
	}

	private createDeckTable(db: any): Observable<any> {
		const sql = `
		CREATE TABLE IF NOT EXISTS Deck (
			Id INT NOT NULL,
			Name NVARCHAR(64) NOT NULL,
			ColorIdentity INT DEFAULT(0),
			Commander NVARCAR(64) NULL,
			PRIMARY KEY (Id)
		)`;
		return of(db.execSQL(sql)).pipe(map(() => db));
	}

	private createCardDefinitionTable(db: any): Observable<any> {
		const sql = `
		CREATE TABLE IF NOT EXISTS CardDefinition (
			Id INT NOT NULL,
			Name NVARCHAR(64) NOT NULL,
			PRIMARY KEY (Id)
		)`;
		return of(db.execSQL(sql)).pipe(map(() => db));
	}

	private createCardInstanceTable(db: any): Observable<any> {
		const sql = `
		CREATE TABLE IF NOT EXISTS CardInstance (
			Id INT NOT NULL,
			CardDefinitionId INT NOT NULL,
			CurrentDeckId INT NULL,
			PRIMARY KEY (Id),
			FOREIGN KEY (CardDefinitionId) REFERENCES CardDefinition(Id),
			FOREIGN KEY (CurrentDeckId) REFERENCES Deck(Id)
		)`;
		return of(db.execSQL(sql)).pipe(map(() => db));
	}

	private createCatalogTable(db: any): Observable<any> {
		const sql = `
		CREATE TABLE IF NOT EXISTS Catalog (
			Id INT NOT NULL,
			CardDefinitionId INT NOT NULL,
			DeckId INT NOT NULL,
			PRIMARY KEY (Id),
			FOREIGN KEY (CardDefinitionId) REFERENCES CardDefinition(Id),
			FOREIGN KEY (DeckId) REFERENCES Deck(Id)
		)`;
		return of(db.execSQL(sql)).pipe(map(() => db));
	}

	public select<T>(table: DatabaseTable): Observable<T[]> {
		return this._database.pipe(map(db => db.all('SELECT * FROM ' + table.toString())));
	}

	public selectOne<T>(table: DatabaseTable): Observable<T> {
		return this._database.pipe(map(db => db.get('SELECT * FROM ' + table.toString())));
	}
}