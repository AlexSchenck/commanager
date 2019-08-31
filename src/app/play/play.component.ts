import { Component, OnInit, IterableChangeRecord } from "@angular/core";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { Observable, of } from "rxjs";

import { Color } from "../deck/color.enum"
import { PlayService } from "./play.service";
import { IDeck } from "../deck/deck.interface";
import { ActivatedRoute } from "@angular/router";
import { ICardDefinition } from "../card/card-definition.interface";

@Component({
    selector: "ns-play",
    moduleId: module.id,
    templateUrl: "./play.component.html"
})
export class PlayComponent implements OnInit {
    public decks: Observable<IDeck[]>;
    public deck: IDeck;
    public cardsInDeck: ICardDefinition[];
    public tempDecksForDropDown: any[];
    public tempToStringForDropDown: any[];

    constructor(
        private _playService: PlayService,
        private _route: ActivatedRoute
    ) { }

    public ngOnInit(): void {
        const id = +this._route.snapshot.params.id;

        // this.decks = this.deckService.decks;
        this.deck = {
            "id": 1,
            "name": "Izzet",
            "commander": "blah",
            "colorIdentity": Color.White
        }
        this.cardsInDeck = [{
            id: 1,
            name: 'Sol Ring'
        }, {
            id: 2,
            name: 'Lightning Greaves'
        }, {
            id: 3,
            name: 'Alex of Clan Smelly'
        }, {
            id: 4,
            name: 'Command Tower'
        }];
        this.tempDecksForDropDown = [{
            "id": 1,
            "name": "Izzet",
            "commander": "blah",
            "colorIdentity": Color.Blue,
            toString: () =>{
                return "Izzet";
            }
        }, {
            "id": 2,
            "name": "Artifacts",
            "commander": "Blah 2",
            "colorIdentity": Color.White,
            toString: () =>{
                return "Artifacts";
            }
        }];

        // https://github.com/NativeScript/NativeScript/issues/1677
        // Need to add to strings to each dropdown
        // for (let i = 0; i < this.tempDecksForDropDown.length; i++) {
        //     this.tempDecksForDropDown[i].toString = function() {
        //         return this.tempDecksForDropDown[i].name;
        //     }
        // }

        //todo: 
            //get deck by id
            //Get all cards in deck
                //get card definitions for each catalog entries by deck id
            //Populate each dropdown
                //for decks for each catalog entry get catalog entries by cardDefinitionId
    }

    public selectedIndexChanged(args) {
        let picker = <ListPicker>args.object;
        console.log("picker selection: " + picker.selectedIndex);
    }

}
