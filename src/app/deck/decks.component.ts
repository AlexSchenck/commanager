import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";

import { Color } from "./color.enum"
import { IDeck } from "./deck.interface";
import { DeckService } from "./deck.service";

@Component({
    selector: "ns-deck",
    moduleId: module.id,
    templateUrl: "./decks.component.html"
})
export class DecksComponent implements OnInit {
    decks: Observable<IDeck[]>;
    deckList: IDeck[];

    constructor(
        private deckService: DeckService
    ) { }

    public ngOnInit(): void {
        // this.decks = this.deckService.decks;
        var a : IDeck[] =  [{
            "id": 1,
            "name": "Izzet",
            "commander": "blah",
            "colorIdentity": Color.Blue
        }, {
            "id": 2,
            "name": "Artifacts",
            "commander": "Blah 2",
            "colorIdentity": Color.White
        }];
        this.deckList = a;
        this.decks = of(a);
        
    }
    
}
