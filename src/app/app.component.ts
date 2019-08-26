import { Component } from '@angular/core';

import { DatabaseService } from './common/database/database.service';

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent {
	constructor (
		_databaseService: DatabaseService
	) {
		_databaseService.initialize().subscribe();
	}
}
