import { EditTodoParams, Todo } from "./todoSlice";

const getHeaders = () => {
  const requestHeaders = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Accept", "application/json");
  return requestHeaders;
};

const checkResponse = async (res: Response) => {
  if (!res.ok) {
    const errorResponse = await res.json();
    return Promise.reject({
      message: errorResponse?.message,
      code: res.status.toString(),
    });
  }
};

export const addNewTodo = async (name: string): Promise<Todo> => {
  const res = await fetch("/api/todo", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name }),
  });
  await checkResponse(res);
  return res.json();
};

export const editTodo = async ({
  id,
  name,
  status,
}: EditTodoParams): Promise<Todo> => {
  const res = await fetch("/api/todo", {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ name, id, status }),
  });
  await checkResponse(res);
  return res.json();
};

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch("/api/todo", { headers: getHeaders() });
  await checkResponse(res);
  return res.json();
};
