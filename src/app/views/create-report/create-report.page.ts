import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Minute } from 'src/app/share/models/minuteData';
import { data } from 'src/app/mockMinutesData';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MinuteService } from 'src/app/services/minute/minute.service';
import { IonContent } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';
import { map, of, switchMap, tap } from 'rxjs';
import { ReactiveStore } from 'src/app/app-store';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.page.html',
  styleUrls: ['./create-report.page.scss'],
})
export class CreateReportPage implements OnInit {
  minute: Minute;

  swiperModules = [IonicSlides];

  clickOnSavedLocally = false;
  clickOnSend = false;
  isSavedLocally = false;

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
    private reactiveStore: ReactiveStore,
    private minutesService: MinuteService
  ) {}

  ngOnInit() {
    this.minute = { ...data };

    this.reactiveStore.select('user').subscribe((userData: any) => {
      if (userData) {
        this.minute.user = userData.name;
      }
    });

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
            this.isSavedLocally = true;
            this.minute = storedMinute;
          } else {
            this.minute.date = new Date().toISOString().split('T')[0];
          }
        })
      )
      .subscribe(() => {});
  }

  onClickNext() {
    this.swiperRef?.nativeElement.swiper.slideNext();
    this.pageTop.scrollToTop();
  }

  onClickPrev() {
    this.swiperRef?.nativeElement.swiper.slidePrev();
    this.pageTop.scrollToTop();
  }

  async onSaveMinute() {
    let loading = await this.loadingCtrl.create();
    this.clickOnSavedLocally = true;

    if (this.generalDataForm.valid) {
      try {
        await loading.present();

        this.minutesService.saveLocally(this.minute);
        this.isSavedLocally = true;
      } catch (error) {
      } finally {
        loading.dismiss();
      }
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
    let loading = await this.loadingCtrl.create();
    this.clickOnSend = true;

    if (
      this.generalDataForm.valid &&
      this.technicalDataForm.valid &&
      this.checkDataForm.valid
    ) {
      try {
        await loading.present();
        this.minutesService.saveMinuteInCloud(this.minute);
        this.router.navigate(['/home']);
      } catch (error) {
      } finally {
        loading.dismiss();
      }
    } else {
      const alert = await this.alertController.create({
        message: 'Revise y complete los campos obligatorios marcados con * ',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  async onDiscard() {
    let loading = await this.loadingCtrl.create();
    this.minutesService.discardMinute(this.minute.equipment_code);
    loading.dismiss();
    this.router.navigate(['/home']);
  }
}
