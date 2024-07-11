import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastsListComponent } from './components/forecasts-list/forecasts-list.component';
import { MainPageComponent } from './components/main-page/main-page.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'forecast/:zipcode',
    component: ForecastsListComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes, {
  bindToComponentInputs: true,
});
