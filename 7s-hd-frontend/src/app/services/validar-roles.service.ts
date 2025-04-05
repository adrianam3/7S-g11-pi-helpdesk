import { Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidarRolesService {
  private idRolSubject = new BehaviorSubject<number | null>(null);
  private datosCargadosSubject = new BehaviorSubject<boolean>(false);

  public idUsuario!: string;
  public email!: string;
  public nombreCompleto!: string;

  constructor(private storage: SecureStorageService) {}

  /**
   * Inicializa los datos del usuario y emite el rol
   */
  async cargarDatos(): Promise<void> {
    const idRol = await this.storage.get('idRol');
    const idUsuario = await this.storage.get('idUsuario');
    const email = await this.storage.get('email');
    const nombres = await this.storage.get('nombres');
    const apellidos = await this.storage.get('apellidos');

    if (idRol && idUsuario) {
      this.idRolSubject.next(Number(idRol));
      this.idUsuario = idUsuario;
      this.email = email;
      this.nombreCompleto = `${nombres} ${apellidos}`;
      this.datosCargadosSubject.next(true);
    } else {
      this.idRolSubject.next(null);
      this.datosCargadosSubject.next(false);
    }
  }

  /**
   * Observable para el rol
   */
  get rol$() {
    return this.idRolSubject.asObservable();
  }

  /**
   * Observable para saber si los datos fueron cargados
   */
  get datosCargados$() {
    return this.datosCargadosSubject.asObservable();
  }

  /**
   * Métodos síncronos opcionales (usarlos solo si sabes que los datos están cargados)
   */
  esAdministrador(): boolean {
    return this.idRolSubject.getValue() === 1;
  }

  esUsuario(): boolean {
    return this.idRolSubject.getValue() === 2;
  }

  esAgente(): boolean {
    return this.idRolSubject.getValue() === 3;
  }

  esCoordinador(): boolean {
    return this.idRolSubject.getValue() === 4;
  }
}
