import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-minutes',
  templateUrl: './upload-minutes.page.html',
  styleUrls: ['./upload-minutes.page.scss'],
})

export class UploadMinutesPage implements OnInit {

  selectedFile: File | null = null;

  constructor(private router: Router) {}
  navigateHome(){
    this.router.navigate(["home"])
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  uploadFile() {
    if (this.selectedFile) {
      // Aquí puedes agregar la lógica para cargar el archivo, por ejemplo, usando una API.
      // Puedes utilizar servicios HTTP de Angular para hacer la carga real del archivo.
      // Ejemplo ficticio:
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Llama a tu servicio o API para cargar el archivo
      // Ejemplo ficticio:
      // this.fileService.uploadFile(formData).subscribe(response => {
      //   console.log('Archivo cargado con éxito', response);
      // });
    }
  }
  ngOnInit() {
  }


  
}
