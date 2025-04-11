import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  perfilForm: FormGroup;
  passwordForm: FormGroup;

  nombreCompleto: string = '';
  rolUsuario: string = '';

  constructor(
    private fb: FormBuilder,
    private secureStorage: SecureStorageService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private apiService: ApiService
  ) {
    this.perfilForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      telefono: ['']
    });

    this.passwordForm = this.fb.group({
      actual: ['', Validators.required],
      nueva: ['', [Validators.required, Validators.minLength(8)]],
      confirmar: ['', Validators.required]
    }, { validators: this.matchPasswords });
  
    this.perfilForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email: [{ value: '', disabled: true }],
      telefono: ['', [Validators.pattern(/^[0-9]{9,15}$/)]]
    });
   
  
  }

  async ngOnInit() {
    await this.cargarDatosPersona();
  }

  async cargarDatosPersona() {
    const idPersona = await this.secureStorage.get('idPersona');
    const idRol = await this.secureStorage.get('idRol');
  
    console.log('ID Persona desde SecureStorage:', idPersona); // 👀 para depuración
  
    // Validación explícita
    if (!idPersona || isNaN(Number(idPersona))) {
      this.showToast('No se pudo obtener un ID de persona válido.', 'danger');
      return;
    }
  
    const formData = new FormData();
    formData.append('idPersona', String(Number(idPersona)));
  
    const loading = await this.loadingController.create({ message: 'Cargando perfil...' });
    await loading.present();
  
    try {
      const response: any = await (await this.apiService.postFormData('controllers/persona.controller.php?op=uno', formData)).toPromise();
  
      if (response) {
        this.perfilForm.patchValue({
          nombres: response.nombres,
          apellidos: response.apellidos,
          email: response.email,
          telefono: response.telefono
        });
  
        this.nombreCompleto = `${response.nombres} ${response.apellidos}`;
        this.rolUsuario = this.getRolNombre(idRol);
      } else {
        this.showToast('No se encontró la persona.', 'warning');
      }
    } catch (error) {
      this.showToast('Error al cargar los datos del perfil', 'danger');
    } finally {
      await loading.dismiss();
    }
  }
  
  getRolNombre(id: any): string {
    switch (String(id)) {
      case '1': return 'Administrador';
      case '2': return 'Usuario';
      case '3': return 'Agente';
      case '4': return 'Coordinador';
      default: return 'Desconocido';
    }
  }

  matchPasswords(group: FormGroup) {
    const nueva = group.get('nueva')?.value;
    const confirmar = group.get('confirmar')?.value;
    return nueva === confirmar ? null : { notMatching: true };
  }

  // async guardarPerfil() {
  //   if (this.perfilForm.invalid) {
  //     this.showToast('Completa todos los campos obligatorios', 'danger');
  //     return;
  //   }

  //   const loading = await this.loadingController.create({ message: 'Guardando cambios...' });
  //   await loading.present();

  //   const idPersona = await this.secureStorage.get('idPersona');
  //   const formData = new FormData();
  //   formData.append('idPersona', idPersona);
  //   formData.append('nombres', this.perfilForm.value.nombres);
  //   formData.append('apellidos', this.perfilForm.value.apellidos);
  //   formData.append('telefono', this.perfilForm.value.telefono);

  //   try {
  //     const response: any = await (await this.apiService.postFormData('controllers/persona.controller.php?op=actualizar_perfil', formData)).toPromise();
  //     this.showToast(response.message || 'Perfil actualizado con éxito', 'success');
  //   } catch (error) {
  //     this.showToast('Error al actualizar el perfil', 'danger');
  //   } finally {
  //     await loading.dismiss();
  //   }
  // }

  async guardarPerfil() {
    if (this.perfilForm.invalid) {
      this.showToast('Completa todos los campos correctamente', 'danger');
      return;
    }
  
    const loading = await this.loadingController.create({ message: 'Guardando cambios...' });
    await loading.present();
  
    const idPersona = await this.secureStorage.get('idPersona');
    const formData = new FormData();
    formData.append('idPersona', idPersona);
    formData.append('nombres', this.perfilForm.value.nombres);
    formData.append('apellidos', this.perfilForm.value.apellidos);
    formData.append('telefono', this.perfilForm.value.telefono);
  
    try {
      const response: any = await (await this.apiService.postFormData('controllers/persona.controller.php?op=actualizar_perfil', formData)).toPromise();
  
      if (response?.message) {
        this.showToast(response.message, 'success');
        await this.cargarDatosPersona(); // ✅ Refrescar los datos actualizados
      } else {
        this.showToast('No se pudo actualizar. Verifica los datos.', 'danger');
      }
    } catch (error) {
      this.showToast('Ocurrió un error al actualizar el perfil.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }
  
  
  // async cancelarCambios() {
  //   const confirmado = confirm('¿Deseas cancelar los cambios y restaurar los datos originales?');
  //   if (confirmado) {
  //     await this.cargarDatosPersona();
  //     this.showToast('Se restauraron los datos del perfil.', 'medium');
  //   }
  // }
  

  async cancelarCambios() {
    const toast = await this.toastController.create({
      message: '¿Deseas cancelar los cambios y restaurar los datos originales?',
      position: 'top',
      duration: 5000,
      color: 'warning',
      buttons: [
        {
          side: 'end',
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          side: 'end',
          text: 'Aceptar',
          handler: async () => {
            await this.cargarDatosPersona();
            this.showToast('Se restauraron los datos del perfil.', 'medium');
          }
        }
      ]
    });
  
    await toast.present();
  }
  

  // async cambiarContrasena() {
  //   if (this.passwordForm.invalid) {
  //     this.showToast('Revisa los campos de contraseña', 'danger');
  //     return;
  //   }

  //   const idUsuario = await this.secureStorage.get('idUsuario');
  //   const formData = new FormData();
  //   formData.append('idUsuario', idUsuario);
  //   formData.append('actual', this.passwordForm.value.actual);
  //   formData.append('nueva', this.passwordForm.value.nueva);

  //   const loading = await this.loadingController.create({ message: 'Actualizando contraseña...' });
  //   await loading.present();

  //   try {
  //     const response: any = await (await this.apiService.postFormData('controllers/perfil.controller.php?op=cambiar_password', formData)).toPromise();
  //     this.showToast(response.message || 'Contraseña actualizada', 'success');
  //     this.passwordForm.reset();
  //   } catch (error) {
  //     this.showToast('Error al cambiar la contraseña', 'danger');
  //   } finally {
  //     await loading.dismiss();
  //   }
  // }

  async cambiarContrasena() {
    if (this.passwordForm.invalid) {
      this.showToast('Revisa los campos de contraseña', 'danger');
      return;
    }
  
    const email = await this.secureStorage.get('email'); // Se usará para validar la contraseña actual
    const actual = this.passwordForm.value.actual;
    const nueva = this.passwordForm.value.nueva;
  
    const formData = new FormData();
    formData.append('email', email);
    formData.append('actual', actual);
    formData.append('nueva', nueva);
  
    const loading = await this.loadingController.create({ message: 'Actualizando contraseña...' });
    await loading.present();
  
    try {
      const response: any = await (await this.apiService.postFormData('controllers/usuario.controller.php?op=cambiar_password', formData)).toPromise();
      this.showToast(response.message || 'Contraseña actualizada', 'success');
      this.passwordForm.reset();
    } catch (error) {
      this.showToast('Error al cambiar la contraseña', 'danger');
    } finally {
      await loading.dismiss();
    }
  }
  

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
