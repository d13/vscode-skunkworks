export interface Todo {
  label: string;
  done: boolean;
  // description?: string;
  // tags?: string[];
  // dueDate?: Date;
  // createdDate?: Date; - git blame
  // type?: 'TODO' | 'FIXME' | '@todo' | string; - look at various specs and allow for extending via settings
}
