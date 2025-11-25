import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminShiftsComponent } from './components/admin-shifts/admin-shifts.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { DoctorScheduleComponent } from './components/doctor-schedule/doctor-schedule.component';
import { DoctorMarketplaceComponent } from './components/doctor-marketplace/doctor-marketplace.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'shifts', component: AdminShiftsComponent }
    ]
  },

  // Doctor Routes
  {
    path: 'doctor',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'schedule', component: DoctorScheduleComponent },
      { path: 'marketplace', component: DoctorMarketplaceComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
