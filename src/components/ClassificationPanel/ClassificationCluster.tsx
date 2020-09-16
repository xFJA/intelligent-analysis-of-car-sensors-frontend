import React, { useState, useEffect } from "react";
import { SensorPID, Sensor } from "../../models/dataset";
import { Record as DataRecord } from "../../models/bar";
import {
  Tabs,
  Tab,
  Typography,
  makeStyles,
  Theme,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { PlotData, PlotPoint } from "../../models/plot";
import { Plot } from "../Plot/Plot";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  tabsContainer: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 600,
    color: theme.palette.common.black,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 400,
    paddingLeft: 50,
  },
  plotContainer: {
    height: 500,
  },
}));

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface Props {
  dataset: Record<SensorPID, DataRecord[]>;
  clusterList: string;
  sensorsInformation: Sensor[];
}

export const ClassificationCluster: React.FC<Props> = (props) => {
  const [value, setValue] = useState<number>(0);
  const [clusters, setClusters] = useState<string[]>([]);
  const [sensorSelected, setSensorSelected] = useState<SensorPID>(
    SensorPID.EngineRPM
  );

  const { dataset, clusterList, sensorsInformation } = props;
  const sensorList = Object.keys(dataset);

  useEffect(() => {
    let uniqueClusters: string[] = [...Array.from(new Set(clusterList))];
    uniqueClusters = uniqueClusters.filter(
      (c) => c !== "[" && c !== "]" && c !== ","
    );
    setClusters(uniqueClusters);
  }, [clusterList]);

  const generatePlotData = (feature: SensorPID): PlotData[] => {
    let data: PlotData[] = [];
    let featureData = dataset[feature];
    const clusterListCleaned = clusterList
      .substring(1, clusterList.length - 1)
      .split(",");

    for (let cluster in clusters) {
      let plotList: PlotPoint[] = [];

      for (let i = 0; i < featureData.length; i++) {
        if (clusterListCleaned[i] === cluster) {
          plotList.push({ x: i, y: featureData[i].value });
        }
      }

      data.push({ id: cluster, data: plotList });
    }
    return data;
  };
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    setSensorSelected(sensorList[newValue] as SensorPID);
  };

  const classes = useStyles();

  // Create tabs
  const tabs = [];
  let i = 0;
  for (let key in dataset) {
    tabs.push(<Tab label={key} {...a11yProps(i)} />);
    i++;
  }

  return (
    <Card className={classes.root} elevation={5}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Clusters by feature
          </Typography>
          <Typography variant="body2" component="p">
            Scatter plot of each feature grouped by each cluster
          </Typography>
        </CardContent>
        <div className={classes.tabsContainer}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            className={classes.tabs}
          >
            {tabs}
          </Tabs>
          <Plot
            data={generatePlotData(sensorSelected)}
            measureUnit={
              sensorsInformation.find((s) => s.pid === sensorSelected)
                ?.measureUnit || ""
            }
          />
        </div>
      </CardActionArea>
    </Card>
  );
};
