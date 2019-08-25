import { Color } from "./color.enum";

export interface IDeck {
    id?: number;
    name?: string;
    colorIdentity?: Color;
    commander?: string;
}