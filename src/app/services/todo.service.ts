import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo, Priority, Label } from '../models/todo.model';

// Données mockées initiales
const INITIAL_TODOS: Todo[] = [
  {
    id: 1,
    titre: 'Développer le composant principal',
    person: { id: 1, name: 'Madior', email: 'madior@email.com', phone: '776565657' },
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
    person: { id: 2, name: 'Modou', email: 'modou@email.com', phone: '0987654321' },
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
    person: { id: 3, name: 'Moussa', email: 'moussa@email.com', phone: '0654321987' },
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
    person: { id: 4, name: 'Sophie', email: 'sophie@email.com', phone: '0678912345' },
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
    person: { id: 1, name: 'Madior', email: 'madior@email.com', phone: '776565657' },
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
  private readonly STORAGE_KEY = 'todo_app_todos';

  constructor(private http: HttpClient) {}

  // Récupère les todos du LocalStorage ou les données initiales
  private getTodosFromStorage(): Todo[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const todos = JSON.parse(stored);
      // Convertir les dates string en objets Date
      return todos.map((todo: any) => ({
        ...todo,
        startDate: todo.startDate ? new Date(todo.startDate) : null,
        endDate: todo.endDate ? new Date(todo.endDate) : null
      }));
    }
    // Première fois : sauvegarder les données initiales
    this.saveTodosToStorage(INITIAL_TODOS);
    return INITIAL_TODOS;
  }

  // Sauvegarde les todos dans le LocalStorage
  private saveTodosToStorage(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }

  getTodos(): Observable<Todo[]> {
    console.log('✅ CHARGEMENT TODOS DEPUIS LOCALSTORAGE');
    const todos = this.getTodosFromStorage();
    return of(todos);
  }

  getTodo(id: number): Observable<Todo> {
    console.log('✅ RECHERCHE TODO ' + id + ' DANS LOCALSTORAGE');
    const todos = this.getTodosFromStorage();
    const todo = todos.find(t => t.id === id);
    return of(todo!);
  }

  createTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    console.log('✅ CRÉATION TODO AVEC LOCALSTORAGE');
    const todos = this.getTodosFromStorage();
    const newTodo = {
      ...todo,
      id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1
    } as Todo;
    
    todos.push(newTodo);
    this.saveTodosToStorage(todos);
    return of(newTodo);
  }

  updateTodo(id: number, todo: Todo): Observable<Todo> {
    console.log('✅ MISE À JOUR TODO ' + id + ' DANS LOCALSTORAGE');
    const todos = this.getTodosFromStorage();
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos[index] = todo;
      this.saveTodosToStorage(todos);
    }
    return of(todo);
  }

  deleteTodo(id: number): Observable<void> {
    console.log('✅ SUPPRESSION TODO ' + id + ' DANS LOCALSTORAGE');
    const todos = this.getTodosFromStorage();
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      this.saveTodosToStorage(todos);
    }
    return of(void 0);
  }
}