import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { addNewTodo, deleteTodo, editTodo, getTodos } from "./todoAPI";

export type TodoStatus = "not started" | "in progress" | "done";

export interface Todo {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  status: TodoStatus;
}

export interface TodoState {
  data: Array<Todo>;
  status: "idle" | "loading" | "error";
}

const initialTodoState: TodoState = {
  data: [],
  status: "idle",
};

export const addTodoThunk = createAsyncThunk(
  "todos/add",
  async (todoName: string, thunkApi) => {
    const todo = await addNewTodo(todoName);
    thunkApi.dispatch(addTodo(todo));
  }
);

export interface EditTodoParams {
  id: number;
  name: string;
  status: TodoStatus;
}

export const editTodoThunk = createAsyncThunk(
  "todos/edit",
  async (params: EditTodoParams, thunkApi) => {
    const todo = await editTodo(params);
    thunkApi.dispatch(replaceTodo(todo));
  }
);

export const deleteTodoThunk = createAsyncThunk(
  "todos/delete",
  async (id: number, thunkApi) => {
    await deleteTodo(id);
    thunkApi.dispatch(removeTodo({ id }));
  }
);

export const getTodosThunk = createAsyncThunk<
  Promise<void>,
  undefined,
  { state: RootState }
>(
  "todos/get",
  async (_, thunkApi) => {
    const todos = await getTodos();
    thunkApi.dispatch(setAllTodos(todos));
  },
  {
    condition: (_, thunkApi) => {
      const {
        todos: { status },
      } = thunkApi.getState();
      if (status === "loading") {
        return false;
      }
    },
  }
);

export const todoSlice = createSlice({
  name: "todos",
  initialState: initialTodoState,
  reducers: {
    clean: () => {
      return initialTodoState;
    },
    setAllTodos: (state, action: PayloadAction<Array<Todo>>) => {
      state.data = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.data.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<{ id: number }>) => {
      state.data = state.data.filter((t) => t.id !== action.payload.id);
    },
    replaceTodo: (state, action: PayloadAction<Todo>) => {
      state.data.forEach((todo, idx, data) => {
        if (todo.id === action.payload.id) {
          data[idx] = action.payload;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodoThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTodoThunk.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(addTodoThunk.rejected, (state) => {
        state.status = "error";
      })
      .addCase(editTodoThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editTodoThunk.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(editTodoThunk.rejected, (state) => {
        state.status = "error";
      })
      .addCase(getTodosThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTodosThunk.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(getTodosThunk.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { clean, setAllTodos, addTodo, replaceTodo, removeTodo } =
  todoSlice.actions;

export default todoSlice.reducer;
