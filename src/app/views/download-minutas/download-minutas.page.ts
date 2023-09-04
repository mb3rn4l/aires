import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download-minutas',
  templateUrl: './download-minutas.page.html',
  styleUrls: ['./download-minutas.page.scss'],
})
export class DownloadMinutasPage implements OnInit {

  constructor(private router: Router) { }

  navigateHome(){
    this.router.navigate(["home"])
  }

  ngOnInit() {
  }

}
