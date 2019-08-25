import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { IDeck } from "./deck.interface";
import { DeckService } from "./deck.service";
import { Color } from "./color.enum";

@Component({
    selector: "ns-deck-details",
    moduleId: module.id,
    templateUrl: "./deck-detail.component.html"
})
export class DeckDetailComponent implements OnInit {
    deck: IDeck;

    constructor(
        private deckService: DeckService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {

        const id = +this.route.snapshot.params.id;
        //TODO: implement get deck
        // this.deck = this.deckService.getDeck(id);
        this.deck = {
            "id": 1,
            "name": "Izzet",
            "commander": "blah",
            "colorIdentity": Color.Blue
        };
    }
}
