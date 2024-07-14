import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from '../models/current-conditions.type';
import { ConditionsAndZip } from '../models/conditions-and-zip.type';
import { Forecast } from '../models/forecast.type';
import { LocationService } from './location.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable()
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  private readonly httpClient = inject(HttpClient);
  private readonly locationService = inject(LocationService);
  private readonly cacheService = inject(CacheService);

  currentConditions$: Observable<ConditionsAndZip[]> = this.locationService.locations$.pipe(
    switchMap((locations) =>
      locations.length > 0
        ? forkJoin(
            locations.map((zipcode) =>
              this.getWeather$(zipcode).pipe(map((weather) => ({ data: weather, zip: zipcode }))),
            ),
          )
        : of([]),
    ),
  );

  getForecast$(zipcode: string): Observable<Forecast> {
    const url = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    const cacheKey = `forecast-${zipcode}`;

    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.httpClient
      .get<Forecast>(url)
      .pipe(map((data) => this.cacheService.save(cacheKey, data, environment.cacheExpire)));
  }

  private getWeather$(zipcode: string): Observable<CurrentConditions | null> {
    const url = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
    const cacheKey = `weather-${zipcode}`;

    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    return this.httpClient.get<CurrentConditions | null>(url).pipe(
      map((data) => this.cacheService.save(cacheKey, data, environment.cacheExpire)),
      catchError(() => of(null)),
    );
  }
}

export function getWeatherIcon(id: number): string {
  if (id >= 200 && id <= 232) {
    return WeatherService.ICON_URL + 'art_storm.png';
  } else if (id >= 501 && id <= 511) {
    return WeatherService.ICON_URL + 'art_rain.png';
  } else if (id === 500 || (id >= 520 && id <= 531)) {
    return WeatherService.ICON_URL + 'art_light_rain.png';
  } else if (id >= 600 && id <= 622) {
    return WeatherService.ICON_URL + 'art_snow.png';
  } else if (id >= 801 && id <= 804) {
    return WeatherService.ICON_URL + 'art_clouds.png';
  } else if (id === 741 || id === 761) {
    return WeatherService.ICON_URL + 'art_fog.png';
  } else {
    return WeatherService.ICON_URL + 'art_clear.png';
  }
}
