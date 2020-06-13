import React from "react";
import { Dataset } from "../../models/dataset";
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
  onPCAButtonClick: (id: number) => void;
  pcaLoading: boolean;
}

export const PCAPanel: React.FC<Props> = (props) => {
  const classes = useStyles();

  const { dataset, onPCAButtonClick, pcaLoading } = props;

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
          <Grid item xs={3} spacing={3}>
            <Button
              color="primary"
              variant="contained"
              className={classes.applyPcaButton}
              onClick={() => {
                onPCAButtonClick(dataset.id);
              }}
            >
              Apply PCA to dataset
            </Button>
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
          <Grid item xs={6}>
            {dataset.wcssPlot && (
              <PCAChart
                title={"WCSS"}
                description={
                  "Within Cluster Sum of Squares (WCSS) measures the squared average distance of all the points within a cluster to the cluster centroid"
                }
                chart={`data:image/png;base64,${dataset.wcssPlot}`}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            {dataset.twoFirstComponentsPlot && (
              <PCAChart
                title={"Two Principal Components"}
                description={"Two Principal Components plot by clusters"}
                chart={`data:image/png;base64,${dataset.twoFirstComponentsPlot}`}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            {dataset.componentsAndFeaturesPlot && (
              <PCAChart
                title={"Components and Features"}
                description={
                  "Chart about how the features affect each component"
                }
                chart={`data:image/png;base64,${dataset.componentsAndFeaturesPlot}`}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
