import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Upload } from "./components/Upload";
import { Header } from "./components/Header/Header";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { AlertProps } from "@material-ui/lab/Alert";
import { Api } from "./api/api";

const service = new Api();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    uploadContainer: {
      padding: "100px 300px",
    },
  })
);

export const App: React.FC = () => {
  const classes = useStyles();

  const [csvFile, setCSVFile] = useState<File>();
  const [progress, setProgress] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    AlertProps["severity"]
  >();
  const [snackbarText, setSnackbarText] = useState<string>("");

  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const onChangeDropzoneArea = (files: any) => {
    setCSVFile(files[0]);
  };

  const onSend = () => {
    if (!csvFile) return;
    setProgress(true);
    service
      .addDataset(csvFile)
      .then(() => {
        setSnackbarSeverity("success");
        setSnackbarText("The csv file was stored succesfully!");
      })
      .catch((e) => {
        setSnackbarSeverity("error");
        setSnackbarText(e.response.data.error);
      })
      .finally(() => {
        setSnackbarOpen(true);
        setProgress(false);
        setTimeout(() => {
          setSnackbarText("");
        }, 3000);
      });
  };

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/upload">
          <div className={classes.uploadContainer}>
            <Upload
              csvFile={csvFile}
              onSend={onSend}
              onChangeDropzoneArea={onChangeDropzoneArea}
              handleSnackbarClose={handleSnackbarClose}
              snackbarOpen={snackbarOpen}
              progress={progress}
              snackbarSeverity={snackbarSeverity}
              snackbarText={snackbarText}
            />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
