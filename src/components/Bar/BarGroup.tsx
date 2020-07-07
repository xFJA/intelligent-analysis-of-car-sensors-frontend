import React from "react";
import { SensorPID } from "../../models/dataset";
import { Record as DataRecord } from "./../../models/bar";
import { Bar } from "./Bar";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import { GridListTile } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 50,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface Props {
  dataset: Record<SensorPID, DataRecord[]>;
}

export const BarGroup: React.FC<Props> = (props) => {
  const classes = useStyles();

  const items = [];

  const { dataset } = props;

  for (let r in dataset) {
    items.push(
      <GridListTile key={r} cols={1}>
        <Bar data={dataset[r as SensorPID]} dataKey={r} />
      </GridListTile>
    );
  }

  return (
    <div className={classes.root}>
      <GridList cellHeight={500} cols={2}>
        {items}
      </GridList>
    </div>
  );
};
