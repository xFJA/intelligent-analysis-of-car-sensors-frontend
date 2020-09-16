import React, { useState } from "react";
import { Upload } from "../Upload";
import { AlertProps } from "@material-ui/lab/Alert";
import { Api } from "../../api/api";
import { saveAs } from "@progress/kendo-file-saver";

const service = new Api();

interface Props {
  id: number;
}

export const ClassificationSVMForm: React.FC<Props> = (props) => {
  const [csvFile, setCSVFile] = useState<File>();
  const [progress, setProgress] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    AlertProps["severity"]
  >();
  const [snackbarText, setSnackbarText] = useState<string>("");

  const { id } = props;

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
      .classifySVM(id, csvFile)
      .then((res) => {
        const blob = new Blob([res], {
          type: "text/csv",
        });
        saveAs(blob, `${csvFile.name}.csv`);
        setSnackbarSeverity("success");
        setSnackbarText("The dataset was classified succesfully!");
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
    <>
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
    </>
  );
};
