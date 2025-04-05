import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Ticket } from 'src/app/models/ticket.model';
import { ApiService } from 'src/app/services/api.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { ValidarRolesService } from 'src/app/services/validar-roles.service';

@Component({
  selector: 'app-n-ticket',
  templateUrl: './n-ticket.page.html',
  styleUrls: ['./n-ticket.page.scss'],
  standalone: false,
})
export class NTicketPage {
  public ticketForm!: FormGroup;
  public ticket: any = null;
  public prioridades: any[] = [];
  public slas: any[] = [];
  public departamentoAgentes: any[] = [];
  public agentes: any[] = [];
  public estadoTickets: any[] = [];
  public temasAyuda: any[] = [];

  public idUsuario = '';
  public nombreCompletoUsuario = '';
  public emailUsuario = '';
  public operation = 'op=insertar';
  public isEdicion = false;
  public loading = true;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: SecureStorageService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public validarRol: ValidarRolesService,
    private navCtrl: NavController,
  ) { }

  public async ionViewWillEnter() {
    await this.validarRol.cargarDatos();
    this.validarRol.datosCargados$.subscribe(async cargado => {
      if (cargado) {
        this.validarRol.rol$.subscribe(idRol => {
          console.log('ROL DETECTADO:', idRol);
          // Aquí puedes hacer lógica específica según el rol
        });
          this.idUsuario = await this.storage.get('idUsuario');
          const nombres = await this.storage.get('nombres');
          const apellidos = await this.storage.get('apellidos');
          this.nombreCompletoUsuario = `${nombres} ${apellidos}`;
          this.emailUsuario = await this.storage.get('email');
          await this.cargaInicial();
      }
    });
  }

  private async cargaInicial() {
    try {
      await this.cargarListas();
      await this.inicializarFormulario();

      this.activatedRoute.params.subscribe(async (params) => {
        const idTicket = params['codigo'];
        if (idTicket) {
          this.operation = 'op=actualizar';
          this.isEdicion = true;
          await this.cargarTicket(idTicket);
        } else {
          this.operation = 'op=insertar';
          this.configurarFormularioNuevo();
        }
        this.loading = false;
      });
    } catch (error) {
      this.showToast('Error al iniciar ticket', 'danger');
      this.loading = false;
    }
  }

  private async cargarListas(): Promise<void> {
    const entidades = [
      { endpoint: 'controllers/sla.controller.php?op=todos', key: 'slas' },
      { endpoint: 'controllers/prioridad.controller.php?op=todos', key: 'prioridades' },
      { endpoint: 'controllers/departamentoagente.controller.php?op=todos', key: 'departamentoAgentes' },
      { endpoint: 'controllers/estadoticket.controller.php?op=todos', key: 'estadoTickets' },
      { endpoint: 'controllers/temaayuda.controller.php?op=todos', key: 'temasAyuda' },
    ];

    for (const entidad of entidades) {
      const data = await (await this.apiService.get(entidad.endpoint)).toPromise();
      if (Array.isArray(data)) {
        (this as any)[entidad.key] = data;
      }
    }
  }

  private async inicializarFormulario() {
    this.ticketForm = this.fb.group({
      idTicket: [null],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      departamentoAgente: [null, this.validarRol.esAdministrador() || this.validarRol.esCoordinador() ? Validators.required: null],
      agente: [null, this.validarRol.esAdministrador() || this.validarRol.esCoordinador() ? Validators.required : null],
      prioridad: [null, this.validarRol.esAdministrador() || this.validarRol.esAgente() ? Validators.required : null],
      sla: [null, this.validarRol.esAdministrador() || this.validarRol.esAgente() ? Validators.required : null],
      temaAyuda: [null, Validators.required],
      estadoTicket: [null],
      estadoTicketNombre: [''],
      emailUsuario: [this.emailUsuario],
      nombreUsuario: [this.nombreCompletoUsuario],
      fechaCreacion: [''],
      fechaAtualizacion: [''],
      fechaInicioAtencion: [''],
      fechaReapertura: [''],
      fechaPrimeraRespuesta: [''],
      fechaUltimaRespuesta: [''],
      fechaCierre: ['']
    });

    this.ticketForm.get('departamentoAgente')?.valueChanges.subscribe(dep => {
      const id = dep?.idDepartamentoA || dep;
      this.ticketForm.get('idDepartamentoA')?.setValue(id);
      this.getAgentes(id);
    });

    this.ticketForm.get('agente')?.valueChanges.subscribe(agente => {
      const id = agente?.idAgente || agente;
      this.ticketForm.get('idAgente')?.setValue(id);
    });
  }

  private configurarFormularioNuevo() {
    this.ticketForm.patchValue({
      estadoTicket: this.estadoTickets.find(e => e.idEstadoTicket === 1),
      prioridad: this.prioridades.find(p => Number(p.idPrioridad) === 1),
      sla: this.slas.find(s => s.idSla === 1),
      temaAyuda: this.temasAyuda[0]
    });
    console.log(this.prioridades);
    console.log(this.ticketForm.value)
    this.ticket = {};
  }

  private async cargarTicket(idTicket: string) {
    try {
      const formData = new FormData();
      formData.append('idTicket', idTicket);
      const data = await (await this.apiService.postData(formData, 'op=uno')).toPromise();

      const sla = this.slas.find(s => s.idSla == data.idSla);
      const prioridad = this.prioridades.find(p => p.idPrioridad == data.idPrioridad);
      const depto = this.departamentoAgentes.find(d => d.idDepartamentoA == data.idDepartamentoA) || null;
      const tema = this.temasAyuda.find(t => t.idTemaAyuda == data.idTemaAyuda);
      const estado = this.estadoTickets.find(e => e.idEstadoTicket == data.idEstadoTicket);

      let agentes: any = [];
      if (depto) {
        agentes = await (await this.apiService.get(`controllers/agente.controller.php?op=todosByDepartamento&idDepartamentoA=${depto.idDepartamentoA}`)).toPromise();
        this.agentes = agentes;
      }
      const agente = this.agentes.find(a => a.idAgente == data.idAgente) || null;
      console.log(agente);
      console.log(depto);

      this.ticketForm.patchValue({
        ...data,
        sla,
        prioridad,
        departamentoAgente: depto,
        agente,
        temaAyuda: tema,
        estadoTicket: estado,
        emailUsuario: data.email,
        nombreUsuario: `${data.personaNombres} ${data.personaApellidos}`
      });

      this.ticket = data;
    } catch (error) {
      this.showToast('Error al cargar el ticket', 'danger');
    }
  }

  async onDepartamentoChange(event: any) {
    const idDepartamento = event.detail.value.idDepartamentoA;
    console.log("id departamento: " + idDepartamento);

    this.getAgentes(idDepartamento);
  }

  async getAgentes(idDepartamento: number) {
    try {
      const agentes: any = await (await this.apiService.get(`controllers/agente.controller.php?op=todosByDepartamento&idDepartamentoA=${idDepartamento}`)).toPromise();
      this.agentes = agentes;
    } catch (err) {
      this.agentes = [];
    }
  }

  async confirmGuardar() {
    const alerta = await this.alertController.create({
      header: this.isEdicion ? 'Actualizar Ticket' : 'Crear Ticket',
      message: '¿Desea continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.guardarTicket() }
      ]
    });
    await alerta.present();
  }

  async guardarTicket() {
    if (this.ticketForm.invalid) {
      this.showToast('Complete todos los campos obligatorios.', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Guardando...' });
    await loading.present();

    try {
      const value = this.ticketForm.value;
      const now = new Date().toISOString();
      let idAgente = value.agente?.idAgente || null;
      let idDepartamentoA = value.departamentoAgente?.idDepartamentoA || null;
      if (!idAgente || !idDepartamentoA) {
        idAgente = null;
        idDepartamentoA = null;
      }
      const payload = {
        idTicket: value.idTicket || '',
        titulo: value.titulo,
        descripcion: value.descripcion,
        idDepartamentoA,
        idAgente,
        idPrioridad: value.prioridad?.idPrioridad || null,
        idSla: value.sla?.idSla,
        idUsuario: this.idUsuario,
        idfuenteContacto: '1',
        idTemaAyuda: value.temaAyuda?.idTemaAyuda,
        resueltoPrimerContacto: '0',
        idEstadoTicket: '1',
        emailUsuario: this.emailUsuario,
        nombreUsuario: this.nombreCompletoUsuario,
        fechaCreacion: now
      };

      const formData = this.apiService.createFormData(payload);
      console.log('formData:', formData);
      const response = await (await this.apiService.postData(formData, this.operation)).toPromise();

      this.showToast('Ticket guardado correctamente.', 'success');
      this.ticketForm.reset();
      this.navCtrl.navigateBack('/ticket');
    } catch (error) {
      this.showToast('Error al guardar ticket', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async confirmCancelar() {
    const alert = await this.alertController.create({
      header: 'Cancelar',
      message: '¿Desea cancelar la creación del ticket?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => history.back()
        }
      ]
    });
    await alert.present();
  }

  async showToast(msg: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color
    });
    toast.present();
  }

  get cargando(): boolean {
    return this.loading || !this.ticketForm;
  }
}
