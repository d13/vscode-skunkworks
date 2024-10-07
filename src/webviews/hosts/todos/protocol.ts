import type { Todo } from '../../../todos/models';

export const namespace = 'todos';

export interface BootstrapState {
  [namespace]: TodoState;
}

export interface TodoState {
  todos: Todo[];
}
