import { Person } from './person.model';

export enum Priority {
  EASY = 'Facile',
  MEDIUM = 'Moyen',
  HARD = 'Difficile'
}

export enum Label {
  HTML = 'HTML',
  CSS = 'CSS',
  NODE_JS = 'NODE JS',
  JQUERY = 'JQUERY'
}

export interface Todo {
  id: number;
  titre: string;
  person: Person;
  startDate: Date;
  endDate: Date | null;
  priority: Priority;
  labels: Label[];
  favoris: boolean;
  description: string;
  completed: boolean;
}