import { ICardInstance } from './card-instance.interface';

export interface ICardInstanceDetail extends ICardInstance {
    cardDefinitionName?: string;
    currentDeckName?: string;
}