import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  {
    path: 'download-minutas',
    loadChildren: () => import('./views/download-minutas/download-minutas.module').then( m => m.DownloadMinutasPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'upload-minutas',
    loadChildren: () => import('./views/upload-minutas/upload-minutas.module').then( m => m.UploadMinutasPageModule)
  },
  {
    path: 'form',
    loadChildren: () => import('./views/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'form2',
    loadChildren: () => import('./views/form2/form2.module').then( m => m.Form2PageModule)
  },
  {
    path: 'share',
    loadChildren: () => import('./share/share.module').then( m => m.SharePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
