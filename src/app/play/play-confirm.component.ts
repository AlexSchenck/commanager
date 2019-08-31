import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import {Router} from '@angular/router';

import { PlayService } from "./play.service";
import { IDeck } from "../deck/deck.interface";
import { ActivatedRoute } from "@angular/router";
import { EventData, View } from "tns-core-modules/ui/page/page";


@Component({
    selector: "ns-play-confirm",
    moduleId: module.id,
    templateUrl: "./play-confirm.component.html"
})
export class PlayConfirmComponent implements OnInit {
    public decks: Observable<IDeck[]>;
    public updates: any[];

    constructor(
        private _playService: PlayService,
        private _route: ActivatedRoute,
        private router: Router
    ) { }

    public ngOnInit(): void {
        this.updates = [];
        this._playService.updates.forEach((value: number, key: string) => {
            this.updates.push({
                cardId: key,
                deckId: value
            })
        });
    }

    public updateCards(args: EventData) {
        console.log("updating cards");
        //update selected cards in database

        this.router.navigateByUrl('/decks');
    }

}
