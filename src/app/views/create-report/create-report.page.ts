import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Minute } from 'src/app/share/models/minuteData';
import { data } from 'src/app/mockMinutesData';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MinuteService } from 'src/app/services/minute/minute.service';
import { IonContent } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.page.html',
  styleUrls: ['./create-report.page.scss'],
})
export class CreateReportPage implements OnInit {
  minute: Minute = data;

  swiperModules = [IonicSlides];

  clickOnSavedLocally = false;
  clickOnSend = false;

  @ViewChild('generalDataForm') generalDataForm: NgForm;
  @ViewChild('technicalDataForm') technicalDataForm: NgForm;
  @ViewChild('checkDataForm') checkDataForm: NgForm;

  @ViewChild('pageTop', { static: false }) pageTop: IonContent;

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  constructor(
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private minutesService: MinuteService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((paramMap) => {
          const equipmentCode = paramMap.get('equipmentCode');

          if (equipmentCode) {
            return this.minutesService.getFromReactiveStore(equipmentCode);
          }

          return of(undefined);
        }),
        map((storedMinute: any) => {
          if (storedMinute) {
            this.minute = storedMinute;
          } else {
            this.minute.date = new Date().toISOString().split('T')[0];
          }
        })
      )
      .subscribe();
  }

  onClickNext() {
    // this.swiperRef!.nativeElement.swiper.allowSlideNext = true;

    this.swiperRef?.nativeElement.swiper.slideNext();
    // this.swiperRef!.nativeElement.swiper.allowSlideNext = false;

    this.pageTop.scrollToTop();
  }

  async onSaveMinute() {
    this.clickOnSavedLocally = true;

    if (this.generalDataForm.valid) {
      this.minutesService.saveLocally(this.minute);
    } else {
      const alert = await this.alertController.create({
        message:
          'Para guardar el borrador complete los datos obligatorios de la seccion datos generales',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  async onSendMinute() {
    this.clickOnSend = true;

    if (
      this.generalDataForm.valid &&
      this.technicalDataForm.valid &&
      this.checkDataForm.valid
    ) {
      await this.minutesService.saveInFirestore(this.minute);
      this.router.navigate(['/home']);
    } else {
      const alert = await this.alertController.create({
        message: 'Revise y complete los campos obligatorios marcados con * ',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  onClickPrev() {
    this.swiperRef?.nativeElement.swiper.slidePrev();
    this.pageTop.scrollToTop();
  }
}
