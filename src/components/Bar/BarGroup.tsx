import React, { useState } from "react";
import { SensorPID, Sensor } from "../../models/dataset";
import { Record as DataRecord } from "./../../models/bar";
import { Bar } from "./Bar";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 50,
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      height: 600,
      flexDirection: "column",
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      width: 400,
      textAlign: "center",
      paddingLeft: 25,
    },
    bar: { height: 500, display: "flex", flexGrow: 1 },
    informationContainer: { textAlign: "center", marginBottom: 50 },
    title: { fontWeight: theme.typography.fontWeightBold },
  })
);

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface Props {
  dataset: Record<SensorPID, DataRecord[]>;
  sensorsInformation: Sensor[];
}

export const BarGroup: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState<number>(0);
  const [sensorSelected, setSensorSelected] = useState<SensorPID>(
    SensorPID.EngineRPM
  );

  const { dataset, sensorsInformation } = props;

  const sensorList = Object.keys(dataset);

  // Create tabs
  const tabs = [];
  let i = 0;
  for (let key in dataset) {
    tabs.push(<Tab label={key} {...a11yProps(i)} />);
    i++;
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    setSensorSelected(sensorList[newValue] as SensorPID);
  };

  const sensorSelectedInformation = sensorsInformation.find(
    (s) => s.pid === sensorSelected
  );

  return (
    <Paper>
      <div className={classes.root}>
        <div className={classes.informationContainer}>
          <Typography className={classes.title}>
            {sensorSelected} ({sensorSelectedInformation?.measureUnit})
          </Typography>
          <Typography>{sensorSelectedInformation?.description}</Typography>
        </div>
        <div className={classes.bar}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            className={classes.tabs}
          >
            {tabs}
          </Tabs>
          <Bar
            data={dataset[sensorSelected]}
            dataKey={sensorSelected}
            measureUnit={sensorSelectedInformation?.measureUnit}
          />
        </div>
      </div>
    </Paper>
  );
};
