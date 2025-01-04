import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './login/login-view/login-view.component';
import { AuthViewComponent } from './login/auth-view/auth-view.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { MovieDetailsComponent } from './movie_details/movie-details/movie-details.component';

const routes: Routes = [
  {path: 'login', component: LoginViewComponent},
  {path: 'authenticate', component: AuthViewComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardViewComponent},
  {path: 'movie/details', component: MovieDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
