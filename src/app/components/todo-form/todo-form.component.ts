import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { map, startWith } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Todo, Priority, Label } from '../../models/todo.model';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatOptionModule
  ],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {
  todoForm: FormGroup;
  
  // Utiliser les valeurs des enums pour les sélecteurs
  priorities = [
    { value: Priority.EASY, label: 'Facile' },
    { value: Priority.MEDIUM, label: 'Moyen' },
    { value: Priority.HARD, label: 'Difficile' }
  ];
  
  labels = [
    { value: Label.HTML, label: 'HTML' },
    { value: Label.CSS, label: 'CSS' },
    { value: Label.NODE_JS, label: 'NODE JS' },
    { value: Label.JQUERY, label: 'JQUERY' }
  ];
  
  persons: Person[] = [];
  filteredPersons: Observable<Person[]> = of([]);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TodoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todo?: Todo; persons: Person[] }
  ) {
    this.todoForm = this.createForm();
    this.persons = data.persons;
  }

  ngOnInit(): void {
    this.filteredPersons = this.todoForm.get('person')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterPersons(name as string) : this.persons.slice();
      })
    );

    if (this.data.todo) {
      // S'assurer que les dates sont correctement formatées
      const todoData = {
        ...this.data.todo,
        person: this.data.todo.person,
        startDate: new Date(this.data.todo.startDate),
        endDate: this.data.todo.endDate ? new Date(this.data.todo.endDate) : null
      };
      this.todoForm.patchValue(todoData);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      person: [null, Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [null],
      priority: [Priority.MEDIUM, Validators.required],
      labels: [[]],
      description: [''],
      completed: [false]
    });
  }

  private _filterPersons(name: string): Person[] {
    const filterValue = name.toLowerCase();
    return this.persons.filter(person => 
      person.name.toLowerCase().includes(filterValue) ||
      person.email.toLowerCase().includes(filterValue)
    );
  }

  displayPerson(person: Person): string {
    return person ? `${person.name} (${person.email})` : '';
  }

  onLabelChange(label: Label, event: any): void {
    const labels = this.todoForm.get('labels')?.value || [];
    if (event.checked) {
      if (!labels.includes(label)) {
        labels.push(label);
      }
    } else {
      const index = labels.indexOf(label);
      if (index >= 0) {
        labels.splice(index, 1);
      }
    }
    this.todoForm.patchValue({ labels });
  }

  // Méthode utilitaire pour vérifier si un label est coché
  isLabelChecked(label: Label): boolean {
    const labels = this.todoForm.get('labels')?.value || [];
    return labels.includes(label);
  }

  onSave(): void {
    if (this.todoForm.valid) {
      // Préparer les données pour l'envoi
      const formValue = this.todoForm.value;
      
      // S'assurer que les dates sont au bon format
      const todoData = {
        ...formValue,
        startDate: formValue.startDate,
        endDate: formValue.endDate
      };
      
      this.dialogRef.close(todoData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.todoForm.controls).forEach(key => {
      const control = this.todoForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.todoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Ce champ est obligatoire';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères requis`;
      }
    }
    return '';
  }

  // Méthode pour obtenir le libellé d'une priorité
  getPriorityLabel(priority: Priority): string {
    switch (priority) {
      case Priority.EASY: return 'Facile';
      case Priority.MEDIUM: return 'Moyen';
      case Priority.HARD: return 'Difficile';
      default: return priority;
    }
  }
}