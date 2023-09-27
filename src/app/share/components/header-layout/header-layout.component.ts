import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss'],
})
export class HeaderLayoutComponent  implements OnInit {

  userData: any;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController ) { }

  ngOnInit() {
    this.userData = this.authService.userData; 
    /* console.log(this.authService.userData) */
  }

  checkUser(){
    /* console.log(this.authService.isLoggedIn) */
    return this.authService.isLoggedIn;
  }

  async onClickSignOut() {
    const loading = await this.loadingCtrl.create({
      message: 'Signing Out...', // You can customize the loading message
    });
  
    try {
      await loading.present();
  
      await this.authService.signOut();
  
      // Delay for a short moment to let the loading indicator show
      setTimeout(async () => {
        await loading.dismiss();
        this.router.navigate(['login']); // Replace 'login' with the actual login page route
      }, 500); // Adjust the delay as needed
    } catch (error) {
      await loading.dismiss();
      // Handle any errors here
    }
  }
  

 /*  onClickSignOut(){
    this.authService.signOut();
    this.router.navigate(['login']);
  } */

}