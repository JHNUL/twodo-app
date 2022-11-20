import { Button, DialogActions, DialogTitle, Typography } from "@mui/material";
import React, { Fragment } from "react";
import { SubmitType } from "./Todos";

interface DeleteTodoProps {
  onCancel: (e: React.SyntheticEvent) => void;
  onSubmit: (e: React.SyntheticEvent, type: SubmitType) => void;
  errorText: string;
  isDisabled: boolean;
}

const DeleteTodo: React.FC<DeleteTodoProps> = ({
  onCancel,
  onSubmit,
  errorText,
  isDisabled,
}) => {
  return (
    <Fragment>
      <DialogTitle>Are you sure you want to delete?</DialogTitle>
      <DialogActions>
        <Button variant="contained" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={(e) => onSubmit(e, "delete")}
          disabled={isDisabled}
        >
          Submit
        </Button>
      </DialogActions>
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
    </Fragment>
  );
};

export default DeleteTodo;
