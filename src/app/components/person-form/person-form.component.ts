import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Observable, map, of } from 'rxjs';

import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    public dialogRef: MatDialogRef<PersonFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person?: Person }
  ) {
    this.isEditMode = !!data.person;
    this.personForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data.person) {
      this.personForm.patchValue(this.data.person);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', 
        [Validators.required, Validators.minLength(3)],
        [this.nameUniqueValidator.bind(this)]
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  nameUniqueValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const name = control.value?.trim();
    
    if (!name || name.length < 3) {
      return of(null);
    }

    // En mode édition, on exclut la personne courante de la vérification
    const currentPersonId = this.data.person?.id;
    
    return this.personService.getPersons().pipe(
      map(persons => {
        const personWithSameName = persons.find(p => 
          p.name.toLowerCase() === name.toLowerCase() && p.id !== currentPersonId
        );
        return personWithSameName ? { nameNotUnique: true } : null;
      })
    );
  }

  onSave(): void {
    if (this.personForm.valid) {
      this.dialogRef.close(this.personForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.personForm.controls).forEach(key => {
      const control = this.personForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.personForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Ce champ est obligatoire';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères requis`;
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
      if (field.errors['nameNotUnique']) {
        return 'Ce nom est déjà utilisé';
      }
    }
    return '';
  }
}