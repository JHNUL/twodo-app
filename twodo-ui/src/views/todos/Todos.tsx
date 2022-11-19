import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Dialog, Fab } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../../app/appSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import {
  addTodoThunk,
  editTodoThunk,
  getTodosThunk,
  Todo,
  TodoStatus,
} from "../../app/todoSlice";
import AddTodo from "./AddTodo";
import EditTodo from "./EditTodo";
import styles from "./Todos.module.css";

export type SubmitType = "edit" | "add";

const Todos: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [todoName, setTodoName] = useState<string>("");
  const [todoStatus, setTodoStatus] = useState<TodoStatus>("not started");
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const todosFromState = useAppSelector((state: RootState) => state.todos.data);
  const fetchStatus = useSelector((state: RootState) => state.todos.status);

  useEffect(() => {
    const fetchAllTodos = async () => {
      try {
        await dispatch(getTodosThunk()).unwrap()
      } catch (error: any) {
        console.error(error)
        if (error?.code === '401') {
          navigate("/login");
        }
      }
    }
    fetchAllTodos()
  }, []) // eslint-disable-line

  const onAddTodo = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!modalOpen) {
      setModalOpen(true);
    }
  };

  const closeAndSetInitialValues = () => {
    if (modalOpen) setModalOpen(false);
    if (editModalOpen) setEditModalOpen(false);
    setTodoName("");
    setTodoStatus("not started");
    setEditedTodoId(null);
    setErrorMessage("");
  };

  const onCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    closeAndSetInitialValues();
  };

  const onSubmit = async (e: React.SyntheticEvent, type: SubmitType) => {
    e.preventDefault();
    try {
      if (type === "add") {
        await dispatch(addTodoThunk(todoName)).unwrap();
      } else if (type === "edit" && editedTodoId !== null) {
        await dispatch(
          editTodoThunk({
            id: editedTodoId,
            name: todoName,
            status: todoStatus,
          })
        ).unwrap();
      }
      closeAndSetInitialValues();
    } catch (error: any) {
      if (error?.code === '401') {
        navigate("/login");
      }
      setErrorMessage(error.message || "An error happened");
    }
  };

  const editTodo = (id: number) => {
    const todoToEdit = todosFromState.find((todo) => todo.id === id);
    setTodoName(todoToEdit?.name || "");
    setEditedTodoId(id);
    setEditModalOpen(true);
  };

  const onLogout = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await dispatch(logoutThunk()).unwrap()
      navigate("/login");
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.todoTableContainer}>
      <div className={styles.logoutButtonContainer}>
        <Button variant="contained" onClick={onLogout}>
          Logout
        </Button>
      </div>
      <div className={styles.todoAddIconContainer}>
        <Fab color="primary" size="small" aria-label="add" onClick={onAddTodo}>
          <AddIcon />
        </Fab>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Task</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Created</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todosFromState.map((row: Todo) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.status}</TableCell>
                <TableCell align="left">
                  {new Date(row.created_at).toLocaleString()}
                </TableCell>
                <TableCell align="left">
                  <Button
                    color="primary"
                    size="small"
                    aria-label="edit"
                    onClick={() => editTodo(row.id)}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={modalOpen} onClose={closeAndSetInitialValues}>
        <AddTodo
          setTodoName={setTodoName}
          todoName={todoName}
          onCancel={onCancel}
          onSubmit={onSubmit}
          isDisabled={fetchStatus === "loading"}
          errorText={errorMessage}
        />
      </Dialog>
      <Dialog open={editModalOpen} onClose={closeAndSetInitialValues}>
        <EditTodo
          setTodoName={setTodoName}
          todoName={todoName}
          onCancel={onCancel}
          onSubmit={onSubmit}
          isDisabled={fetchStatus === "loading"}
          setTodoStatus={setTodoStatus}
          todoStatus={todoStatus}
          errorText={errorMessage}
        />
      </Dialog>
    </div>
  );
};

export default Todos;
