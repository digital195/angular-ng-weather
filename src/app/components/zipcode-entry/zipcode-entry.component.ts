import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZipcodeEntryComponent {
  private readonly locationService = inject(LocationService);

  protected readonly zipcodeControl = new FormControl<string>('');

  protected addLocation() {
    const zipcode = this.zipcodeControl.value;

    const success = this.locationService.addLocation(zipcode);

    if (success) {
      this.zipcodeControl.reset('');
    }
  }
}
