import React from "react";
import { DropzoneArea } from "material-ui-dropzone";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 50,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export const Upload: React.FC = (props) => {
  const classes = useStyles();

  const onChange = () => {};

  return (
    <div className={classes.root}>
      <DropzoneArea
        onChange={onChange}
        acceptedFiles={[".csv, application/vnd.ms-excel, text/csv"]}
        filesLimit={1}
        dropzoneText={"Upload the CSV file"}
        showFileNames={true}
      />
    </div>
  );
};
