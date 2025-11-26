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

import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';
import { PersonFormComponent } from '../person-form/person-form.component';
import { ExportService } from '../../services/export.service'; 

@Component({
  selector: 'app-person-list',
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
    MatInputModule
  ],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Person>();
  loading = true;

  constructor(
    private personService: PersonService,
    private dialog: MatDialog,
    private exportService: ExportService

  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPersons(): void {
    this.loading = true;
    this.personService.getPersons().subscribe({
      next: (persons) => {
        this.dataSource.data = persons;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des personnes:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openPersonForm(person?: Person): void {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      width: '500px',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: { person: person ? { ...person } : null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (person) {
          // Édition
          this.personService.updatePerson(person.id, { ...person, ...result }).subscribe({
            next: () => this.loadPersons(),
            error: (error) => {
              console.error('Erreur lors de la modification:', error);
              alert('Erreur lors de la modification de la personne');
            }
          });
        } else {
          // Création
          this.personService.createPerson(result).subscribe({
            next: () => this.loadPersons(),
            error: (error) => {
              console.error('Erreur lors de la création:', error);
              alert('Erreur lors de la création de la personne');
            }
          });
        }
      }
    });
  }

  deletePerson(person: Person): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${person.name}" ?`)) {
      this.personService.deletePerson(person.id).subscribe({
        next: () => this.loadPersons(),
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la personne');
        }
      });
    }
  }

  exportToExcel(): void {
    const dataToExport = this.dataSource.filteredData.length > 0 ? 
      this.dataSource.filteredData : this.dataSource.data;
    
    const filename = this.dataSource.filteredData.length !== this.dataSource.data.length ? 
      'personnes_filtrees' : 'personnes_completes';
    
    this.exportService.exportPersonsToExcel(dataToExport, filename);
  }

  exportToPDF(): void {
    const dataToExport = this.dataSource.filteredData.length > 0 ? 
      this.dataSource.filteredData : this.dataSource.data;
    
    const filename = this.dataSource.filteredData.length !== this.dataSource.data.length ? 
      'personnes_filtrees' : 'personnes_completes';
    
    this.exportService.exportPersonsToPDF(dataToExport, filename);
  }
}