import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isAdmin = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.checkAdmin();
  }

  checkAdmin() {
    const roles = this.authService.getUserRole();
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
      const adminRole = '1';
      if (role === adminRole ){
        this.isAdmin = true;
      }
      // console.log(roles[index].authority.slice(0, roles[index].authority.indexOf('-')));
    }
  }

}
