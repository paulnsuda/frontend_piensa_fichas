import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './guards/auth.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};

export const routes: Routes = [
  // Públicas
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

  // Protegidas
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
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
        path: 'fichas',
        loadComponent: () => import('./pages/fichas/fichas.component').then(m => m.FichasComponent),
        title: 'Fichas'
      },
      {
        path: 'recetas',
        loadComponent: () => import('./pages/recetas/recetas.component').then(m => m.RecetasComponent),
        title: 'Recetas'
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
      },
      {
        path: 'listar-recetas',
        loadComponent: () =>
          import('./pages/listar/listar-recetas.component').then(m => m.ListarRecetasComponent),
        title: 'Listar Recetas'
      },
      {
        path: 'consultar-receta/:id',
        loadComponent: () =>
          import('./pages/recetas/consultar/consultar-receta.component').then(m => m.ConsultarRecetaComponent),
        title: 'Ficha Técnica'
      }
    ]
  },

  // Redirección
  { path: '**', redirectTo: 'login' }
];
