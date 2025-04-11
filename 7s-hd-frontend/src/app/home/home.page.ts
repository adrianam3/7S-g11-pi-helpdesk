import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { ApiService } from 'src/app/services/api.service';
import { registerables, Chart } from 'chart.js';
import { Router } from '@angular/router';
import { ValidarRolesService } from '../services/validar-roles.service';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  nombreUsuario: string = '';
  nombreRol: string = '';
  idUsuario: string = '';
  idRol: string = '';
  mostrarGrafico: boolean = false;
  public nombreCompletoUsuario = '';
  public emailUsuario = '';
  mensaje: string = 'Bienvenid@';


  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4CAF50', '#9C27B0']
    }]
  };
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };
  pieChartPlugins = [];

  constructor(
    private secureStorage: SecureStorageService,
    private apiService: ApiService,
    private router: Router, 
    public validarRol: ValidarRolesService,

  ) { }


  async ionViewWillEnter() {
    await this.validarRol.cargarDatos();

    this.validarRol.datosCargados$.subscribe(async cargado => {
      if (cargado) {
        this.validarRol.rol$.subscribe(async idRol => {
          console.log('ROL DETECTADO:', idRol);
          // Aquí puedes hacer lógica específica según el rol
          await this.obtenerDatosUsuario();
          await this.cargarDashboardPorEstado();
        });
        this.idUsuario = await this.secureStorage.get('idUsuario');
        const nombres = await this.secureStorage.get('nombres');
        const apellidos = await this.secureStorage.get('apellidos');
        this.nombreCompletoUsuario = `${nombres} ${apellidos}`;
        this.emailUsuario = await this.secureStorage.get('email');

      }
    });
  }

  async ngOnInit() {

  }

  async obtenerDatosUsuario() {
    const nombres = await this.secureStorage.get('nombres');
    const apellidos = await this.secureStorage.get('apellidos');
    this.nombreUsuario = `${nombres} ${apellidos}`;

    this.idUsuario = await this.secureStorage.get('idUsuario');
    this.idRol = await this.secureStorage.get('idRol');
    this.nombreRol = this.obtenerNombreRol(this.idRol);
  }

  obtenerNombreRol(id: any): string {
    switch (String(id)) {
      case '1': return 'Administrador';
      case '2': return 'Usuario';
      case '3': return 'Agente';
      case '4': return 'Coordinador';
      default: return 'Desconocido';
    }
  }

  getFechaInicioMes(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-01`;
  }

  getFechaHoy(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
  }

  async cargarDashboardPorEstado() {
    const fechaInicio = this.getFechaInicioMes();
    const fechaFin = this.getFechaHoy();

    let endpoint = '';

    if (this.idRol === '1' || this.idRol === '4') {
      endpoint = `controllers/ticket.controller.php?op=dashboardestadototal&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    } else if (this.idRol === '3') {
      endpoint = `controllers/ticket.controller.php?op=dashboardestadoagente&idUsuario=${this.idUsuario}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    } else {
      endpoint = `controllers/ticket.controller.php?op=dashboardestadousuario&idUsuario=${this.idUsuario}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    }

    try {
      const response: any = await (await this.apiService.get(endpoint)).toPromise();

      if (response && Array.isArray(response)) {
        const labels = response.map((r: any) => r.estado);
        const data = response.map((r: any) => Number(r.total));

        this.pieChartData.labels = labels;
        this.pieChartData.datasets[0].data = data;

        this.mostrarGrafico = data.length > 0;
      } else {
        this.mostrarGrafico = false;
      }
    } catch (error) {
      console.error('Error cargando dashboard por estado', error);
      this.mostrarGrafico = false;
    }
  }
  getColorRol(): string {
    switch (String(this.idRol)) {
      case '1': return 'medium';       // Administrador
      case '2': return 'primary';      // Usuario
      case '3': return 'tertiary';     // Agente
      case '4': return 'warning';      // Coordinador
      default: return 'danger';        // Otro
    }
  }

  getIconoRol(): string {
    switch (String(this.idRol)) {
      case '1': return 'shield-checkmark'; // Administrador
      case '2': return 'person';           // Usuario
      case '3': return 'people-circle';    // Agente
      case '4': return 'ribbon';           // Coordinador
      default: return 'help-circle';       // Desconocido
    }
  }
  
  
}
