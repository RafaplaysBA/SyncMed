import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { AdminShiftsComponent } from './components/admin-shifts.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard.component';
import { DoctorScheduleComponent } from './components/doctor-schedule.component';
import { DoctorMarketplaceComponent } from './components/doctor-marketplace.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/shifts', component: AdminShiftsComponent },
  { path: 'doctor/dashboard', component: DoctorDashboardComponent },
  { path: 'doctor/schedule', component: DoctorScheduleComponent },
  { path: 'doctor/marketplace', component: DoctorMarketplaceComponent },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  { path: 'register', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
