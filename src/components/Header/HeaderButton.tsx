import { useHistory } from "react-router-dom";
import {
  IconButton,
  Button,
  Typography,
  SvgIconTypeMap,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import React from "react";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      color: theme.palette.common.white,
      textTransform: "none",
    },
    icon: {
      color: theme.palette.common.white,
      marginRight: -theme.spacing(1.5),
    },
  })
);

interface Props {
  name: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export const HeaderButton: React.FC<Props> = (props) => {
  const classes = useStyles();

  let history = useHistory();

  const { name, Icon } = props;

  return (
    <>
      <IconButton
        edge="start"
        onClick={() => {
          history.push(`/${name}`);
        }}
      >
        <Icon className={classes.icon} />
      </IconButton>
      <Button
        className={classes.button}
        onClick={() => {
          history.push(`/${name}`);
        }}
      >
        <Typography variant="h5">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Typography>
      </Button>
    </>
  );
};
