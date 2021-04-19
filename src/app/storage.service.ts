import { Injectable } from '@angular/core';

export enum STORAGE_KEYS {
  HISCORE = 'HISCORE',
  LAST_SNAPSHOT = 'LAST_SNAPSHOT',
}

export const HISCORE_ZERO = {4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get(key: STORAGE_KEYS): any {
    return localStorage.getItem(key.toString());
  }

  set(key: STORAGE_KEYS, value: string): StorageService {
    localStorage.setItem(key.toString(), value);
    return this;
  }
}
