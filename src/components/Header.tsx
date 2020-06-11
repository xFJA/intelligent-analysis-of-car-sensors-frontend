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
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none",
    },
    linkGroup: {
      marginLeft: 50,
      marginRight: 20,
      right: 0,
      position: "absolute",
    },
    button: {
      color: theme.palette.common.white,
    },
    homeButton: {
      color: theme.palette.common.white,
    },
  })
);

export const Header: React.FC = (_) => {
  const classes = useStyles();

  let history = useHistory();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          onClick={() => {
            history.push("/");
          }}
        >
          <HomeIcon className={classes.homeButton} />
        </IconButton>
        <Button
          className={classes.button}
          onClick={() => {
            history.push("/");
          }}
        >
          <Typography variant="h5">
            Intelligent analysis of car's sensors
          </Typography>
        </Button>

        <div className={classes.linkGroup}>
          <Link className={classes.link} to="/upload">
            <Button className={classes.button}>
              <Typography variant="subtitle1">Upload</Typography>
            </Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};
