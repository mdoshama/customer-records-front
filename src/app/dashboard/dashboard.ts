import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/AuthService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // ← adds *ngIf, *ngFor, async pipe, etc.
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  user: any;
  username: string | null = null;
  role: string | null = null;

  logout(): void {
    this.auth.logout();
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.username = this.user?.username;
    this.role = this.user?.role;
  }

  createUser(): void {
    this.router.navigate(['/create-user']);
  }
}
