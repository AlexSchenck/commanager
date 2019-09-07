import { IRecord } from "../common/database/record.interface";
import { Color } from "./color.enum";

export interface IDeck extends IRecord {
    name?: string;
    colorIdentity?: Color;
    commander?: string;
}