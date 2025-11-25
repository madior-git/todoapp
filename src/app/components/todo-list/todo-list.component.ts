import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TodoService } from '../../services/todo.service';
import { PersonService } from '../../services/person.service';
import { Todo, Priority, Label } from '../../models/todo.model';
import { Person } from '../../models/person.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['titre', 'person', 'priority', 'labels', 'startDate', 'endDate', 'actions'];
  dataSource = new MatTableDataSource<Todo>();
  loading = true;

  // Filtres
  priorityFilter: string = '';
  labelFilter: string = '';
  persons: Person[] = [];

  constructor(
    private todoService: TodoService,
    private personService: PersonService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTodos();
    this.loadPersons();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.dataSource.data = todos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
        this.loading = false;
      }
    });
  }

  loadPersons(): void {
    this.personService.getPersons().subscribe(persons => {
      this.persons = persons;
    });
  }

  applyFilter(): void {
    this.dataSource.filterPredicate = (data: Todo, filter: string) => {
      const filters = JSON.parse(filter);
      const priorityMatch = !filters.priority || data.priority === filters.priority;
      const labelMatch = !filters.label || data.labels.includes(filters.label as Label);
      return priorityMatch && labelMatch;
    };

    this.dataSource.filter = JSON.stringify({
      priority: this.priorityFilter,
      label: this.labelFilter
    });
  }

  resetFilters(): void {
    this.priorityFilter = '';
    this.labelFilter = '';
    this.applyFilter();
  }

  openTodoForm(todo?: Todo): void {
  this.personService.getPersons().subscribe(persons => {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '600px',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: { 
        todo: todo ? { ...todo } : null, 
        persons: persons 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (todo) {
          this.todoService.updateTodo(todo.id, { ...todo, ...result }).subscribe({
            next: () => this.loadTodos(),
            error: (error) => {
              console.error('Erreur lors de la modification:', error);
              alert('Erreur lors de la modification de la tâche');
            }
          });
        } else {
          this.todoService.createTodo(result).subscribe({
            next: () => this.loadTodos(),
            error: (error) => {
              console.error('Erreur lors de la création:', error);
              alert('Erreur lors de la création de la tâche');
            }
          });
        }
      }
    });
  });
}

  deleteTodo(todo: Todo): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${todo.titre}" ?`)) {
      this.todoService.deleteTodo(todo.id).subscribe({
        next: () => this.loadTodos(),
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la tâche');
        }
      });
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Facile': return 'priority-facile';
      case 'Moyen': return 'priority-moyen';
      case 'Difficile': return 'priority-difficile';
      default: return 'priority-moyen';
    }
  }
}