import { Component, OnInit } from "@angular/core";

import { IDeck } from "./deck.interface";
import { DeckService } from "./deck.service";
import { Observable } from "rxjs";

@Component({
    selector: "ns-deck",
    moduleId: module.id,
    templateUrl: "./deck.component.html"
})
export class DeckComponent implements OnInit {
    decks: Observable<IDeck[]>;

    constructor(private deckService: DeckService) { }

    ngOnInit(): void {
        this.decks = this.deckService.decks;
    }
}
