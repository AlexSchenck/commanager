import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { IDeck } from "./deck.interface";
import { DeckService } from "./deck.service";

@Component({
    selector: "ns-deck",
    moduleId: module.id,
    templateUrl: "./decks.component.html"
})
export class DecksComponent implements OnInit {
    decks: Observable<IDeck[]>;

    constructor(
        private deckService: DeckService
    ) { }

    public ngOnInit(): void {
        this.decks = this.deckService.decks;
    }
}
