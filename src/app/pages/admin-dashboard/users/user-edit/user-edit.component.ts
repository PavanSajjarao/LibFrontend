import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userForm!: FormGroup;
  roles: string[] = ['admin', 'moderator', 'user'];
  userId!: string;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    // Initialize form with FormArray
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: this.fb.array([])  // Ensure roles array is initialized
    });

    console.log("🚀 Component Initialized: User ID:", this.userId);
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user: User) => {
        console.log("🛠 User Data from API:", user);
        console.log("🔹 User Roles from API:", user.role);

        // Patch name and email first
        this.userForm.patchValue({
          name: user.name,
          email: user.email
        });

        // Ensure FormArray is cleared before adding new controls
        const rolesArray = this.rolesFormArray;
        rolesArray.clear();

        // Add roles as FormControls with correct values
        this.roles.forEach(role => {
          const isChecked = user.role.includes(role);
          console.log(`✅ Setting ${role} to`, isChecked);
          rolesArray.push(new FormControl<boolean>(isChecked, { nonNullable: true }));
        });

        console.log("✅ Roles after loading:", this.rolesFormArray.value);
      },
      error: (err) => {
        console.error('❌ Error fetching user data:', err);
        this.errorMessage = 'Failed to load user data. Please try again.';
      }
    });
  }

  get rolesFormArray(): FormArray<FormControl<boolean>> {
    return this.userForm.get('roles') as FormArray<FormControl<boolean>>;
  }

  onRoleChange(index: number, value: boolean) {
    console.log(`🔄 Role ${this.roles[index]} changed to:`, value);
    
    // Ensure FormArray updates properly
    this.rolesFormArray.at(index).setValue(value);
    this.userForm.markAsDirty(); // Mark form as modified
    this.userForm.updateValueAndValidity(); // Ensure changes are applied
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      console.warn("⚠️ Form is invalid. Fix errors before submitting.");
      return;
    }

    console.log("📊 Roles Before Filtering:", this.rolesFormArray.value);

    // Extract selected roles
    const selectedRoles = this.roles
      .map((role, index) => (this.rolesFormArray.at(index).value ? role : null))
      .filter(role => role !== null); // Remove null values

    console.log("🔎 Selected Roles Before Submission:", selectedRoles);

    if (selectedRoles.length === 0) {
      this.errorMessage = "⚠️ At least one role must be selected.";
      return;
    }

    const updatedUserData: Partial<User> = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      role: selectedRoles // API expects "role" field
    };

    console.log("🚀 Final Data to Submit:", updatedUserData);

    this.userService.updateUser(this.userId, updatedUserData).subscribe({
      next: () => {
        console.log("✅ User successfully updated!");
        this.router.navigate(['/admin-dashboard/users']);
      },
      error: (err) => {
        console.error('❌ Error updating user:', err);
        this.errorMessage = 'Error updating user. Please try again.';
      }
    });
  }
}
