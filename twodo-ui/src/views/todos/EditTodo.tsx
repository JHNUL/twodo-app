import React, { Fragment } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitType } from "./Todos";
import { TodoStatus } from "../../app/todoSlice";
import styles from "./Todos.module.css";

interface EditTodoProps {
  onCancel: (e: React.SyntheticEvent) => void;
  onSubmit: (e: React.SyntheticEvent, type: SubmitType) => void;
  setTodoName: (name: string) => void;
  setTodoStatus: (status: TodoStatus) => void;
  todoStatus: TodoStatus;
  todoName: string;
  errorText: string;
  isDisabled: boolean;
}

const EditTodo: React.FC<EditTodoProps> = ({
  setTodoName,
  todoName,
  onCancel,
  onSubmit,
  setTodoStatus,
  todoStatus,
  errorText,
  isDisabled,
}) => {
  return (
    <Fragment>
      <DialogTitle>Edit Todo</DialogTitle>
      <DialogContent style={{ paddingTop: "8px" }}>
        <TextField
          id="nameInput"
          label="Todo name"
          error={!!errorText}
          variant="outlined"
          value={todoName}
          onChange={({ target }) => setTodoName(target.value)}
          autoComplete="off"
        />
        <div className={styles.separator} />
        <FormControl>
          <InputLabel id="todoStatus">Status</InputLabel>
          <Select<TodoStatus>
            labelId="todoStatus"
            id="todoStatus"
            error={!!errorText}
            value={todoStatus}
            label="Status"
            onChange={(e) => setTodoStatus(e.target.value as TodoStatus)}
          >
            <MenuItem value={"not started"}>not started</MenuItem>
            <MenuItem value={"in progress"}>in progress</MenuItem>
            <MenuItem value={"done"}>done</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      {!!errorText && (
        <Typography
          variant="caption"
          display="block"
          color={"red"}
          textAlign={"center"}
        >
          {errorText}
        </Typography>
      )}
      <DialogActions>
        <Button variant="contained" onClick={onCancel} disabled={isDisabled}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={(e) => onSubmit(e, "edit")}
          disabled={isDisabled}
        >
          Submit
        </Button>
      </DialogActions>
    </Fragment>
  );
};

export default EditTodo;
