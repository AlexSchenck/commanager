import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, OnDestroy } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from 'tns-core-modules/application';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

import { SubscriptionComponent } from '../common/subscriptions/subscription.component';
import { DataService } from '../data/data.service';
import { Color, ColorSymbol } from './color.enum';
import { IDeck } from './deck.interface';

const Theme = require('nativescript-theme-core');

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

        this.subscriptions.push(this._dataService.getAllDecks().subscribe(decks => {
            decks = decks.sort((a, b) => a.name > b.name ? 1 : -1);
            this.decks = new ObservableArray(decks);
        }));

        android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            // The back button here will exit the app and cause it to break when opening it again. Force the user to close it via other means
            data.cancel = true;
        });
    }

    public ngAfterViewInit(): void {
        this._drawer = this.drawerComponent.sideDrawer;
        this._changeDetectorRef.detectChanges();
    }

    public toColorString(colorIdentity: number): string {
        if (!colorIdentity) return 'Colorless';
        let result = '';

        for (const color in Color) {
            const hasColor = colorIdentity & +color;
            if (!!hasColor) result += (ColorSymbol[+color]).toString();
        }

        return result;
    }

    public toggleDrawer(): void {
        // Close the drawer if it's open, open it if it's closed
        this._drawer[this._drawer.getIsOpen() ? 'closeDrawer' : 'showDrawer']();
    }

    public toggleTheme(): void {
        Theme.toggleMode();
    }
}
