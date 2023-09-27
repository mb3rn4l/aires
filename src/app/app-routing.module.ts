import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './share/guards/auth.guard';
import { HeaderLayoutComponent } from './share/components/header-layout/header-layout.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full'
    
  },
  {
    path: '',
    component: HeaderLayoutComponent, 
    children: [
      {
        path: 'home',
        loadChildren: () => import('./views/home/home.module').then( m => m.HomePageModule), 
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      }, 
      {
        path: 'login',
        loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'download-minute',
        loadChildren: () => import('./views/download-minutes/download-minutes.module').then( m => m.DownloadMinutesPageModule)
      },  
      {
        path: 'create-user',
        loadChildren: () => import('./views/create-user/create-user.module').then( m => m.CreateUserPageModule),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'upload-minute',
         loadChildren: () => import('./views/upload-minutes/upload-minutes.module').then( m => m.UploadMinutesPageModule)
      },
      {
        path: 'create-report',
        loadChildren: () => import('./views/create-report/create-report.module').then( m => m.CreateReportPageModule)
      },
    
    ]
  },
  {
    path: 'form',
    loadChildren: () => import('./views/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'form/:id',
    loadChildren: () => import('./views/form/form.module').then(m => m.FormPageModule),
  },
  {
    path: 'reset-password',
    component: HeaderLayoutComponent,
    loadChildren: () => import('./views/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },

 

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
