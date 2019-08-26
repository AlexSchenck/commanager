import { Directive, ViewContainerRef, TemplateRef, Inject } from '@angular/core';
import { DEVICE } from "nativescript-angular/platform-providers";
import { Device, platformNames } from "tns-core-modules/platform";

@Directive({ selector: "[ifIos]" })
export class IfIosDirective {
    constructor( @Inject(DEVICE) device: Device, container: ViewContainerRef, templateRef: TemplateRef<Object>) {
        if (device.os === platformNames.ios) {
            container.createEmbeddedView(templateRef);
        }
    }
}