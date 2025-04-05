import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { SecureStorageService } from './services/secure-storage.service';
import { MenuController, Platform } from '@ionic/angular';
import { ValidarRolesService } from './services/validar-roles.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  isLoggedIn: boolean = false;
  menuItems: any[] = [];
  userRole: number = 0;
  userName: string = '';
  userRoleName: string = '';

  private roleNames: { [key: number]: string } = {
    1: 'Administrador',
    2: 'Usuario',
    3: 'Agente',
    4: 'Coordinador'
  };

  constructor(private authService: AuthService,
    private storage: SecureStorageService,
    private router: Router,
    private menuCtrl: MenuController,
    private validarRol: ValidarRolesService,
    private platform: Platform,
  ) {
    this.authService.getAuthState().subscribe(state => {
      this.isLoggedIn = state;
      if (state) {
        this.initializeMenu();
      }
    });

    // Escuchar cambios en el usuario y actualizar menú
    this.authService.getUserUpdate().subscribe(() => {
      this.initializeMenu();
    });

    // Escuchar cambios en el rol y actualizar menú automáticamente
    this.storage.getRoleObservable().subscribe(async role => {
      this.userRole = Number(role);
      this.userRoleName = this.roleNames[this.userRole] || 'Desconocido';
      this.userName = await this.storage.get('nombres') + ' ' + await this.storage.get('apellidos');
      this.loadMenu();
    });
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    await this.validarRol.cargarDatos();
  }

  async closeMenu() {
    await this.menuCtrl.close();
  }

  /** Obtener rol y cargar menú */
  async initializeMenu() {
    const role = await this.storage.get('idRol');
    const nombres = await this.storage.get('nombres');
    const apellidos = await this.storage.get('apellidos');

    console.log('Rol obtenido en initializeMenu:', role);

    if (role) {
      this.userRole = Number(role);
      this.userRoleName = this.roleNames[this.userRole] || 'Desconocido';
      this.userName = `${nombres} ${apellidos}`;
      this.loadMenu();
    }
  }

  loadMenu() {
    const menuOptions = [
      { title: 'Inicio', url: '/home', icon: 'home', roles: [1, 2, 3, 4] },
      { title: 'Mis Tickets', url: '/ticket', icon: 'document-text', roles: [2, 3] },
      { title: 'Gestión de Tickets', url: '/ticket', icon: 'list', roles: [1, 4] },
      { title: 'Base de Conocimiento', url: '/base-conocimiento', icon: 'book', roles: [1, 2, 3, 4] },
      { title: 'Usuarios', url: '/usuarios', icon: 'people', roles: [1] },
      { title: 'Personas', url: '/personas', icon: 'people', roles: [1, 3, 4] },
      { title: 'Perfil', url: '/profile', icon: 'person', roles: [1, 2, 3, 4] },
      { title: 'Agentes', url: '/agentes', icon: 'people-circle-outline', roles: [1, 4] },
      { title: 'Encuestas', url: '/encuestas', icon: 'star-outline', roles: [1, 4] },
      { title: 'Mis Encuestas', url: '/my-encuestas', icon: 'star-outline', roles: [1, 2] },
      { title: 'Dashboard', url: '/dashboard', icon: 'bar-chart', roles: [1] },

    ];

    console.log(' Rol obtenido antes de conversión:', this.userRole, 'Tipo:', typeof this.userRole);

    //  Convertir userRole a número si es un string
    this.userRole = Number(this.userRole);

    if (isNaN(this.userRole)) {
      console.error('Error: userRole sigue sin ser un número válido:', this.userRole);
      return;
    }

    console.log(' Rol convertido correctamente:', this.userRole, 'Tipo:', typeof this.userRole);

    this.menuItems = menuOptions.filter(option => option.roles.includes(this.userRole));

    console.log(' Menú cargado después del filtrado:', this.menuItems);
  }

  async logout() {
    await this.authService.logout();
    await this.storage.remove('idRol');
    await this.menuCtrl.close(); // Cierra el menú automáticamente
    this.router.navigate(['/login']);
  }
}
