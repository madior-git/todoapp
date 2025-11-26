import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo, Priority, Label } from '../models/todo.model';

// Données mockées pour la production Netlify
const MOCK_TODOS: Todo[] = [
  {
    id: 1,
    titre: 'Développer le composant principal',
    person: { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '0123456789' },
    startDate: new Date('2024-01-15T00:00:00.000Z'),
    endDate: null,
    priority: Priority.MEDIUM,
    labels: [Label.HTML, Label.CSS],
    description: 'Créer le composant principal de l\'application avec Angular Material',
    completed: false
  },
  {
    id: 2,
    titre: 'Implémenter la validation des formulaires',
    person: { id: 2, name: 'Marie Martin', email: 'marie.martin@email.com', phone: '0987654321' },
    startDate: new Date('2024-01-16T00:00:00.000Z'),
    endDate: null,
    priority: Priority.HARD,
    labels: [Label.NODE_JS],
    description: 'Ajouter la validation reactive forms avec messages d\'erreur',
    completed: false
  },
  {
    id: 3,
    titre: 'Créer les services HTTP',
    person: { id: 3, name: 'Pierre Lambert', email: 'pierre.lambert@email.com', phone: '0654321987' },
    startDate: new Date('2024-01-17T00:00:00.000Z'),
    endDate: null,
    priority: Priority.EASY,
    labels: [Label.HTML, Label.JQUERY],
    description: 'Développer les services pour communiquer avec l\'API',
    completed: false
  },
  {
    id: 4,
    titre: 'Configurer le routing Angular',
    person: { id: 4, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', phone: '0678912345' },
    startDate: new Date('2024-01-18T00:00:00.000Z'),
    endDate: new Date('2024-01-20T00:00:00.000Z'),
    priority: Priority.MEDIUM,
    labels: [Label.CSS, Label.JQUERY],
    description: 'Mettre en place le système de routing Angular',
    completed: true
  },
  {
    id: 5,
    titre: 'Tests unitaires',
    person: { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '0123456789' },
    startDate: new Date('2024-01-19T00:00:00.000Z'),
    endDate: null,
    priority: Priority.HARD,
    labels: [Label.NODE_JS],
    description: 'Écrire les tests unitaires pour les services et composants',
    completed: false
  }
];

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) {}

 getTodos(): Observable<Todo[]> {
  // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
  console.log('✅ FORCAGE DES DONNÉES MOCKÉES - TODOS');
  return of(MOCK_TODOS);
}

getTodo(id: number): Observable<Todo> {
  // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
  console.log('✅ FORCAGE DES DONNÉES MOCKÉES - TODO ' + id);
  const todo = MOCK_TODOS.find(t => t.id === id);
  return of(todo!);
}

createTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
  // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
  console.log('✅ FORCAGE CRÉATION MOCKÉE - TODO');
  const newTodo = {
    ...todo,
    id: Math.max(...MOCK_TODOS.map(t => t.id)) + 1
  } as Todo;
  MOCK_TODOS.push(newTodo);
  return of(newTodo);
}

updateTodo(id: number, todo: Todo): Observable<Todo> {
  // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
  console.log('✅ FORCAGE MISE À JOUR MOCKÉE - TODO ' + id);
  const index = MOCK_TODOS.findIndex(t => t.id === id);
  if (index !== -1) {
    MOCK_TODOS[index] = todo;
  }
  return of(todo);
}

deleteTodo(id: number): Observable<void> {
  // ⚠️ TEMPORAIREMENT : TOUJOURS utiliser les mocks
  console.log('✅ FORCAGE SUPPRESSION MOCKÉE - TODO ' + id);
  const index = MOCK_TODOS.findIndex(t => t.id === id);
  if (index !== -1) {
    MOCK_TODOS.splice(index, 1);
  }
  return of(void 0);
}
}