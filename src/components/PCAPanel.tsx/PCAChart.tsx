import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import { Chart } from "../../models/pdf";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  })
);

export const PCAChart: React.FC<Chart> = (props) => {
  const classes = useStyles();

  const { title, description, chart } = props;

  return (
    <Card className={classes.root} elevation={5}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" component="p">
            {description}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          alt="Dataset chart"
          image={chart}
          title={title}
        />
      </CardActionArea>
    </Card>
  );
};
