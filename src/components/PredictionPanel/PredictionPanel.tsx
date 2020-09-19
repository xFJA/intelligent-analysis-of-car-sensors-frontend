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
} from "@material-ui/core";
import { Dataset, Sensor } from "../../models/dataset";
import { PredictionFeaturesType, getPredictionFeaturesTypeString } from "./../../models/prediction";
import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import { Input } from "../ClassificationPanel/ClassificationForm";
import { Chart } from "../../models/pdf";
import { CardChart } from "../Utils/CardChart";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: { display: "flex", flexDirection: "row" },
    button: { fontSize: 20, textTransform: "none" },
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

  return (
    <Grid container xs={12} spacing={3}>
      <Grid item xs={12}>
        <div className={classes.form}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<TimelineRoundedIcon />}
            onClick={() => {
              onPredictionButtonClick(
                dataset.id,
                featureSelected,
                Number(epochs),
                predictionFeaturesType
              );
            }}
            className={classes.button}
          >
            Apply prediction
          </Button>
          <FormControl component="fieldset">
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

          <TextField
            className={classes.epochs}
            label="Epochs"
            value={epochs}
            onChange={(e) => {
              setEpochs(e.target.value);
            }}
          />
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
                  <Grid
                    item
                    xs={4}
                    className={classes.informationPredictionSection}
                  >
                    <Typography
                      className={classes.informationPredictionSectionTitle}
                      variant="h6"
                    >
                      Request configuration
                    </Typography>
                    <Divider />
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Feature predicted"
                          secondary={dataset.prediction.feature}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Prediction features type"
                          secondary={getPredictionFeaturesTypeString(dataset.prediction.predictionFeaturesType)}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    className={classes.informationPredictionSection}
                  >
                    <Typography
                      className={classes.informationPredictionSectionTitle}
                      variant="h6"
                    >
                      LSTM configuration
                    </Typography>
                    <Divider />
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Epochs"
                          secondary={dataset.prediction.epochs}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    className={classes.informationPredictionSection}
                  >
                    <Typography
                      className={classes.informationPredictionSectionTitle}
                      variant="h6"
                    >
                      LSTM result
                    </Typography>
                    <Divider />
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="RMSE (Root Mean Square Error)"
                          secondary={`${Number(dataset.prediction.rmse).toFixed(
                            5
                          )}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Prediction time"
                          secondary={`${Number(dataset.prediction.time).toFixed(
                            3
                          )} seconds`}
                        />
                      </ListItem>
                    </List>
                  </Grid>
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
