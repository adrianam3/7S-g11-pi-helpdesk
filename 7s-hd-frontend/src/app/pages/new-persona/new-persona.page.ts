import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-new-persona',
  templateUrl: './new-persona.page.html',
  styleUrls: ['./new-persona.page.scss'],
  standalone: false
})
export class NewPersonaPage implements OnInit {

  public personaForm!: FormGroup;
  public isEdicion = false;
  private idPersona!: number;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initForm();
    this.getPersona();
  }

  private initForm() {
    this.personaForm = this.fb.group({
      cedula: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      celular: ['', Validators.required]
    });
  }

  private async getPersona() {
    this.activatedRoute.params.subscribe(async params => {
      this.idPersona = params['id'];
      if (this.idPersona) {
        this.isEdicion = true;
        await this.loadPersona(this.idPersona);
      }
    });
  }

  private async loadPersona(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();

    try {
      const personaObservable = (await this.apiService.post('controllers/persona.controller.php?op=uno', { idPersona: id })).toPromise();
      this.personaForm.patchValue(personaObservable);
    } catch (error) {
      this.showToast('Error al cargar los datos.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  public async confirmCrearActualizar() {
    const alert = await this.alertCtrl.create({
      header: this.isEdicion ? 'Actualizar Persona' : 'Crear Persona',
      message: `¿Está seguro de ${this.isEdicion ? 'actualizar' : 'crear'} esta persona?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => this.crearActualizarPersona(),
        },
      ],
    });
    await alert.present();
  }

  private async crearActualizarPersona() {
    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    const operation = this.isEdicion ? 'op=actualizar' : 'op=insertar';
    try {
      await (await this.apiService.post(`controllers/persona.controller.php?${operation}`, this.personaForm.value)).toPromise();
      this.showToast('Operación exitosa', 'success');
      this.navCtrl.navigateBack('/usuarios');
    } catch (error) {
      this.showToast('Error al procesar la solicitud.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  public async confirmVolver() {
    const alert = await this.alertCtrl.create({
      header: 'Cancelar',
      message: '¿Está seguro de cancelar la operación?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí', handler: () => this.navCtrl.navigateBack('/usuarios') },
      ],
    });
    await alert.present();
  }

  getErrorMessage(field: string): string {
    const control = this.personaForm.get(field);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return `El campo ${field} es obligatorio.`;
    }
    if (control.hasError('email')) {
      return 'Ingrese un correo electrónico válido.';
    }
    if (control.hasError('pattern')) {
      return `El formato del campo ${field} es inválido.`;
    }
    return '';
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
