import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
    // , canActivate: [AuthGuard]
  },
  {
    path: 'ticket',
    loadChildren: () => import('./pages/ticket/ticket.module').then(m => m.TicketPageModule)
    // , canActivate: [AuthGuard]
  },
  {
    path: 'base-conocimiento',
    loadChildren: () => import('./pages/base-conocimiento/base-conocimiento.module').then( m => m.BaseConocimientoPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },

  {
    path: 'agentes',
    loadChildren: () => import('./pages/agentes/agentes.module').then( m => m.AgentesPageModule)
  },
  {
    path: 'encuestas',
    loadChildren: () => import('./pages/encuestas/encuestas.module').then( m => m.EncuestasPageModule)
  },
  {
    path: 'npersona',
    loadChildren: () => import('./pages/new-persona/new-persona.module').then( m => m.NewPersonaPageModule)
  },
  {
    path: 'npersona/:codigo',
    loadChildren: () => import('./pages/new-persona/new-persona.module').then( m => m.NewPersonaPageModule)
  },
  {
    path: 'n-ticket',
    loadChildren: () => import('./pages/n-ticket/n-ticket.module').then( m => m.NTicketPageModule)
  },
  {
    path: 'n-ticket/:codigo',
    loadChildren: () => import('./pages/n-ticket/n-ticket.module').then( m => m.NTicketPageModule)
  },
  {
    path: 'new-ticket',
    loadChildren: () => import('./pages/new-ticket/new-ticket.module').then( m => m.NewTicketPageModule)
  },
  {
    path: 'new-ticket/:codigo',
    loadChildren: () => import('./pages/new-ticket/new-ticket.module').then( m => m.NewTicketPageModule)
  },
  {
    path: 'personas',
    loadChildren: () => import('./pages/personas/personas.module').then( m => m.PersonasPageModule)
  },
  // {
  //   path: 'my-encuestas',
  //   loadChildren: () => import('./pages/my-escuestas/my-escuestas.module').then( m => m.MyEscuestasPageModule)
  // },
  {
    path: 'my-encuestas',
    loadChildren: () => import('./pages/my-encuestas/my-encuestas.module').then( m => m.MyEncuestasPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  
  {
    path: 'olvido-contrasena',
    loadChildren: () => import('./pages/olvido-contrasena/olvido-contrasena.module').then( m => m.OlvidoContrasenaPageModule)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./pages/recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
  },
 
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
