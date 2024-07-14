import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { getWeatherIcon, WeatherService } from '../../services/weather.service';
import { LocationService } from '../../services/location.service';
import { ConditionsAndZip } from '../../models/conditions-and-zip.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentConditionsComponent {
  private readonly weatherService = inject(WeatherService);

  private readonly locationService = inject(LocationService);
  protected readonly getWeatherIcon = getWeatherIcon;

  protected readonly currentConditions$: Observable<ConditionsAndZip[]> =
    this.weatherService.currentConditions$;

  protected removeLocation(zipcode: string) {
    this.locationService.removeLocation(zipcode);
  }

  protected removeLocationByIndex(index: number) {
    this.locationService.removeLocationByIndex(index);
  }
}
