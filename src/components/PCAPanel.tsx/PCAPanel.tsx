import React, { useState } from "react";
import { Dataset, SensorPID } from "../../models/dataset";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  makeStyles,
  Paper,
  Theme,
  createStyles,
} from "@material-ui/core";
import { PCAChart } from "./PCAChart";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Record as DataRecord } from "./../../models/bar";
import { PCACluster } from "./PCACluster";
import { Input } from "./PCAForm";

const COMPONENTS_NUMBER = 3;
const CLUSTERS_NUMBER = 5;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    applyPcaButton: {
      textTransform: "none",
      fontSize: 20,
    },
  })
);

interface Props {
  dataset: Dataset;
  onPCAButtonClick: (
    id: number,
    clustersNumber: number,
    componentsNumber: number
  ) => void;
  pcaLoading: boolean;
  datasetTransformed: Record<SensorPID, DataRecord[]>;
}

export const PCAPanel: React.FC<Props> = (props) => {
  const [componentsNumber, setComponentsNumber] = useState<number>(
    COMPONENTS_NUMBER
  );
  const [clusterNumber, setClusterNumber] = useState<number>(CLUSTERS_NUMBER);

  const classes = useStyles();

  const { dataset, onPCAButtonClick, pcaLoading, datasetTransformed } = props;

  let explainedVarianceRatio = dataset.explainedVarianceRatio.replace("[", "");
  explainedVarianceRatio = explainedVarianceRatio.replace("]", "");
  const explainedVarianceRatioList = explainedVarianceRatio.split(",");

  return (
    <>
      <Grid container xs={12} spacing={3}>
        <Grid
          container
          item
          xs={12}
          spacing={3}
          style={{ flex: 1, flexDirection: "row" }}
        >
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              className={classes.applyPcaButton}
              onClick={() => {
                onPCAButtonClick(dataset.id, clusterNumber, componentsNumber);
              }}
            >
              Apply PCA to dataset
            </Button>
          </Grid>
          <Grid item>
            <Input
              min={2}
              max={6}
              value={COMPONENTS_NUMBER}
              title={"Components number"}
              onChange={setComponentsNumber}
            />
          </Grid>
          <Grid item>
            <Input
              min={2}
              max={6}
              value={CLUSTERS_NUMBER}
              title={"Clusters number"}
              onChange={setClusterNumber}
            />
          </Grid>
          {pcaLoading && (
            <Grid item xs={9} alignItems="center" justify="center">
              <LinearProgress />
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} spacing={3}>
          {explainedVarianceRatioList.length > 1 && (
            <>
              <Card className={classes.root} elevation={5}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Explained variance ratio
                    </Typography>
                    <Typography variant="body2" component="p">
                      How much information (variance) corresponds to each of the
                      Principal Components
                    </Typography>
                  </CardContent>
                  <Paper>
                    <List>
                      {explainedVarianceRatioList.map((v, i) => {
                        return (
                          <div key={i}>
                            <ListItem>
                              <ListItemText
                                primary={`Principal Component ${i + 1}`}
                                secondary={
                                  (
                                    ((v as unknown) as number) * 100
                                  ).toString() + "%"
                                }
                              />
                            </ListItem>
                          </div>
                        );
                      })}
                    </List>
                  </Paper>
                </CardActionArea>
              </Card>
            </>
          )}
        </Grid>
        <Grid container item xs={12} spacing={3}>
          {dataset.cumulativeExplainedVarianceRatioPlot && (
            <Grid item xs={6}>
              <PCAChart
                title={"Cumulative explained variance ratio"}
                description={
                  "Amount of variance (y axis) depending on the number of components"
                }
                chart={`data:image/png;base64,${dataset.cumulativeExplainedVarianceRatioPlot}`}
              />
            </Grid>
          )}
          {dataset.wcssPlot && (
            <Grid item xs={6}>
              <PCAChart
                title={"WCSS"}
                description={
                  "Within Cluster Sum of Squares (WCSS) measures the squared average distance of all the points within a cluster to the cluster centroid"
                }
                chart={`data:image/png;base64,${dataset.wcssPlot}`}
              />
            </Grid>
          )}
          {dataset.twoFirstComponentsPlot && (
            <Grid item xs={6}>
              <PCAChart
                title={"Two Principal Components"}
                description={"Two Principal Components plot by clusters"}
                chart={`data:image/png;base64,${dataset.twoFirstComponentsPlot}`}
              />
            </Grid>
          )}
          {dataset.componentsAndFeaturesPlot && (
            <Grid item xs={6}>
              <PCAChart
                title={"Components and Features"}
                description={
                  "Chart about how the features affect each component"
                }
                chart={`data:image/png;base64,${dataset.componentsAndFeaturesPlot}`}
              />
            </Grid>
          )}
          {dataset.clusterList && (
            <Grid item xs={12}>
              <PCACluster
                dataset={datasetTransformed}
                clusterList={dataset.clusterList}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
