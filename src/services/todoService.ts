import { supabase } from "../utils/supabase";

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at?: string;
}

interface NewTodo {
  title: string;
  description: string;
  completed: boolean;
}

export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Todo[];
}

export async function createTodo(newTodo: NewTodo): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .insert(newTodo)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Todo;
}

export async function updateTodo(
  id: number,
  updates: Partial<Todo>,
): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Todo;
}

export async function deleteTodo(id: number): Promise<void> {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
