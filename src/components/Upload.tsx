import React, { useState } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { Api } from "../api/api";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

const service = new Api();

// TODO: Create reusable component for feedback along all the app
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const vertical = "bottom",
  horizontal = "left";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "100px 300px",
      backgroundColor: theme.palette.background.paper,
    },
    sendButton: {
      marginTop: 25,
    },
    progress: {
      marginTop: 25,
    },
  })
);

export const Upload: React.FC = (props) => {
  const classes = useStyles();

  const [csvFile, setCSVFile] = useState<File>();
  const [progress, setProgress] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    AlertProps["severity"]
  >();
  const [snackbarText, setSnackbarText] = useState<string>("");

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
      });
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div className={classes.root}>
      <DropzoneArea
        onChange={(files) => {
          setCSVFile(files[0]);
        }}
        acceptedFiles={[".csv, application/vnd.ms-excel, text/csv"]}
        filesLimit={1}
        dropzoneText={"Upload the CSV file"}
        showFileNames={true}
      />
      {csvFile && (
        <Button
          className={classes.sendButton}
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={onSend}
        >
          Send
        </Button>
      )}
      {progress && <LinearProgress className={classes.progress} />}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </div>
  );
};
