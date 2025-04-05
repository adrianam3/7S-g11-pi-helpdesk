import { Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidarRolesService {
  public idUsuario!: string;
  public idRol!: number;
  public email!: string;
  public nombreCompleto!: string;
  public datosCargados = false;
  private rolSubject = new BehaviorSubject<number | null>(null);

  constructor(private storage: SecureStorageService) { }

  get rol$(): Observable<number | null> {
  return this.rolSubject.asObservable();
  }

async cargarDatos(): Promise<void> {
  if (this.datosCargados) return;
  this.idRol = await this.storage.get('idRol');
  this.rolSubject.next(this.idRol); // Emitimos el nuevo valor
  this.idUsuario = await this.storage.get('idUsuario');
  this.email = await this.storage.get('email');
  const nombres = await this.storage.get('nombres');
  const apellidos = await this.storage.get('apellidos');
  this.nombreCompleto = `${nombres} ${apellidos}`;
  this.datosCargados = true;
}

  /**
   * Carga todos los datos necesarios desde el almacenamiento seguro
   */
  // async cargarDatos(): Promise<void> {
  //   if (this.datosCargados) return;

  //   this.idRol = await this.storage.get('idRol');
  //   console.log('idRol en validar :', this.idRol, 'Tipo:', typeof this.idRol);
  //   this.idUsuario = await this.storage.get('idUsuario');
  //   this.email = await this.storage.get('email');
  //   const nombres = await this.storage.get('nombres');
  //   const apellidos = await this.storage.get('apellidos');
  //   this.nombreCompleto = `${nombres} ${apellidos}`;
  //   this.datosCargados = true;
  // }

  /**
  * Verifica si el rol actual es Administrador (1)
  */
  esAdministrador(): boolean {
    // return Number(this.idRol) === 1;
    const resultado = Number(this.idRol) === 1;
    console.log('¿Es admin? idRol =', this.idRol, 'Resultado:', resultado);
    return resultado;
  }

  /**
   * Verifica si el rol actual es Usuario (2)
   */
  esUsuario(): boolean {
    const resultado = Number(this.idRol) === 2;
    console.log('¿Es usuario? idRol =', this.idRol, 'Resultado:', resultado);
    return resultado;
  }

  /**
   * Verifica si el rol actual es Agente (3)
   */
  esAgente(): boolean {
    const resultado = Number(this.idRol) === 3;
    console.log('¿Es agente? idRol =', this.idRol, 'Resultado:', resultado);
    return resultado;
  }

  /**
   * Verifica si el rol actual es Coordinador (4)
   */
  esCoordinador(): boolean {
    const resultado = Number(this.idRol) === 4;
    console.log('¿Es coord? idRol =', this.idRol, 'Resultado:', resultado);
    return resultado;
  }
}
