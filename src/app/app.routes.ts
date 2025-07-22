import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './guards/auth.service'; // usa el servicio real
import { roleGuard } from './guards/role.guard'; // si usarás protección por roles

// Protege por login
export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Inicio de sesión'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Registro'
  },

  // Ruta principal protegida
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
    title: 'Inicio'
  },

  // Funcionalidades protegidas
  { path: 'crear-grupo', loadComponent: () => import('./pages/fichas/crear-grupo/crear-grupo.component').then(m => m.CrearGrupoComponent), canActivate: [authGuard] },
  { path: 'crear-ingrediente', loadComponent: () => import('./pages/fichas/crear-ingrediente/crear-ingrediente.component').then(m => m.CrearIngredienteComponent), canActivate: [authGuard] },
  { path: 'crear-proveedor', loadComponent: () => import('./pages/fichas/crear-proveedor/crear-proveedor.component').then(m => m.CrearProveedorComponent), canActivate: [authGuard] },
  { path: 'crear-receta', loadComponent: () => import('./pages/fichas/crear-receta/crear-receta.component').then(m => m.CrearRecetaComponent), canActivate: [authGuard] },
  { path: 'crear-ficha', loadComponent: () => import('./pages/fichas/crear-ficha/crear-ficha.component').then(m => m.CrearFichaComponent), canActivate: [authGuard] },
  { path: 'consultar-receta', loadComponent: () => import('./pages/fichas/consultar-receta/consultar-receta.component').then(m => m.ConsultarRecetaComponent), canActivate: [authGuard] },
  { path: 'consultar-fichas', loadComponent: () => import('./pages/fichas/consultar-fichas/consultar-fichas.component').then(m => m.ConsultarFichasComponent), canActivate: [authGuard] },
  { path: 'consultar-ingrediente', loadComponent: () => import('./pages/fichas/consultar-ingrediente/consultar-ingrediente.component').then(m => m.ConsultarIngredienteComponent), canActivate: [authGuard] },

  // Si quieres ruta solo para admin (requiere el roleGuard)
  // {
  //   path: 'admin-panel',
  //   loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
  //   canActivate: [roleGuard('admin')]
  // },

  // Redirecciones
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
