import type { Todo } from '../../../todos/models';
import { IpcCall } from '../protocol';

export const namespace = 'todos';

export interface BootstrapState {
  [namespace]: TodoState;
}

export interface TodoState {
  todos: Todo[];
}

export const AllTodosRequest = new IpcCall<undefined>(namespace, 'todos/all');

export const AllTodosResponse = new IpcCall<TodoState>(namespace, 'todos/all/response');
