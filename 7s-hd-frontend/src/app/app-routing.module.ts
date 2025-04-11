import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'ticket',
    loadChildren: () => import('./pages/ticket/ticket.module').then(m => m.TicketPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'base-conocimiento',
    loadChildren: () => import('./pages/base-conocimiento/base-conocimiento.module').then( m => m.BaseConocimientoPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
    , canActivate: [AuthGuard]
  },

  {
    path: 'agentes',
    loadChildren: () => import('./pages/agentes/agentes.module').then( m => m.AgentesPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'encuestas',
    loadChildren: () => import('./pages/encuestas/encuestas.module').then( m => m.EncuestasPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'npersona',
    loadChildren: () => import('./pages/new-persona/new-persona.module').then( m => m.NewPersonaPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'npersona/:codigo',
    loadChildren: () => import('./pages/new-persona/new-persona.module').then( m => m.NewPersonaPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'n-ticket',
    loadChildren: () => import('./pages/n-ticket/n-ticket.module').then( m => m.NTicketPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'n-ticket/:codigo',
    loadChildren: () => import('./pages/n-ticket/n-ticket.module').then( m => m.NTicketPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'new-ticket',
    loadChildren: () => import('./pages/new-ticket/new-ticket.module').then( m => m.NewTicketPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'new-ticket/:codigo',
    loadChildren: () => import('./pages/new-ticket/new-ticket.module').then( m => m.NewTicketPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'personas',
    loadChildren: () => import('./pages/personas/personas.module').then( m => m.PersonasPageModule)
    , canActivate: [AuthGuard]
  },
  // {
  //   path: 'my-encuestas',
  //   loadChildren: () => import('./pages/my-escuestas/my-escuestas.module').then( m => m.MyEscuestasPageModule)
  // },
  {
    path: 'my-encuestas',
    loadChildren: () => import('./pages/my-encuestas/my-encuestas.module').then( m => m.MyEncuestasPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
    , canActivate: [AuthGuard]
  },
  
  {
    path: 'olvido-contrasena',
    loadChildren: () => import('./pages/olvido-contrasena/olvido-contrasena.module').then( m => m.OlvidoContrasenaPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./pages/recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
    , canActivate: [AuthGuard]
  },
 
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
    , canActivate: [AuthGuard]
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
