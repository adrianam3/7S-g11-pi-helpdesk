import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ChartOptions, ChartType, ChartData, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PopoverController } from '@ionic/angular';
import { PopoverResumenTicketsComponent } from 'src/app/components/popover-resumen-tickets/popover-resumen-tickets.component';

Chart.register(ChartDataLabels);

interface EstadoTicket {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  public dashboardAll: EstadoTicket[] = [];

  fechaInicio: string = '';
  fechaFin: string = '';
  mostrarInicio = false;
  mostrarFin = false;
  tabSeleccionada: string = 'estado';
  dashboardDeptoEstado: any[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Pie chart config con tipos flexibles
  pieChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  pieChartType: ChartType = 'pie';

  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      datalabels: {
        formatter: (value, ctx) => {
          const total = (ctx.chart.data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
          return ((value * 100) / total).toFixed(1) + '%';
        },
        color: '#fff',
        font: {
          weight: 'bold'
        }
      }
    }
  };

  pieChartPlugins: Plugin[] = [ChartDataLabels];

 

  constructor(
    private popoverController: PopoverController,
    private toastController: ToastController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
    this.fechaInicio = startOfMonth.toISOString().split('T')[0];
    this.fechaFin = today.toISOString().split('T')[0];
    this.cargarTicketXEstado();
    this.cargarPorDepartamentoEstado();
  }

  abrirSelector(tipo: 'inicio' | 'fin') {
    tipo === 'inicio' ? (this.mostrarInicio = true) : (this.mostrarFin = true);
  }

  cerrarSelector(tipo: 'inicio' | 'fin') {
    tipo === 'inicio' ? (this.mostrarInicio = false) : (this.mostrarFin = false);
  }

  cambiarFecha(event: any, tipo: 'inicio' | 'fin') {
    const fecha = event.detail.value;
    tipo === 'inicio' ? (this.fechaInicio = fecha) : (this.fechaFin = fecha);
    this.cerrarSelector(tipo);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  async cargarPorDepartamentoEstado() {
    try {
      const endpoint = `controllers/ticket.controller.php?op=dashboarddepartamentoestado&fechaInicio=${this.fechaInicio}&fechaFin=${this.fechaFin}`;
      const data: any = await (await this.apiService.get(endpoint)).toPromise();
      this.dashboardDeptoEstado = data;
    } catch (error) {
      this.showToast('Error al cargar datos de la tabla', 'danger');
      console.error(error);
    }
  }
  
    async cargarTicketXEstado() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.showToast('Debes seleccionar ambas fechas', 'warning');
      return;
    }

    const fechaInicioFormatted = this.fechaInicio.slice(0, 10);
    const fechaFinFormatted = this.fechaFin.slice(0, 10);

    try {
      const endpoint = `controllers/ticket.controller.php?op=dashboard&fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`;
      const data: any = await (await this.apiService.get(endpoint)).toPromise();
      console.log(data);
      this.dashboardAll = data.map((e: { estadot: any; cantidad: any }) => ({
        name: e.estadot,
        value: Number(e.cantidad)
      }));

      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8E44AD', '#2ECC71', '#E67E22', '#1ABC9C'];

      this.pieChartData.labels = this.dashboardAll.map(d => d.name);
      this.pieChartData.datasets[0].data = this.dashboardAll.map(d => d.value);
      this.pieChartData.datasets[0].backgroundColor = colors.slice(0, this.dashboardAll.length);

      this.chart?.update(); // fuerza el redibujo del gráfico
    } catch (error) {
      this.showToast('Error al cargar datos del dashboard', 'danger');
      console.error('Error en API:', error);
    }
  }

  async onSubmit() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.showToast('Debes seleccionar ambas fechas', 'warning');
      return;
    }
  
    if (this.tabSeleccionada === 'estado') {
      await this.cargarTicketXEstado();
    }
  
    if (this.tabSeleccionada === 'departamento') {
      await this.cargarPorDepartamentoEstado();
    }
  
    if (this.tabSeleccionada === 'agente') {
      // await this.cargarPorAgente(); 
    }
  
    if (this.tabSeleccionada === 'satisfaccion') {
      // await this.cargarSatisfaccionUsuario(); 
    }
  }
  

  exportChart() {
    const canvas: any = document.querySelector('canvas');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'dashboard-chart.png';
    link.click();
  }

  exportarTablaAExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dashboardDeptoEstado);
    const workbook: XLSX.WorkBook = { Sheets: { 'Tickets por Departamento': worksheet }, SheetNames: ['Tickets por Departamento'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    FileSaver.saveAs(blob, `tickets_departamento_${this.fechaInicio}_a_${this.fechaFin}.xlsx`);
  }
  formatearHorasDecimal(valor: number | null | undefined): string {
    if (valor == null || valor === 0) {
      return '–';
    }
  
    const horas = Math.floor(valor);
    const minutos = Math.round((valor - horas) * 60);
  
    let resultado = '';
    if (horas > 0) {
      resultado += `${horas} h`;
    }
    if (minutos > 0) {
      resultado += `${horas > 0 ? ' ' : ''}${minutos} min`;
    }
  
    return resultado || '–';
  }
  public getFilasFiltradas(): any[] {
    return this.dashboardDeptoEstado.filter(item =>
      item.Abierto > 0 ||
      item.Asignado > 0 ||
      item.EnProgreso > 0 ||
      item.Cerrado > 0 ||
      item.Reaperturado > 0 ||
      item.Escalado > 0 ||
      item.TiempoRespuestaTotal > 0 ||
      item.TiempoRespuestaPromedio > 0 ||
      item.TiempoServicioTotal > 0 ||
      item.TiempoServicioPromedio > 0
    );
  }
  
  getTotales(): any {
    const total = {
      DepartamentoNombre: 'TOTAL',
      Abierto: 0,
      Asignado: 0,
      EnProgreso: 0,
      Cerrado: 0,
      Reaperturado: 0,
      Escalado: 0,
      TiempoRespuestaTotal: 0,
      TiempoRespuestaPromedio: 0,
      TiempoServicioTotal: 0,
      TiempoServicioPromedio: 0,
      TotalTickets: 0
    };
  
    const filas = this.getFilasFiltradas();
  
    for (const item of filas) {
      total.Abierto += Number(item.Abierto);
      total.Asignado += Number(item.Asignado);
      total.EnProgreso += Number(item.EnProgreso);
      total.Cerrado += Number(item.Cerrado);
      total.Reaperturado += Number(item.Reaperturado);
      total.Escalado += Number(item.Escalado);
  
      total.TiempoRespuestaTotal += Number(item.TiempoRespuestaTotal);
      total.TiempoRespuestaPromedio += Number(item.TiempoRespuestaPromedio);
      total.TiempoServicioTotal += Number(item.TiempoServicioTotal);
      total.TiempoServicioPromedio += Number(item.TiempoServicioPromedio);
  
      total.TotalTickets +=
        Number(item.Abierto) + Number(item.Asignado) + Number(item.EnProgreso) +
        Number(item.Cerrado) + Number(item.Reaperturado) + Number(item.Escalado);
    }
  
    const count = filas.length || 1;
    total.TiempoRespuestaPromedio = total.TiempoRespuestaPromedio / count;
    total.TiempoServicioPromedio = total.TiempoServicioPromedio / count;
  
    return total;
  }
  
  async mostrarPopoverTickets(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: PopoverResumenTicketsComponent,
      componentProps: { item },
      event: ev,
      translucent: true,
      showBackdrop: true
    });
    await popover.present();
  }
  
  getTotalTicketsFila(item: any): number {
    return (
      Number(item.Abierto) +
      Number(item.Asignado) +
      Number(item.EnProgreso) +
      Number(item.Cerrado) +
      Number(item.Reaperturado) +
      Number(item.Escalado)
    );
  }
  
}
