import { IRecord } from "../common/database/record.interface";

export interface ICardInstance extends IRecord {
    cardDefinitionId?: number;
    currentDeckId?: number;
}