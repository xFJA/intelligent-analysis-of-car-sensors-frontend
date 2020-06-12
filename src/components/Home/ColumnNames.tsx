import React, { useState, useEffect } from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import {
  List,
  ListItem,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      textTransform: "none",
    },
  })
);

interface Props {
  names: string;
  index: number;
}

export const ColumnNames: React.FC<Props> = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const { names, index } = props;

  const [namesList, setNamesList] = useState<string[]>([]);

  useEffect(() => {
    setNamesList(names.split(","));
  }, [names]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        variant="contained"
        style={{
          backgroundColor:
            index % 2 ? theme.palette.common.white : theme.palette.primary.main,
          color:
            index % 2 ? theme.palette.common.black : theme.palette.common.white,
        }}
        onClick={handleClick}
        size="small"
        className={classes.button}
      >
        <Typography variant="h6">Check {namesList.length} features </Typography>
      </Button>

      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List>
          {namesList.map((v) => {
            return <ListItem key={v}>{v}</ListItem>;
          })}
        </List>
      </Popover>
    </>
  );
};
