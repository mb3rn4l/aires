import { Component, OnInit } from '@angular/core';
import { CreateUserForm } from 'src/app/share/models/createUserForm';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  
  
  public model : CreateUserForm = {name:"", email:"", password: "", confirmPassword: "" };
  @ViewChild('createForm') createForm: NgForm;
 
  constructor(private router: Router, private loadingCtrl: LoadingController, private authService: AuthService) { }

  async datosForm() {
    
      if (this.createForm.valid) {

        let loading = await this.loadingCtrl.create();
        loading.present();

      try{
        await this.authService.signUp(this.createForm.value)
        this.router.navigate(["/home"]);
				await loading.dismiss();
      }
      catch(error){
        console.log("no se pudo entrar al singUp")
      }
    }
  }

  ngOnInit() {
   
    }
  }
