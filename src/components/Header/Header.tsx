import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Theme,
  createStyles,
  IconButton,
} from "@material-ui/core";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import { useHistory } from "react-router-dom";
import { HeaderButton } from "./HeaderButton";
import BackupIcon from "@material-ui/icons/Backup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none",
    },
    linkGroup: {
      marginLeft: 50,
      marginRight: theme.spacing(6),
      right: 0,
      position: "absolute",
    },
    button: {
      color: theme.palette.common.white,
      textTransform: "none",
    },
    homeButton: {
      color: theme.palette.common.white,
      height: 64,
      width: 64,
    },
  })
);

export const Header: React.FC = (_) => {
  const classes = useStyles();

  let history = useHistory();

  return (
    <AppBar position="sticky" elevation={12}>
      <Toolbar>
        <IconButton
          edge="start"
          onClick={() => {
            history.push("/");
          }}
        >
          <DriveEtaIcon className={classes.homeButton} />
        </IconButton>
        <Button
          className={classes.button}
          onClick={() => {
            history.push("/");
          }}
        >
          <Typography variant="h4">
            Intelligent analysis of car's sensors
          </Typography>
        </Button>

        <div className={classes.linkGroup}>
          <HeaderButton name={"upload"} Icon={BackupIcon} />
        </div>
      </Toolbar>
    </AppBar>
  );
};
