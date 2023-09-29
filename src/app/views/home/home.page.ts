import { Component } from '@angular/core';
import { ReactiveStore } from 'src/app/app-store';
import { DataUserForms } from 'src/app/share/models/dataUserForm';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isAdmin: boolean;

  constructor(private reactiveStore: ReactiveStore) {}

  ngOnInit() {
    this.reactiveStore.select('user').subscribe((user: any) => {
      this.isAdmin = user ? user.isAdmin : false;
      console.log('isAdmin', this.isAdmin);
    });
  }
}
