import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { IDatabaseJoin } from './database-join.interface';
import { DatabaseTable } from './database-table.enum';
import { IDatabaseWhereCondition } from './database-where-condition.interface';

const Sqlite = require('nativescript-sqlite');

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

    public select(table: DatabaseTable, joins?: IDatabaseJoin[]): Observable<any[]> {
        if (!table) return of(null);

        return this._database.pipe(
            map(db => {
                const selectSql = `SELECT * FROM ${table.toString()}`;
                const joinSql = this.toJoinSql(joins);

                const sql = `${selectSql}${joinSql}`;
                console.log(sql);
                return from(db.all(sql));
            }),
            concatMap((rows: Observable<any[]>) => rows)
        );
    }

    public query(table: DatabaseTable, conditions: IDatabaseWhereCondition[], joins?: IDatabaseJoin[]): Observable<any[]> {
        if (!table) return of(null);
        if (!conditions) return this.select(table);

        return this._database.pipe(
            map(db => {
                const selectSql = `SELECT * FROM ${table.toString()}`;
                const joinSql = this.toJoinSql(joins);
                const whereSql = ` WHERE ${conditions.map(condition => `${condition.column} = ${condition.value}`).join(' OR ')}`;

                const sql = `${selectSql}${joinSql}${whereSql}`;
                console.log(sql);
                return from(db.all(sql));
            }),
            concatMap((row: Observable<any[]>) => row)
        );
    }

    public insert(table: DatabaseTable, columns: string[], values: any[]): Observable<number> {
        if (!table || !columns || !values) return of(null);

        return this._database.pipe(
            map(db => {
                const delimiter = ', ';
                const sql = `INSERT INTO ${table.toString()} (${columns.join(delimiter)}) VALUES (${values.map(_ => '?').join(delimiter)})`;
                console.log(sql);
                return from(db.execSQL(sql, values));
            }),
            concatMap((id: Observable<number>) => id)
        );
    }

    public insertMany(table: DatabaseTable, columns: string[], values: any[][]): Observable<number> {
        if (!table || !columns || !values) return of(null);

        return this._database.pipe(
            map(db => {
                const delimiter = ', ';
                let sql = `INSERT INTO ${table.toString()} (${columns.join(delimiter)}) VALUES `;
                sql += values.map(value => `(${value.map(_ => '?').join(delimiter)})`).join(delimiter);

                // flatten values to 1d array
                let params = [];
                values.forEach(value => params = params.concat(value));

                console.log(sql);
                return from(db.execSQL(sql, params));
            }),
            concatMap((id: Observable<number>) => id)
        );
    }

    public update(table: DatabaseTable, columns: string[], values: any[], id: number): Observable<number> {
        if (!table || !columns || !values) return of(null);

        const sql = `UPDATE ${table.toString()} SET ${columns.map(column => `${column} = ?`).join(', ')} WHERE Id = ${id}`;
        console.log(sql);

        return this._database.pipe(
            map(db => from(db.execSQL(sql, values))),
            concatMap((rowsAffected: Observable<number>) => rowsAffected)
        );
    }

    public delete(table: DatabaseTable, conditions: IDatabaseWhereCondition[]): Observable<number> {
        if (!table) return of(null);

        let sql = `DELETE FROM ${table.toString()}`;
        if (conditions) {
            sql += ` WHERE ${conditions.map(condition => `${condition.column} = ${condition.value}`).join(' OR ')}`;
        }

        console.log(sql);
        return this._database.pipe(
            map(db => from(db.execSQL(sql))),
            concatMap((id: Observable<number>) => id)
        );
    }

    private createDeckTable(db: any): Observable<any> {
        const sql = `
        CREATE TABLE IF NOT EXISTS Deck (
            Id INTEGER PRIMARY KEY,
            Name NVARCHAR(64) NOT NULL,
            ColorIdentity INTEGER DEFAULT(0),
            Commander NVARCAR(64) NULL
        )`;
        return from(db.execSQL(sql)).pipe(map(() => db));
    }

    private createCardDefinitionTable(db: any): Observable<any> {
        const sql = `
        CREATE TABLE IF NOT EXISTS CardDefinition (
            Id INTEGER PRIMARY KEY,
            Name NVARCHAR(64) NOT NULL
        )`;
        return from(db.execSQL(sql)).pipe(map(() => db));
    }

    private createCardInstanceTable(db: any): Observable<any> {
        const sql = `
        CREATE TABLE IF NOT EXISTS CardInstance (
            Id INTEGER PRIMARY KEY,
            CardDefinitionId INTEGER NOT NULL,
            CurrentDeckId INTEGER NULL,
            FOREIGN KEY (CardDefinitionId) REFERENCES CardDefinition(Id) ON DELETE CASCADE,
            FOREIGN KEY (CurrentDeckId) REFERENCES Deck(Id) ON DELETE SET NULL
        )`;
        return from(db.execSQL(sql)).pipe(map(() => db));
    }

    private createCatalogTable(db: any): Observable<any> {
        const sql = `
        CREATE TABLE IF NOT EXISTS Catalog (
            Id INTEGER PRIMARY KEY,
            CardDefinitionId INTEGER NOT NULL,
            DeckId INTEGER NOT NULL,
            FOREIGN KEY (CardDefinitionId) REFERENCES CardDefinition(Id) ON DELETE CASCADE,
            FOREIGN KEY (DeckId) REFERENCES Deck(Id) ON DELETE CASCADE
        )`;
        return from(db.execSQL(sql)).pipe(map(() => db));
    }

    private toJoinSql(joins: IDatabaseJoin[]): string {
        return !joins ? '' : joins.map(join => {
            const leftTable = join.leftTable.toString();
            const rightTable = join.rightTable.toString();
            return ` LEFT JOIN ${rightTable} ON ${leftTable}.${join.leftColumnName} = ${rightTable}.${join.rightColumnName}`;
        }).join('');
    }
}