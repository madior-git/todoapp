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
import { ExportService } from '../../services/export.service'; 

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

  displayedColumns: string[] = ['titre', 'person', 'priority', 'labels', 'startDate', 'endDate', 'favoris','actions'];
  dataSource = new MatTableDataSource<Todo>();
  loading = true;

  // Filtres - utiliser les valeurs string des enums
  
  priorityFilter: string = '';
  labelFilter: string = '';
  favorisFilter: string = '';
  persons: Person[] = [];

  // Options pour les filtres
  priorityOptions = [
    { value: '', label: 'Toutes les priorités' },
    { value: Priority.EASY, label: 'Facile' },
    { value: Priority.MEDIUM, label: 'Moyen' },
    { value: Priority.HARD, label: 'Difficile' }
  ];

  labelOptions = [
    { value: '', label: 'Toutes les technologies' },
    { value: Label.HTML, label: 'HTML' },
    { value: Label.CSS, label: 'CSS' },
    { value: Label.NODE_JS, label: 'NODE JS' },
    { value: Label.JQUERY, label: 'JQUERY' }
  ];
   favorisOptions = [
    { value: '', label: 'Toutes les tâches' },
    { value: 'true', label: 'Favoris seulement' },
    { value: 'false', label: 'Non favoris' }
  ];

  constructor(
    private todoService: TodoService,
    private personService: PersonService,
    private dialog: MatDialog,
    private exportService: ExportService
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
      
      // Filtre par priorité
      const priorityMatch = !filters.priority || data.priority === filters.priority;
      
      // Filtre par label
      let labelMatch = true;
      if (filters.label) {
        // Convertir la valeur string du filtre en enum Label
        const labelValue = filters.label as string;
        labelMatch = data.labels.some(label => label === labelValue);
      }

      let favorisMatch = true;
      if (filters.favoris !== '') {
        // Convertir la string en boolean
        const isFavoris = filters.favoris === 'true';
        favorisMatch = data.favoris === isFavoris;
      }
      
      
      return priorityMatch && labelMatch && favorisMatch;;
    };

    this.dataSource.filter = JSON.stringify({
      priority: this.priorityFilter,
      label: this.labelFilter,
      favoris: this.favorisFilter
    });
  }

  resetFilters(): void {
    this.priorityFilter = '';
    this.labelFilter = '';
    this.favorisFilter = '';
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

  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case Priority.EASY: return 'priority-facile';
      case Priority.MEDIUM: return 'priority-moyen';
      case Priority.HARD: return 'priority-difficile';
      default: return 'priority-moyen';
    }
  }

  getPriorityDisplay(priority: Priority): string {
    switch (priority) {
      case Priority.EASY: return 'Facile';
      case Priority.MEDIUM: return 'Moyen';
      case Priority.HARD: return 'Difficile';
      default: return priority;
    }
  }

  getLabelDisplay(label: Label): string {
    return label; // Les labels sont déjà des strings lisibles
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  exportToExcel(): void {
    const dataToExport = this.dataSource.filteredData.length > 0 ? 
      this.dataSource.filteredData : this.dataSource.data;
    
    const filename = this.dataSource.filteredData.length !== this.dataSource.data.length ? 
      'todos_filtres' : 'todos_complets';
    
    this.exportService.exportToExcel(dataToExport, filename);
  }

  exportToPDF(): void {
    const dataToExport = this.dataSource.filteredData.length > 0 ? 
      this.dataSource.filteredData : this.dataSource.data;
    
    const filename = this.dataSource.filteredData.length !== this.dataSource.data.length ? 
      'todos_filtres' : 'todos_complets';
    
    this.exportService.exportToPDF(dataToExport, filename);
  }

  toggleFavorite(todo: Todo): void {
  // Empêcher la propagation de l'événement
  event?.stopPropagation();
  
  const updatedTodo = { ...todo, favoris: !todo.favoris };
  
  this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
    next: () => {
      console.log(`Tâche "${todo.titre}" ${updatedTodo.favoris ? 'ajoutée aux' : 'retirée des'} favoris`);
      this.loadTodos(); // Recharger la liste pour voir les changements
    },
    error: (error) => {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      alert('Erreur lors de la modification des favoris');
    }
  });
}
}