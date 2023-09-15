import { Component, OnInit } from '@angular/core';
import { Minute } from 'src/app/share/models/minuteData';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.page.html',
  styleUrls: ['./create-report.page.scss'],
})
export class CreateReportPage implements OnInit {

  minute: Minute;



  constructor() { }

  ngOnInit() {
  }

}
