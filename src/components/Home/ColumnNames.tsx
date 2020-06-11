import React, { useState, useEffect } from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import { List, ListItem } from "@material-ui/core";

interface Props {
  names: string;
}

export const ColumnNames: React.FC<Props> = (props) => {
  const { names } = props;

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
        color="primary"
        onClick={handleClick}
      >
        Check {namesList.length} features
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
