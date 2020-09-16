import React from "react";
import { DropzoneArea } from "material-ui-dropzone";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

// TODO: Create reusable component for feedback along all the app
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const vertical = "bottom",
  horizontal = "left";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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

interface Props {
  csvFile: any;
  onSend: any;
  onChangeDropzoneArea: any;
  handleSnackbarClose: any;
  snackbarOpen: any;
  progress: any;
  snackbarSeverity: any;
  snackbarText: any;
}

export const Upload: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {
    csvFile,
    onSend,
    onChangeDropzoneArea,
    handleSnackbarClose,
    snackbarOpen,
    progress,
    snackbarSeverity,
    snackbarText,
  } = props;

  return (
    <div className={classes.root}>
      <DropzoneArea
        onChange={(files) => {
          onChangeDropzoneArea(files);
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
      {snackbarText && (
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
      )}
    </div>
  );
};
