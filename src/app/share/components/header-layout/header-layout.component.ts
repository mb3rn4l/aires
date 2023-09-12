import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss'],
})
export class HeaderLayoutComponent  implements OnInit {

  userData: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userData = this.authService.userData; 
    console.log(this.authService.userData)
  }

  checkUser(){
    console.log(this.authService.isLoggedIn)
    return this.authService.isLoggedIn;
  }

  onClickSignOut(){
    this.authService.signOut();
  }

}