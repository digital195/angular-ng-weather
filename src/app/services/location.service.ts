import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export const LOCATIONS = 'ng-weather-locations';

@Injectable()
export class LocationService {
  private readonly _locations = signal<string[]>([]);

  locations = this._locations.asReadonly();
  locations$ = toObservable(this._locations);

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);

    if (locString) {
      this._locations.set(JSON.parse(locString) ?? []);
    }
  }

  addLocation(zipcode: string): boolean {
    if (!this.locations().includes(zipcode)) {
      this._locations.update((locations) => [...locations, zipcode]);
      localStorage.setItem(LOCATIONS, JSON.stringify(this._locations()));
      return true;
    }

    return false;
  }

  removeLocation(zipcode: string) {
    const index = this._locations().indexOf(zipcode);
    if (index !== -1) {
      this._locations.update((location) => location.filter((_, i) => i !== index));
      localStorage.setItem(LOCATIONS, JSON.stringify(this._locations()));
    }
  }

  removeLocationByIndex(index: number) {
    const location = this._locations()[index];
    if (location !== undefined) {
      this._locations.update((location) => location.filter((_, i) => i !== index));
      localStorage.setItem(LOCATIONS, JSON.stringify(this._locations()));
    }
  }
}
