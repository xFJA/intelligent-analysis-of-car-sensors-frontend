import React, { useState } from "react";
import {
  Button,
  makeStyles,
  Theme,
  createStyles,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  LinearProgress,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Dialog,
  Paper,
} from "@material-ui/core";
import { Dataset, Sensor } from "../../models/dataset";
import {
  PredictionFeaturesType,
  getPredictionFeaturesTypeString,
  PredictionInformationList,
} from "./../../models/prediction";
import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import { Input } from "../ClassificationPanel/ClassificationForm";
import { Chart } from "../../models/pdf";
import { CardChart } from "../Utils/CardChart";
import CancelIcon from "@material-ui/icons/Cancel";
import DescriptionIcon from "@material-ui/icons/Description";
import { PDFViewer } from "@react-pdf/renderer";
import { DocumentPDF } from "../Utils/Document";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: { display: "flex", flexDirection: "row" },
    button: { fontSize: 20, textTransform: "none", margin: "0px 5px" },
    select: { minWidth: 100 },
    informationPredictionCard: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    informationPredictionSection: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    informationPredictionSectionTitle: {
      margin: "10px",
    },
    epochs: {
      width: 50,
    },
    predictionFeaturesTypeForm: {
      borderLeft: "1px solid  #b3b3b3",
      borderRight: "1px solid  #b3b3b3",
      margin: "0px 20px",
    },
    lstmConfigurationContainer: {
      borderLeft: "1px solid  #b3b3b3",
      margin: "0px 20px",
      paddingLeft: 20,
    },
    requestConfigurationContainer: {
      margin: "0pc 20px",
    },
    cancel: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
      float: "right",
    },
    pdf: {
      height: "80vh",
      width: "40vw",
    },
  })
);

interface Props {
  dataset: Dataset;
  sensorList: Sensor[];
  onPredictionButtonClick: any;
  predictionLoading: boolean;
}

export const PredictionPanel: React.FC<Props> = (props) => {
  const {
    dataset,
    sensorList,
    onPredictionButtonClick,
    predictionLoading,
  } = props;
  const [predictionFeaturesType, setPredictionFeaturesType] = useState<
    PredictionFeaturesType
  >(PredictionFeaturesType.All);
  const [componentsNumber, setComponentsNumber] = useState<number>(2);
  const [featureSelected, setFeatureSelected] = useState<string>(
    sensorList[0].pid
  );
  const [epochs, setEpochs] = useState<string>("100");

  const [openDocument, setOpenDocument] = useState<boolean>(false);

  const classes = useStyles();

  const handlePredictionFeatureTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPredictionFeaturesType(
      (event.target as HTMLInputElement).value as PredictionFeaturesType
    );
  };

  const predictionChartsData: Chart[] = [];

  if (dataset.predictionApplied) {
    predictionChartsData.push({
      title: "Learning curve",
      description:
        "Learning curve that represents the model learning performance over experience or time",
      chart: `data:image/png;base64,${dataset.prediction.learningCurvePlot}`,
    });

    predictionChartsData.push({
      title: "Prediction",
      description: "Prediction over selected feature",
      chart: `data:image/png;base64,${dataset.prediction.predictionPlot}`,
    });
  }

  const predictionData: PredictionInformationList[] = [];

  if (dataset.predictionApplied) {
    predictionData.push({
      title: "Request configuration",
      list: [
        { title: "Feature predicted", value: dataset.prediction.feature },
        {
          title: "Prediction features type",
          value: getPredictionFeaturesTypeString(
            dataset.prediction.predictionFeaturesType
          ),
        },
      ],
    });
    if (dataset.prediction.principalComponentsNumber > 0) {
      predictionData[0].list.push({
        title: "Principal Components number",
        value: dataset.prediction.principalComponentsNumber,
      });
    }

    predictionData.push({
      title: "LSTM configuration",
      list: [{ title: "Epochs", value: dataset.prediction.epochs }],
    });

    predictionData.push({
      title: "LSTM Result",
      list: [
        {
          title: "RMSE (Root Mean Square Error)",
          value: `${Number(dataset.prediction.rmse).toFixed(5)}`,
        },
        {
          title: "Prediction time",
          value: `${Number(dataset.prediction.time).toFixed(3)} seconds`,
        },
      ],
    });
  }

  return (
    <Grid container xs={12} spacing={3}>
      <Grid item xs={12}>
        <div className={classes.form}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              endIcon={<TimelineRoundedIcon />}
              onClick={() => {
                onPredictionButtonClick(
                  dataset.id,
                  featureSelected,
                  Number(epochs),
                  predictionFeaturesType,
                  predictionFeaturesType === PredictionFeaturesType.PCA
                    ? componentsNumber
                    : 0
                );
              }}
              className={classes.button}
            >
              Apply prediction
            </Button>
          </Grid>
          {dataset.predictionApplied && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDocument(!openDocument)}
                className={classes.button}
                endIcon={<DescriptionIcon />}
              >
                Generate document
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
                  <DocumentPDF
                    data={predictionChartsData}
                    title="Prediction results"
                    predictionInformation={predictionData}
                  />
                </PDFViewer>
              </Dialog>
            </Grid>
          )}
          <FormControl
            component="fieldset"
            className={classes.predictionFeaturesTypeForm}
          >
            <RadioGroup
              row
              defaultValue={predictionFeaturesType}
              onChange={handlePredictionFeatureTypeChange}
            >
              <FormControlLabel
                value={PredictionFeaturesType.All}
                control={<Radio color="primary" />}
                label="All features"
                labelPlacement="top"
              />
              <FormControlLabel
                value={PredictionFeaturesType.One}
                control={<Radio color="primary" />}
                label="1 feature"
                labelPlacement="top"
              />
              <FormControlLabel
                value={PredictionFeaturesType.PCA}
                control={<Radio color="primary" />}
                label="PCA"
                labelPlacement="top"
              />
            </RadioGroup>
          </FormControl>
          <div className={classes.requestConfigurationContainer}>
            <FormControl>
              <InputLabel>Feature</InputLabel>
              <Select
                value={featureSelected}
                onChange={(e) => setFeatureSelected(e.target.value as string)}
                className={classes.select}
              >
                {sensorList.map((v) => {
                  return (
                    <MenuItem key={v.pid} value={v.pid}>
                      {v.pid}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {predictionFeaturesType === PredictionFeaturesType.PCA && (
              <Input
                min={2}
                max={6}
                value={componentsNumber}
                title={"Components number"}
                onChange={setComponentsNumber}
              />
            )}
          </div>
          <div className={classes.lstmConfigurationContainer}>
            <TextField
              className={classes.epochs}
              label="Epochs"
              value={epochs}
              onChange={(e) => {
                setEpochs(e.target.value);
              }}
            />
          </div>
        </div>
      </Grid>
      {predictionLoading && (
        <Grid item xs={12} alignItems="center" justify="center">
          <LinearProgress />
        </Grid>
      )}
      {dataset.predictionApplied && (
        <>
          <Grid item xs={12}>
            <Card className={classes.informationPredictionCard} elevation={5}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Information about prediction
                  </Typography>
                </CardContent>
                <Grid container>
                  {predictionData.map((d, i) => {
                    return (
                      <Grid
                        item
                        xs={4}
                        className={classes.informationPredictionSection}
                        key={i}
                      >
                        <Typography
                          className={classes.informationPredictionSectionTitle}
                          variant="h6"
                        >
                          {d.title}
                        </Typography>
                        <Divider />
                        <List>
                          {d.list.map((l, i) => {
                            return (
                              <ListItem>
                                <ListItemText
                                  primary={l.title}
                                  secondary={l.value}
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            {predictionChartsData.map((c, i) => {
              return (
                <Grid item xs={12} key={i}>
                  <CardChart
                    title={c.title}
                    description={c.description}
                    chart={c.chart}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Grid>
  );
};
