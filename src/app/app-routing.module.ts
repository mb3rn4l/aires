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
    ]
  },
  {
    path: 'form2',
    loadChildren: () => import('./views/form2/form2.module').then( m => m.Form2PageModule)
  },
  {
    path: 'form',
    loadChildren: () => import('./views/form/form.module').then( m => m.FormPageModule)
  },
  // {
  //   path: 'upload-minute',
  //   loadChildren: () => import('./views/upload-minutes/upload-minutes.module').then( m => m.UploadMinutesPageModule)
  // },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
