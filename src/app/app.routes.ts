import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './guards/auth.service';

/**
 * Guard funcional para proteger las rutas.
 * Verifica si el usuario tiene un token válido antes de permitir el acceso.
 */
export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Si está logueado permite el paso, de lo contrario redirige a login.
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};

export const routes: Routes = [
  // ======================================
  // RUTAS PÚBLICAS
  // ======================================
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Registro'
  },

  // ======================================
  // RUTAS PROTEGIDAS (LAYOUT PRINCIPAL)
  // ======================================
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard], // Protege todas las rutas hijas.
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Inicio'
      },
      {
        path: 'ingredientes',
        loadComponent: () => import('./pages/ingredientes/ingredientes.component').then(m => m.IngredientesComponent),
        title: 'Ingredientes'
      },
      {
        path: 'recetas',
        loadComponent: () => import('./pages/recetas/recetas.component').then(m => m.RecetasComponent),
        title: 'Crear Receta'
      },
      {
        path: 'recetas/editar/:id',
        loadComponent: () => import('./pages/recetas/recetas.component').then(m => m.RecetasComponent),
        title: 'Editar Receta'
      },
      {
        path: 'ver-ficha/:id',
        loadComponent: () => import('./pages/ver-ficha/ver-ficha.component').then(m => m.VerFichaComponent),
        title: 'Ficha Técnica'
      },
      {
        path: 'listar-recetas',
        loadComponent: () => import('./pages/listar/listar-recetas.component').then(m => m.ListarRecetasComponent),
        title: 'Listar Recetas'
      },
      {
        path: 'compras',
        loadComponent: () => import('./pages/compras/compras.component').then(m => m.ComprasComponent),
        title: 'Compras'
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./pages/proveedores/proveedores.component').then(m => m.ProveedoresComponent),
        title: 'Proveedores'
      }
    ]
  },

  // ======================================
  // MANEJO DE RUTAS NO ENCONTRADAS / REFRESH
  // ======================================
  /**
   * Captura cualquier ruta no definida (comodín '**').
   * Al refrescar la página en producción, redirige automáticamente al Home.
   */
  { path: '**', redirectTo: 'home' }
];