import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './component/search/search.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { SettingsComponent } from './component/settings/settings.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthGuard],
    data: {title: 'Suche'}
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: { title: 'Einstellungen' },
  },
  { path: 'login', component: LoginComponent, data: { title: 'Anmeldung' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
