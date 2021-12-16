import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseManagerComponent } from './course-manager/course-manager.component';
import { HomeComponent } from './home/home.component';
import { StudentComponent } from './studentManager/student/student.component';
import { TrainerManagerComponent } from './trainer-manager/trainer-manager.component';
import { AdminGuard } from './_helper/admin.guard';
import { AuthGuard } from './_helper/auth.guard';


const routes: Routes = [
 {
  path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
 },
 {
   path: 'home', component: HomeComponent, canActivate: [AuthGuard],
 },
 {
  path: 'add-student', component:StudentComponent , canActivate: [AdminGuard],
},{
  path: 'add-trainer', component:TrainerManagerComponent , canActivate: [AdminGuard],
},
{
  path: 'course', component:CourseManagerComponent , canActivate: [AdminGuard],
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
