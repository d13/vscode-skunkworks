import type { Todo } from '../../../todos/models';
import { IpcCall } from '../protocol';

export const namespace = 'todos';

export interface BootstrapState {
  [namespace]: TodoState;
}

export interface TodoState {
  todos: Todo[];
}

export const AllTodosNotification = new IpcCall<TodoState>(namespace, 'get/all');
