import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./shared/auth.guard";
import { ProjectSelectionComponent } from './project-selection/project-selection.component';
import { BankHolidaysComponent } from './bank-holidays/bank-holidays.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'selection' },
  { path: 'selection', component: ProjectSelectionComponent },
  { path: 'holidays', component: BankHolidaysComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: LayoutComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
