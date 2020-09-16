import React, { useState } from "react";
import { Dataset, SensorPID, Sensor } from "../../models/dataset";
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
  Dialog,
  ListItemAvatar,
  Avatar,
  ListSubheader,
  withStyles,
} from "@material-ui/core";
import { ClassificationChart } from "./ClassificationChart";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Record as DataRecord } from "../../models/bar";
import { ClassificationCluster } from "./ClassificationCluster";
import { Input } from "./ClassificationForm";
import { PDFViewer } from "@react-pdf/renderer";
import { ClassificationDocument } from "./ClassificationDocument";
import { Chart } from "../../models/pdf";
import DescriptionIcon from "@material-ui/icons/Description";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import CancelIcon from "@material-ui/icons/Cancel";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ClassificationSVMForm } from "./ClassificationSVMForm";

const COMPONENTS_NUMBER = 3;
const CLUSTERS_NUMBER = 5;

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "#3f51b5",
    color: "#FFFFFF",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expandIcon: { color: "#FFFFFF" },
})(MuiAccordionSummary);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    classificationButton: {
      textTransform: "none",
      fontSize: 20,
    },
    pdf: {
      height: "80vh",
      width: "40vw",
    },
    cancel: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
      float: "right",
    },
    moreImportantFeaturesList: {
      height: 200,
      overflowY: "scroll",
    },
    moreImportantFeaturesListContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
    },
    moreImportantFeaturesListAvatar: {
      backgroundColor: theme.palette.secondary.main,
    },
    accordionsContainer: {
      maxWidth: "100%",
    },
    accordion: {
      maxWidth: "100%",
    },
    accordionTitle: {
      fontSize: 20,
    },
  })
);

interface Props {
  dataset: Dataset;
  onClassificationButtonClick: (
    id: number,
    clustersNumber: number,
    componentsNumber: number
  ) => void;
  classificationLoading: boolean;
  datasetTransformed: Record<SensorPID, DataRecord[]>;
  sensorsInformation: Sensor[];
}

export const ClassificationPanel: React.FC<Props> = (props) => {
  const [componentsNumber, setComponentsNumber] = useState<number>(
    COMPONENTS_NUMBER
  );
  const [clusterNumber, setClusterNumber] = useState<number>(CLUSTERS_NUMBER);
  const [openDocument, setOpenDocument] = useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const classes = useStyles();

  const {
    dataset,
    onClassificationButtonClick,
    classificationLoading,
    datasetTransformed,
    sensorsInformation,
  } = props;
  const { kmeansResult, svmResult } = dataset;

  let explainedVarianceRatio = kmeansResult.explainedVarianceRatio.replace(
    "[",
    ""
  );
  explainedVarianceRatio = explainedVarianceRatio.replace("]", "");
  const explainedVarianceRatioList = explainedVarianceRatio.split(",");

  // TODO: Add an interface to parse this property
  let moreImportantFeatures = [];
  if (kmeansResult.moreImportantFeatures) {
    const moreImportantFeaturesMap = JSON.parse(
      kmeansResult.moreImportantFeatures
    );
    for (let key in moreImportantFeaturesMap) {
      const moreImportantFeature = Object.entries(
        moreImportantFeaturesMap[key]
      );
      moreImportantFeatures.push(moreImportantFeature);
    }
  }

  // Generate Classification pdf document data
  let classificationChartsData: Chart[] = [];

  if (dataset.classificationApplied) {
    classificationChartsData.push({
      title: "Cumulative explained variance ratio",
      description:
        "Amount of variance (y axis) depending on the number of components",
      chart: `data:image/png;base64,${kmeansResult.cumulativeExplainedVarianceRatioPlot}`,
    });

    classificationChartsData.push({
      title: "WCSS",
      description:
        "Within Cluster Sum of Squares (WCSS) measures the squared average distance of all the points within a cluster to the cluster centroid",
      chart: `data:image/png;base64,${kmeansResult.wcssPlot}`,
    });

    classificationChartsData.push({
      title: "Two Principal Components",
      description: "Two Principal Components plot by clusters",
      chart: `data:image/png;base64,${kmeansResult.twoFirstComponentsPlot}`,
    });

    classificationChartsData.push({
      title: "Components and Features",
      description: "Chart about how the features affect each component",
      chart: `data:image/png;base64,${kmeansResult.componentsAndFeaturesPlot}`,
    });
  }

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

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
              className={classes.classificationButton}
              onClick={() => {
                onClassificationButtonClick(
                  dataset.id,
                  clusterNumber,
                  componentsNumber
                );
              }}
              endIcon={<ShowChartIcon />}
            >
              Apply classification to dataset
            </Button>
          </Grid>
          {kmeansResult.componentsAndFeaturesPlot &&
            kmeansResult.twoFirstComponentsPlot &&
            kmeansResult.wcssPlot &&
            kmeansResult.cumulativeExplainedVarianceRatioPlot && (
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenDocument(!openDocument)}
                  className={classes.classificationButton}
                  endIcon={<DescriptionIcon />}
                >
                  Generate charts document
                </Button>
                <Dialog open={openDocument} maxWidth={"lg"}>
                  <Paper>
                    <Button
                      onClick={() => setOpenDocument(!openDocument)}
                      endIcon={<CancelIcon />}
                      className={classes.cancel}
                      variant="contained"
                      fullWidth={true}
                    >
                      CLOSE
                    </Button>
                  </Paper>
                  <PDFViewer className={classes.pdf}>
                    {ClassificationDocument(classificationChartsData)}
                  </PDFViewer>
                </Dialog>
              </Grid>
            )}
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
          {classificationLoading && (
            <Grid item xs={9} alignItems="center" justify="center">
              <LinearProgress />
            </Grid>
          )}
        </Grid>
        <Grid item className={classes.accordionsContainer}>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            className={classes.accordion}
            disabled={!dataset.classificationApplied}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.accordionTitle}>
                k-means
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} spacing={3}>
                  {explainedVarianceRatioList.length > 1 && (
                    <>
                      <Card className={classes.root} elevation={5}>
                        <CardActionArea>
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              Explained variance ratio
                            </Typography>
                            <Typography variant="body2" component="p">
                              How much information (variance) corresponds to
                              each of the Principal Components
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
                {moreImportantFeatures && (
                  <Grid item xs={12} spacing={3}>
                    <Card className={classes.root} elevation={5}>
                      <CardActionArea>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            More important features for principal components
                          </Typography>
                          <Typography variant="body2" component="p">
                            The most contributory features for each principal
                            component. Each value represents the percentage of
                            the coeficient for the given feature. It corresponds
                            to the first coeficient percetanges that their sum
                            is equal or greater to 90%
                          </Typography>
                        </CardContent>
                        <Paper
                          className={classes.moreImportantFeaturesListContainer}
                        >
                          {moreImportantFeatures.map((v, i) => {
                            // TODO: Fix subheader solapation when list is scrolling
                            return (
                              <List
                                className={classes.moreImportantFeaturesList}
                                subheader={
                                  <ListSubheader component="div">
                                    {`Principal Component ${i + 1}`}
                                  </ListSubheader>
                                }
                                key={i}
                              >
                                {v.map((f, j) => {
                                  return (
                                    <ListItem key={j}>
                                      <ListItemAvatar>
                                        <Avatar
                                          className={
                                            classes.moreImportantFeaturesListAvatar
                                          }
                                        >{`${j + 1}º`}</Avatar>
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={f[0]}
                                        secondary={`${(f[1] as number).toFixed(
                                          3
                                        )} %`}
                                      />
                                    </ListItem>
                                  );
                                })}
                              </List>
                            );
                          })}
                        </Paper>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )}

                {classificationChartsData.map((c, i) => {
                  return (
                    <Grid item xs={6}>
                      <ClassificationChart
                        title={c.title}
                        description={c.description}
                        chart={c.chart}
                      />
                    </Grid>
                  );
                })}
                {kmeansResult.clusterList && (
                  <Grid item xs={12}>
                    <ClassificationCluster
                      dataset={datasetTransformed}
                      clusterList={kmeansResult.clusterList}
                      sensorsInformation={sensorsInformation}
                    />
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
            className={classes.accordion}
            disabled={!dataset.classificationApplied}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.accordionTitle}>SVM</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={6} spacing={3}>
                  <ClassificationChart
                    title={"Two Principal Components"}
                    description={"Two Principal Components plot by categories"}
                    chart={`data:image/png;base64,${svmResult.twoFirstComponentsPlot}`}
                  />
                </Grid>
                <Grid item xs={6} spacing={3}>
                  <ClassificationSVMForm id={dataset.id} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </>
  );
};
