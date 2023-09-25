import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericInput]'
})
export class NumericInputDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any): void {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    // Permite teclas de navegación como Flecha Izquierda, Flecha Derecha, Eliminar y Retroceso
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Delete' || event.key === 'Backspace') {
      return;
    }

    // Permite números y teclas Ctrl, Shift, Alt
    if (isNaN(Number(event.key)) && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
    }
  }
}
