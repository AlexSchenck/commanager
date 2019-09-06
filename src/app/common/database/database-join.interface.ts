import { DatabaseTable } from "./database-table.enum";

export interface IDatabaseJoin {
    leftTable?: DatabaseTable;
    leftColumnName?: string;
    rightTable?: DatabaseTable;
    rightColumnName?: string;
}