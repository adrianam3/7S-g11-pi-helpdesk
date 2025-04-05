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
      celular: ['', Validators.required],
      estado: ['1'],
      extension: ['0'],
    });
  }

  private async getPersona() {
    this.activatedRoute.params.subscribe(async params => {
      this.idPersona = params['codigo'];
      if (this.idPersona) {
        console.log(this.idPersona)
        this.isEdicion = true;
        await this.loadPersona(this.idPersona);
      } else {
        this.isEdicion = false;
        this.personaForm.setValue
      }
    });
  }

  // private async loadPersona(id: number) {
  //   const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
  //   await loading.present();

  //   try {
  //     const personaObservable = (await this.apiService.post('controllers/persona.controller.php?op=uno', { idPersona: id })).toPromise();
  //     console.log(personaObservable)
  //     this.personaForm.patchValue(personaObservable);
  //   } catch (error) {
  //     this.showToast('Error al cargar los datos.', 'danger');
  //   } finally {
  //     await loading.dismiss();
  //   }
  // }

  async loadPersona(idPersona: any) {
    const loading = await this.loadingCtrl.create({ message: 'Cargando persona...' });
    await loading.present();

    try {
      const formData = new FormData();
      formData.append('idPersona', idPersona);

      const response: any = await (await this.apiService.postFormData(`controllers/persona.controller.php?op=uno`, formData)).toPromise();

      if (response) {
        this.personaForm.patchValue(response);
      }
    } catch (error) {
      this.showToast('Error al cargar la persona', 'danger');
    } finally {
      loading.dismiss();
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
    const formData = new FormData();
    const formValue = this.personaForm.value;
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        formData.append(key, formValue[key]);
      }
    }

    const operation = this.isEdicion ? 'op=actualizar' : 'op=insertar';
    try {
      // await (await this.apiService.post(`controllers/persona.controller.php?${operation}`, formData)).toPromise();
      await (await this.apiService.postFormData(`controllers/persona.controller.php?${operation}`, formData)).toPromise();
      this.showToast('Operación exitosa', 'success');
      this.navCtrl.navigateBack('/personas');
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
        { text: 'Sí', handler: () => this.navCtrl.navigateBack('/personas') },
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
