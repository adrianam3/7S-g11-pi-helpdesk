import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];
  userRole: number = 0;

  constructor(private storage: SecureStorageService, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    this.userRole = await this.storage.get('idRol');
    this.loadMenu();
  }

  loadMenu() {
    const menuOptions = [
      { title: 'Inicio', url: '/home', icon: 'home', roles: [1, 2, 3, 4] },
      { title: 'Mis Tickets', url: '/tickets', icon: 'document-text', roles: [2, 3] },
      { title: 'Gestión de Tickets', url: '/admin-tickets', icon: 'list', roles: [1, 4] },
      { title: 'Base de Conocimiento', url: '/knowledge-base', icon: 'book', roles: [1, 2, 3, 4] },
      { title: 'Usuarios', url: '/users', icon: 'people', roles: [1] },
      { title: 'Perfil', url: '/profile', icon: 'person', roles: [1, 2, 3, 4] },
      { title: 'Cerrar Sesión', url: '/logout', icon: 'log-out', roles: [1, 2, 3, 4] }
    ];

    // Filtrar opciones según el rol del usuario
    this.menuItems = menuOptions.filter(option => option.roles.includes(this.userRole));
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
