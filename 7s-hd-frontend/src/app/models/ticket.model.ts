// src/app/models/ticket.model.ts
export class Ticket {
  idTicket!: number;
  titulo!: string;
  descripcion!: string;
  departamentoAgente: any; // O define un tipo específico, por ejemplo, DepartamentoAgente
  agente?: any;           // Opcional, según el rol o la lógica del negocio
  sla: any;               // Puedes tipificarlo si tienes una clase/interface para SLA
  prioridad: any;         // Igual, podrías definir un modelo para la prioridad
  estadoTicket?: any;     // Opcional, si este campo se asigna en ciertos casos

  // Otros campos que manejes en tu base de datos, por ejemplo:
  fechaCreacion?: string;
  fechaActualizacion?: string;
  fechaInicioAtencion?: string;
  // Puedes agregar más propiedades según lo necesites

  constructor(init?: Partial<Ticket>) {
    Object.assign(this, init);
  }
}
