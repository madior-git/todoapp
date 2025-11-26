import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Person } from '../models/person.model';

const MOCK_PERSONS: Person[] = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '0123456789' },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@email.com', phone: '0987654321' },
  { id: 3, name: 'Pierre Lambert', email: 'pierre.lambert@email.com', phone: '0654321987' },
  { id: 4, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', phone: '0678912345' }
];

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) {}

  getPersons(): Observable<Person[]> {
    if (environment.production) {
      return of(MOCK_PERSONS);
    }
    return this.http.get<Person[]>(`${environment.apiUrl}/persons`);
  }

  getPerson(id: number): Observable<Person> {
    if (environment.production) {
      const person = MOCK_PERSONS.find(p => p.id === id);
      return of(person!);
    }
    return this.http.get<Person>(`${environment.apiUrl}/persons/${id}`);
  }

  createPerson(person: Omit<Person, 'id'>): Observable<Person> {
    if (environment.production) {
      const newPerson = {
        ...person,
        id: Math.max(...MOCK_PERSONS.map(p => p.id)) + 1
      } as Person;
      MOCK_PERSONS.push(newPerson);
      return of(newPerson);
    }
    return this.http.post<Person>(`${environment.apiUrl}/persons`, person);
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    if (environment.production) {
      const index = MOCK_PERSONS.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PERSONS[index] = person;
      }
      return of(person);
    }
    return this.http.put<Person>(`${environment.apiUrl}/persons/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    if (environment.production) {
      const index = MOCK_PERSONS.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PERSONS.splice(index, 1);
      }
      return of(void 0);
    }
    return this.http.delete<void>(`${environment.apiUrl}/persons/${id}`);
  }

  checkNameUnique(name: string): Observable<boolean> {
    if (environment.production) {
      const exists = MOCK_PERSONS.some(p => p.name.toLowerCase() === name.toLowerCase());
      return of(!exists);
    }
    return this.http.get<Person[]>(`${environment.apiUrl}/persons?name=${name}`).pipe(
      map(persons => persons.length === 0)
    );
  }
}