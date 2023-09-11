import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download-minutes',
  templateUrl: './download-minutes.page.html',
  styleUrls: ['./download-minutes.page.scss'],
})
export class DownloadMinutesPage implements OnInit {

  constructor(private router: Router) { }

  // navigateHome(){
  //   this.router.navigate(["home"])
  // }

  ngOnInit() {
  }

}
