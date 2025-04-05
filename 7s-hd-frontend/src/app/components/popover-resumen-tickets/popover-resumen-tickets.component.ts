import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popover-resumen-tickets',
  // template: `
  //   <ion-list lines="none" class="ion-padding">
  //     <ion-item *ngFor="let estado of estados">
  //       <ion-label>{{ estado.nombre }}</ion-label>
  //       <ion-badge color="primary" slot="end">{{ estado.valor }}</ion-badge>
  //     </ion-item>
  //   </ion-list>
  // `
  templateUrl: './popover-resumen-tickets.component.html'
  ,standalone: false
})
export class PopoverResumenTicketsComponent {
  @Input() item: any;

  get estados() {
    return [
      { nombre: 'Abierto', valor: this.item?.Abierto || 0 },
      { nombre: 'Asignado', valor: this.item?.Asignado || 0 },
      { nombre: 'En Progreso', valor: this.item?.EnProgreso || 0 },
      { nombre: 'Cerrado', valor: this.item?.Cerrado || 0 },
      { nombre: 'Reaperturado', valor: this.item?.Reaperturado || 0 },
      { nombre: 'Escalado', valor: this.item?.Escalado || 0 }
    ];
  }

  getTotal(): number {
    return this.estados.reduce((acc, estado) => acc + Number(estado.valor), 0);
  }
  
}
