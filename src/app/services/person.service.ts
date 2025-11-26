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
    // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
    console.log('✅ FORCAGE DES DONNÉES MOCKÉES - PERSONS');
    return of(MOCK_PERSONS);
  }

  getPerson(id: number): Observable<Person> {
    // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
    console.log('✅ FORCAGE DES DONNÉES MOCKÉES - PERSON ' + id);
    const person = MOCK_PERSONS.find(p => p.id === id);
    return of(person!);
  }

  createPerson(person: Omit<Person, 'id'>): Observable<Person> {
    // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
    console.log('✅ FORCAGE CRÉATION MOCKÉE - PERSON');
    const newPerson = {
      ...person,
      id: Math.max(...MOCK_PERSONS.map(p => p.id)) + 1
    } as Person;
    MOCK_PERSONS.push(newPerson);
    return of(newPerson);
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
    console.log('✅ FORCAGE MISE À JOUR MOCKÉE - PERSON ' + id);
    const index = MOCK_PERSONS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PERSONS[index] = person;
    }
    return of(person);
  }

  deletePerson(id: number): Observable<void> {
    // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
    console.log('✅ FORCAGE SUPPRESSION MOCKÉE - PERSON ' + id);
    const index = MOCK_PERSONS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PERSONS.splice(index, 1);
    }
    return of(void 0);
  }

  checkNameUnique(name: string): Observable<boolean> {
    // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
    console.log('✅ FORCAGE VÉRIFICATION NOM MOCKÉE');
    const exists = MOCK_PERSONS.some(p => p.name.toLowerCase() === name.toLowerCase());
    return of(!exists);
  }
}