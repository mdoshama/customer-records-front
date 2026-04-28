import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from './UserService';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  form = {
    name: '',
    username: '',
    password: '',
    role: '',
  };

  users: any[] = [];
  loading = false;
  editMode = false;
  editUserId: number | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users.at(1));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.invalid) return;

    if (this.editMode && this.editUserId !== null) {
      this.userService.updateUser(this.editUserId, this.form).subscribe({
        next: () => {
          this.resetForm(userForm);
          this.loadUsers();
        },
        error: (err) => console.error('Failed to update user:', err),
      });
    } else {
      this.userService.createUser(this.form).subscribe({
        next: () => {
          this.resetForm(userForm);
          this.loadUsers();
        },
        error: (err) => console.error('Failed to create user:', err),
      });
    }
  }

  editUser(user: any): void {
    this.editMode = true;
    this.editUserId = user.id;
    this.form = {
      name: user.name,
      username: user.username,
      password: '',
      role: user.role,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to delete user:', err),
    });
  }

  cancelForm(userForm: NgForm): void {
    this.resetForm(userForm);
    this.router.navigate(['/dashboard']);
  }

  private resetForm(userForm: NgForm): void {
    this.editMode = false;
    this.editUserId = null;
    this.form = { name: '', username: '', password: '', role: '' };

    // Remove userForm.resetForm() — replace with this:
    setTimeout(() => userForm.resetForm(this.form));
  }
}
