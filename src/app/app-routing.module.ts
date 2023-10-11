import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './share/guards/auth.guard';
import { HeaderLayoutComponent } from './share/components/header-layout/header-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'download-minute',
    pathMatch: 'full',
  },
  {
    path: '',
    component: HeaderLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./views/home/home.module').then((m) => m.HomePageModule),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./views/login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'download-minute',
        loadChildren: () =>
          import('./views/download-minute/download-minute.module').then(
            (m) => m.DownloadMinutePageModule
          ),
      },
      {
        path: 'create-user',
        loadChildren: () =>
          import('./views/create-user/create-user.module').then(
            (m) => m.CreateUserPageModule
          ),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'create-report',
        loadChildren: () =>
          import('./views/create-report/create-report.module').then(
            (m) => m.CreateReportPageModule
          ),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'create-report/:equipmentCode',
        loadChildren: () =>
          import('./views/create-report/create-report.module').then(
            (m) => m.CreateReportPageModule
          ),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'list-minute',
        loadChildren: () =>
          import('./views/list-minute/list-minute.module').then(
            (m) => m.ListMinutePageModule
          ),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('./views/reset-password/reset-password.module').then(
            (m) => m.ResetPasswordPageModule
          ),
      },
    ],
  },
  {
    path: 'form',
    loadChildren: () =>
      import('./views/form/form.module').then((m) => m.FormPageModule),
  },
  {
    path: 'form/:id',
    loadChildren: () =>
      import('./views/form/form.module').then((m) => m.FormPageModule),
  },
  {
    path: 'form2',
    loadChildren: () =>
      import('./views/form2/form2/form2.module').then((m) => m.Form2PageModule),
  },
  {
    path: 'form2/:id',
    loadChildren: () =>
      import('./views/form2/form2/form2.module').then((m) => m.Form2PageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
