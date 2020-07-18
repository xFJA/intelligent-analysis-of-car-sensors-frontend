import React, { useState } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  IconButton,
  Typography,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

const inputStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
    },
    button: {
      color: theme.palette.primary.main,
    },
  })
);

interface InputProps {
  title: string;
  min: number;
  max: number;
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
}

export const Input: React.FC<InputProps> = (props) => {
  const { min, max, value, title, onChange } = props;

  const [inputValue, setInputValue] = useState<number>(value);

  const classes = inputStyles();

  const onAdd = () => {
    let newValue: number = inputValue + 1;
    if (newValue > max) return;
    setInputValue(newValue);
    onChange(newValue);
  };

  const onSubtract = () => {
    let newValue: number = inputValue - 1;
    if (newValue < min) return;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6">{title}:</Typography>
      <IconButton onClick={onSubtract} className={classes.button}>
        <RemoveCircleIcon />
      </IconButton>
      <Typography variant="h6">{inputValue}</Typography>
      <IconButton onClick={onAdd} className={classes.button}>
        <AddCircleIcon />
      </IconButton>
    </div>
  );
};
