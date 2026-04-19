import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/AuthService';
import { userInfo } from 'os';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  private auth = inject(AuthService);

  user: any
  username : string | null = null;
  role : string | null = null;

  logout(): void {
    this.auth.logout();
  }

  ngOnInit() {
    this.user = this.auth.getUser();
    console.log(this.user);
    this.username  = this.user.username;
    this.role  = this.user.role;
    console.log(this.role);
    console.log(this.username);
  }
}
