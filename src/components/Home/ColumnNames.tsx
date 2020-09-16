import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import {
  List,
  ListItem,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Tooltip,
} from "@material-ui/core";
import { Sensor } from "../../models/dataset";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      textTransform: "none",
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    list: {
      backgroundColor: theme.palette.primary.main,
      border: "1px solid rgba(255,255,255, 0.5)",
    },
    item: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      border: "1px solid rgba(255,255,255, 0.1)",
    },
  })
);

interface Props {
  sensorsInformation: Sensor[];
}

export const ColumnNames: React.FC<Props> = (props) => {
  const classes = useStyles();

  const { sensorsInformation } = props;

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
        onClick={handleClick}
        size="small"
        className={classes.button}
      >
        <Typography variant="h6">
          Check {sensorsInformation.length} features
        </Typography>
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
        <List className={classes.list}>
          {sensorsInformation
            .map((s) => {
              return s.pid;
            })
            .map((v) => {
              return (
                <Tooltip
                  title={
                    sensorsInformation.find((s) => s.pid === v)?.description ||
                    ""
                  }
                  key={v}
                >
                  <ListItem className={classes.item}>
                    {v} (
                    {sensorsInformation.find((s) => s.pid === v)?.measureUnit ||
                      ""}
                    )
                  </ListItem>
                </Tooltip>
              );
            })}
        </List>
      </Popover>
    </>
  );
};
