import React, { useState, useEffect } from "react";
import { BarGroup } from "../Bar/BarGroup";
import * as moment from "moment";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  IconButton,
} from "@material-ui/core";
import { LightDataset, Dataset } from "../../models/dataset";
import { Api } from "../../api/api";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { ColumnNames } from "./ColumnNames";
import { saveAs } from "@progress/kendo-file-saver";
import DescriptionIcon from "@material-ui/icons/Description";

const service = new Api();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 50,
      backgroundColor: theme.palette.background.paper,
    },
    table: {},
    tableHeadCell: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
  })
);

export const Home: React.FC = () => {
  const classes = useStyles();

  const [datasets, setDatasets] = useState<LightDataset[]>([]);
  const [datasetSelected, setDatasetSelected] = useState<Dataset>();

  useEffect(() => {
    service
      .getDatasets()
      .then((res) => {
        setDatasets(res.data);
      })
      .catch((e) => {
        // TODO: Use snackbar component
        console.warn(e);
      });
  }, []);

  // TODO: Find a way to avoid add this method to all cells from the row (except the column names)
  const onRowSelect = (
    event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>,
    id: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDatasetSelected(undefined);

    service
      .getDataset(id)
      .then((res) => {
        setDatasetSelected(res.data);
      })
      .catch((e) => {
        // TODO: Use snackbar component
        console.log(e);
      });
  };

  const onPCAButtonClick = (id: number) => {
    service
      .pca(id)
      .then((res) => {
        setDatasetSelected(res.data);
      })
      .catch((e) => {
        // TODO: Use snackbar component
        console.warn(e);
      });
  };

  const onCSVDownload = (id: number, name: string) => {
    service
      .getDatasetCSV(id)
      .then((res) => {
        const blob = new Blob([res], {
          type: "text/csv",
        });
        saveAs(blob, `${name}.csv`);
      })
      .catch((e) => {
        // TODO: Use snackbar component
        console.warn(e);
      });
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeadCell}>ID</TableCell>
              <TableCell className={classes.tableHeadCell}>Date</TableCell>
              <TableCell className={classes.tableHeadCell}>Name</TableCell>
              <TableCell className={classes.tableHeadCell}>
                Rows number
              </TableCell>
              <TableCell className={classes.tableHeadCell}>
                Column names
              </TableCell>
              <TableCell className={classes.tableHeadCell}>
                Download CSV
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.map((v) => {
              return (
                <TableRow
                  key={v.id}
                  selected={datasetSelected && datasetSelected.id === v.id}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={(e) => onRowSelect(e, v.id)}
                  >
                    {v.id}
                  </TableCell>
                  <TableCell onClick={(e) => onRowSelect(e, v.id)}>
                    {moment.unix(v.date).format()}
                  </TableCell>
                  <TableCell onClick={(e) => onRowSelect(e, v.id)}>
                    {v.name}
                  </TableCell>
                  <TableCell onClick={(e) => onRowSelect(e, v.id)}>
                    {v.rowsNumber}
                  </TableCell>
                  <TableCell>
                    <ColumnNames names={v.columnNames} />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      edge="start"
                      onClick={() => {
                        onCSVDownload(v.id, v.name);
                      }}
                    >
                      <DescriptionIcon fontSize="large" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      {datasetSelected && (
        <>
          <Button
            onClick={() => {
              onPCAButtonClick(datasetSelected?.id);
            }}
          >
            Apply PCA to dataset
          </Button>
          {datasetSelected.twoFirstComponentsPlot && (
            <img
              alt={"a"}
              src={`data:image/png;base64,${datasetSelected.twoFirstComponentsPlot}`}
            />
          )}
          {datasetSelected.componentsAndFeaturesPlot && (
            <img
              alt={"a"}
              src={`data:image/png;base64,${datasetSelected.componentsAndFeaturesPlot}`}
            />
          )}
          {datasetSelected.explainedVarianceRatio && (
            <h1>{datasetSelected.explainedVarianceRatio}</h1>
          )}
        </>
      )}
      <Divider />
      {datasetSelected && <BarGroup dataset={datasetSelected} />}
    </div>
  );
};
