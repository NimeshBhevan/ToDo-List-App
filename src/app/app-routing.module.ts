import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';
import { TaskComponent } from './components/task/task.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'signup', component: SingupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TaskComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: '**', redirectTo: 'tasks' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
