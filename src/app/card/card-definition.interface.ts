import { IRecord } from "../common/database/record.interface";

export interface ICardDefinition extends IRecord {
    name?: string;
}