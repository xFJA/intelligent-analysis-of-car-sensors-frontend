import React from "react";
import { Dataset, SensorPID } from "../../models/dataset";
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
  dataset: Dataset;
}

export const BarGroup: React.FC<Props> = (props) => {
  const classes = useStyles();

  const items = [];

  const { dataset } = props;
  console.log(dataset)

  // TODO: Find a way to avoid initialize the map
  let res: Record<SensorPID, DataRecord[]> = {
    ENGINE_RPM: [],
    VEHICLE_SPEED: [],
    THROTTLE: [],
    ENGINE_LOAD: [],
    COOLANT_TEMPERATURE: [],
    LONG_TERM_FUEL_TRIM_BANK_1: [],
    SHORT_TERM_FUEL_TRIM_BANK_1: [],
    INTAKE_MANIFOLD_PRESSURE: [],
    FUEL_TANK: [],
    ABSOLUTE_THROTTLE_B: [],
    PEDAL_D: [],
    PEDAL_E: [],
    COMMAND_THROTTLE_ACTUATOR: [],
    FUEL_AIR_COMMANDED_EQUIV_RATIO: [],
    ABSOLUTE_BAROMETRIC_PRESSURE: [],
    RELATIVE_THROTTLE_POSITION: [],
    INTAKE_AIR_TEMP: [],
    TIMING_ADVANCE: [],
    CATALYST_TEMPERATURE_BANK1_SENSOR1: [],
    CATALYST_TEMPERATURE_BANK1_SENSOR2: [],
    CONTROL_MODULE_VOLTAGE: [],
    COMMANDED_EVAPORATIVE_PURGE: [],
    TIME_RUN_WITH_MIL_ON: [],
    TIME_SINCE_TROUBLE_CODES_CLEARED: [],
    DISTANCE_TRAVELED_WITH_MIL_ON: [],
    WARM_UPS_SINCE_CODES_CLEARED: [],
  };

  console.log(dataset.logs);

  for (let log of dataset.logs) {
    for (let record of log.records) {
      let dataRecord = res[(record.sensorPID as unknown) as SensorPID];
      if (dataRecord) {
        let newRecord: DataRecord = { logID: log.id };
        newRecord[record.sensorPID as string] = record.value;
        res[record.sensorPID as SensorPID].push(newRecord);
      }
    }
  }

  for (let r in res) {
    items.push(
      <GridListTile key={r} cols={1}>
        <Bar data={res[r as SensorPID]} dataKey={r} />
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
