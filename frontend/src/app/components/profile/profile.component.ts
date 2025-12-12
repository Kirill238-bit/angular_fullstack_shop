import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User, ProfileData } from '../../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  loading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone || '',
          address: user.address || ''
        });
        this.profileForm.disable();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.snackBar.open('Ошибка загрузки профиля', 'Закрыть', { duration: 3000 });
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.profileForm.patchValue({
        firstName: this.currentUser?.first_name,
        lastName: this.currentUser?.last_name,
        phone: this.currentUser?.phone || '',
        address: this.currentUser?.address || ''
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;

      const profileData: ProfileData = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        phone: this.profileForm.value.phone,
        address: this.profileForm.value.address
      };

      this.authService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.loading = false;
          this.isEditing = false;
          this.profileForm.disable();
          this.currentUser = response.user;
          this.snackBar.open('Профиль успешно обновлен', 'Закрыть', { duration: 3000 });
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating profile:', error);
          this.snackBar.open('Ошибка обновления профиля', 'Закрыть', { duration: 3000 });
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.disable();
    this.profileForm.patchValue({
      firstName: this.currentUser?.first_name,
      lastName: this.currentUser?.last_name,
      phone: this.currentUser?.phone || '',
      address: this.currentUser?.address || ''
    });
  }
}
