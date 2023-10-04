import { jsPDF } from 'jspdf';
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

// guarda la pantalla del celular mejor pero no el optimo

 /*  generatePDF(DATA: any): void {
    // Crea un nuevo documento PDF
    const doc = new jsPDF({
      orientation: 'p', // Orientación 'portrait' (vertical)
      unit: 'mm',       // Unidades en milímetros
      format: 'letter', // Tamaño de papel carta
    });
  
    // Opciones para la conversión de HTML a canvas
    const options = {
      scale: 5, // Ajusta la escala según sea necesario para encajar en la página
    };
  
    // Convierte el contenido HTML a una imagen (PNG) usando html2canvas
    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/png'); // Convierte el canvas a una imagen PNG
  
      // Calcula el tamaño de la imagen para que llene la página
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const aspectRatio = canvas.width / canvas.height;
  
      let imgWidth = pageWidth;
      let imgHeight = imgWidth / aspectRatio;
  
      // Si la altura de la imagen es mayor que la altura de la página, ajusta la altura
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = imgHeight * aspectRatio;
      }
  
      // Centra la imagen verticalmente
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
  
      // Agrega la imagen al PDF
      doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
  
      // Guarda el PDF con un nombre específico (en este caso, 'tutorial.pdf')
      doc.save('tutorial.pdf');
    });
  }
} */
  
  generatePDF(DATA: any): void {
    const doc = new jsPDF('p', 'pt', 'letter'); // 'letter' representa el tamaño de papel carta en puntos (pt)
  
    const options = {
      scale: 2 // Ajusta la escala según sea necesario para encajar en la página
    };

    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/png'); // Cambiado a 'image/png' en minúsculas

      // Añade la imagen al PDF, asegurándote de que se ajuste a la página
      const width = doc.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      doc.addImage(img, 'PNG', 0, 0, width, height);

      // Guarda el PDF
      doc.save('tutorial.pdf');
    });
  } 
}

// antiguo metodo 
  //**********************
 /*  generatePDF(DATA: any): void {
 
    const doc = new jsPDF( 'p', 'px', 'a4');
  
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
     /*  const imgProps = doc.getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; */
    //  doc.addImage(img, 'PNG', bufferX, bufferY, 500, 600);
      // let fileWidth = 208;
      // let fileHeight = (canvas.height * fileWidth) / canvas.width;
      // doc.addImage(img, 'PNG', 0, 0, fileWidth, fileHeight);


    /*   return doc;
    }).then((docResult) => {
      docResult.save(`tutorial.pdf`);
    }); */ 


 // }  

    

  

