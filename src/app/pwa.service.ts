import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  promptEvent: any;

  constructor(private swUpdate: SwUpdate, public translate: TranslateService) {
    translate.use(translate.getBrowserLang());
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });

    window.addEventListener('appinstalled', () => {
      this.promptEvent = null;
      console.log('PWA was installed');
      translate.get('update_message').subscribe((update_message: string) => {
        if (confirm(update_message)) {
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        }
      });
    });

    swUpdate.available.subscribe(() => {
      translate.get('update_message').subscribe((update_message: string) => {
        if (confirm(update_message)) {
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        }
      });
    });
  }
}
