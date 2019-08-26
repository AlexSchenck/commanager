import { Directive, ViewContainerRef, TemplateRef, Inject } from '@angular/core';
import { DEVICE } from "nativescript-angular/platform-providers";
import { Device, platformNames } from "tns-core-modules/platform";

@Directive({ selector: "[ifAndroid]" })
export class IfAndroidDirective {
    constructor( @Inject(DEVICE) device: Device, container: ViewContainerRef, templateRef: TemplateRef<Object>) {
        if (device.os === platformNames.android) {
            container.createEmbeddedView(templateRef);
        }
    }
}