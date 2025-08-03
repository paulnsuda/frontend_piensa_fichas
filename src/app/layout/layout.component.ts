import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../guards/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  rol: string | null = null;

  constructor(private auth: AuthService) {
    this.rol = auth.getUserRole();

  }

  logout() {
    this.auth.logout();
  }
}
