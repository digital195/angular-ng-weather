import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { getWeatherIcon, WeatherService } from '../../services/weather.service';
import { Forecast } from '../../models/forecast.type';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastsListComponent {
  zipcode = input.required<string>();

  private readonly weatherService = inject(WeatherService);

  protected readonly forecast$: Observable<Forecast | null> = toObservable(this.zipcode).pipe(
    switchMap((zipcode) => this.weatherService.getForecast$(zipcode)),
  );

  protected readonly getWeatherIcon = getWeatherIcon;
}
