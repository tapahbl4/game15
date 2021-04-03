import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  promptEvent: any;

  constructor(private swUpdate: SwUpdate) {
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });

    window.addEventListener('appinstalled', () => {
      this.promptEvent = null;
      console.log('PWA was installed');
    });

    swUpdate.available.subscribe(() => {
      if (confirm("New version available. Load New Version?")) {
        window.location.reload();
      }
    });
  }
}
