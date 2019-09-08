import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, OnDestroy } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { IDeck } from './deck.interface';

@Component({
    selector: 'ns-decks',
    moduleId: module.id,
    styleUrls: ['decks.component.css'],
    templateUrl: './decks.component.html'
})
export class DecksComponent extends SubscriptionComponent implements AfterViewInit, OnDestroy {
    public decks: ObservableArray<IDeck>;

    @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;

    private _drawer: RadSideDrawer;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _dataService: DataService
    ) {
        super();

        this.subscriptions.push(this._dataService.getDecks().subscribe(decks => {
            decks = decks.sort((a, b) =>  a.name > b.name ? 1 : -1);
            this.decks = new ObservableArray(decks);
        }));
    }

    public ngAfterViewInit(): void {
        this._drawer = this.drawerComponent.sideDrawer;
        this._changeDetectorRef.detectChanges();
    }

    public toggleDrawer(): void {
        // Close the drawer if it's open, open it if it's closed
        this._drawer[this._drawer.getIsOpen() ? 'closeDrawer' : 'showDrawer']();
    }
}
