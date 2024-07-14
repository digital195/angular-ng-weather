import { Injectable } from '@angular/core';
import { CacheEntry } from '../models/cache-entry';

const CACHE = 'ng-weather-cache-';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  has<T>(key: string): boolean {
    const cacheEntryString = localStorage.getItem(CACHE + key);

    if (cacheEntryString) {
      const cacheEntry: CacheEntry<T> = JSON.parse(cacheEntryString);

      if (cacheEntry && cacheEntry.expires > new Date().getTime()) {
        return true;
      }
    }

    return false;
  }

  get<T>(key: string): T | undefined {
    const cacheEntryString = localStorage.getItem(CACHE + key);

    if (cacheEntryString) {
      const cacheEntry: CacheEntry<T> = JSON.parse(cacheEntryString);

      if (cacheEntry && cacheEntry.expires > new Date().getTime()) {
        return cacheEntry.data;
      }
    }

    return undefined;
  }

  save<T>(key: string, data: T, expiresInSeconds: number): T {
    const expiresTimestamp = new Date().getTime() + expiresInSeconds * 1000;

    const cacheEntry: CacheEntry<T> = { data, expires: expiresTimestamp };

    localStorage.setItem(CACHE + key, JSON.stringify(cacheEntry));

    return data;
  }

  delete<T>(key: string): T | undefined {
    const data = this.get<T>(key);

    localStorage.removeItem(CACHE + key);

    return data;
  }
}
