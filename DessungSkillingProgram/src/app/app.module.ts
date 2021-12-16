import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StudentComponent } from './studentManager/student/student.component';
import { TrainerManagerComponent } from './trainer-manager/trainer-manager.component';
import { DepartmentComponent } from './master/department/department.component';
import { BranchComponent } from './master/branch/branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseManagerComponent } from './course-manager/course-manager.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngb-modal';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SidebarComponent,
    StudentComponent,
    TrainerManagerComponent,
    DepartmentComponent,
    BranchComponent,
    CourseManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    ModalModule,
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
