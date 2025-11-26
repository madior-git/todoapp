import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Person } from '../models/person.model';

const INITIAL_PERSONS: Person[] = [
  { id: 1, name: 'Madior', email: 'madior@email.com', phone: '776565657' },
  { id: 2, name: 'Modou', email: 'modou@email.com', phone: '0987654321' },
  { id: 3, name: 'Moussa', email: 'moussa@email.com', phone: '0654321987' },
  { id: 4, name: 'Sophie', email: 'sophie@email.com', phone: '0678912345' }
];

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly STORAGE_KEY = 'todo_app_persons';

  constructor(private http: HttpClient) {}

  private getPersonsFromStorage(): Person[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    this.savePersonsToStorage(INITIAL_PERSONS);
    return INITIAL_PERSONS;
  }

  private savePersonsToStorage(persons: Person[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(persons));
  }

  getPersons(): Observable<Person[]> {
    console.log('✅ CHARGEMENT PERSONS DEPUIS LOCALSTORAGE');
    const persons = this.getPersonsFromStorage();
    return of(persons);
  }

  getPerson(id: number): Observable<Person> {
    console.log('✅ RECHERCHE PERSON ' + id + ' DANS LOCALSTORAGE');
    const persons = this.getPersonsFromStorage();
    const person = persons.find(p => p.id === id);
    return of(person!);
  }

  createPerson(person: Omit<Person, 'id'>): Observable<Person> {
    console.log('✅ CRÉATION PERSON AVEC LOCALSTORAGE');
    const persons = this.getPersonsFromStorage();
    const newPerson = {
      ...person,
      id: persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1
    } as Person;
    
    persons.push(newPerson);
    this.savePersonsToStorage(persons);
    return of(newPerson);
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    console.log('✅ MISE À JOUR PERSON ' + id + ' DANS LOCALSTORAGE');
    const persons = this.getPersonsFromStorage();
    const index = persons.findIndex(p => p.id === id);
    if (index !== -1) {
      persons[index] = person;
      this.savePersonsToStorage(persons);
    }
    return of(person);
  }

  deletePerson(id: number): Observable<void> {
    console.log('✅ SUPPRESSION PERSON ' + id + ' DANS LOCALSTORAGE');
    const persons = this.getPersonsFromStorage();
    const index = persons.findIndex(p => p.id === id);
    if (index !== -1) {
      persons.splice(index, 1);
      this.savePersonsToStorage(persons);
    }
    return of(void 0);
  }

  checkNameUnique(name: string): Observable<boolean> {
    console.log('✅ VÉRIFICATION NOM UNIQUE DANS LOCALSTORAGE');
    const persons = this.getPersonsFromStorage();
    const exists = persons.some(p => p.name.toLowerCase() === name.toLowerCase());
    return of(!exists);
  }
}