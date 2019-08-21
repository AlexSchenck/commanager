import { Color } from "tns-core-modules/color/color";

export interface IDeck {
    id?: number;
    name?: string;
    colorIdentity?: Color;
    commander?: string;
}