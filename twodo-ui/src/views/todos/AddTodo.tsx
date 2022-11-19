import React, { Fragment } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitType } from "./Todos";

interface AddTodoProps {
  onCancel: (e: React.SyntheticEvent) => void;
  onSubmit: (e: React.SyntheticEvent, type: SubmitType) => void;
  setTodoName: (name: string) => void;
  todoName: string;
  errorText: string;
  isDisabled: boolean;
}

const AddTodo: React.FC<AddTodoProps> = ({
  setTodoName,
  todoName,
  onCancel,
  onSubmit,
  errorText,
  isDisabled,
}) => {
  return (
    <Fragment>
      <DialogTitle>Add Todo</DialogTitle>
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
          onClick={(e) => onSubmit(e, "add")}
          disabled={isDisabled}
        >
          Submit
        </Button>
      </DialogActions>
    </Fragment>
  );
};

export default AddTodo;
