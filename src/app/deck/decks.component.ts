import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import { Observable, of } from "rxjs";

import { Color } from './color.enum';
import { IDeck } from './deck.interface';

@Component({
    selector: "ns-deck",
    moduleId: module.id,
    styleUrls: ['decks.component.css'],
    templateUrl: "./decks.component.html"
})
export class DecksComponent implements OnInit, AfterViewInit {
    @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent;

    public decks: Observable<IDeck[]>;
    public deckList: IDeck[];

    private _drawer: RadSideDrawer;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef
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

    public ngAfterViewInit(): void {
        this._drawer = this.drawerComponent.sideDrawer;
        this._changeDetectorRef.detectChanges();
    }

    public cycleDrawer(): void {
        // Close the drawer if it's open, open it if it's closed
        this._drawer[this._drawer.getIsOpen() ? 'closeDrawer' : 'showDrawer']();
    }
}
