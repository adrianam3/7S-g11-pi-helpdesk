export interface TicketDetalle {
  idTicketDetalle: number;
  idTicket: number;
  idAgente: number;
  idDepartamentoA: number;
  observacion?: string;
  detalle: string;
  fechaDetalle?: string;
  tipoDetalle: string;
}

