import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  private encryptionKey = 'kEy-secImb.';
  private _storage: Storage | null = null; // Variable para manejar el almacenamiento correctamente
  private roleSubject = new BehaviorSubject<number>(0);

  constructor(private storage: Storage) {
    this.initStorage(); // Inicializar almacenamiento al crear el servicio
  }

  async initStorage() {
    this._storage = await this.storage.create();
    const role = await this.get('idRol') || 0;
    console.log('Rol cargado desde SecureStorage:', role);
    this.roleSubject.next(role); // Emitir el rol almacenado al inicializar
  }

  async set(key: string, value: any) {
    if (!this._storage) {
      await this.initStorage(); // Asegurar que `_storage` está inicializado antes de usarlo
    }

    const encryptedValue = CryptoJS.AES.encrypt(JSON.stringify(value), this.encryptionKey).toString();
    await this._storage?.set(key, encryptedValue);
    if (key === 'idRol') {
      console.log('Rol actualizado en SecureStorage (antes de conversión):', value);
      this.roleSubject.next(Number(value)); // Emitir nuevo rol cuando se actualiza
    }
  }

  async get(key: string): Promise<any> {
    if (!this._storage) {
      await this.initStorage();
    }

    const encryptedValue = await this._storage?.get(key);
    if (!encryptedValue) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.encryptionKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Error al desencriptar:', error);
      return null;
    }
  }

  async remove(key: string) {
    if (!this._storage) {
      await this.initStorage();
    }

    await this._storage?.remove(key);

    if (key === 'idRol') {
      this.roleSubject.next(0); // Resetear rol si se elimina
    }
  }

  /** Observar cambios en el rol del usuario */
  getRoleObservable() {
    return this.roleSubject.asObservable();
  }
//am
  async clear(): Promise<void> {
    const keys = ['token', 'idUsuario', 'idRol', 'email', 'nombres', 'apellidos', 'idPersona'];
    for (const key of keys) {
      await this.remove(key);
    }
  }
  
}
