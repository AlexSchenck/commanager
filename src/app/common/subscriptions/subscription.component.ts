import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class SubscriptionComponent implements OnDestroy {
    public get subscriptions(): Subscription[] { return this._subscriptions; }

    private _subscriptions: Subscription[];

    constructor() {
        this._subscriptions = [];
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}