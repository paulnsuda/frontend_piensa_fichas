import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../guards/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 IMPORTANTE
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rol: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.rol = this.auth.getUserRole();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
