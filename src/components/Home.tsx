import React, { useState, useEffect } from "react";
import { BarGroup } from "./Bar/BarGroup";
import * as moment from "moment";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { LightDataset, Dataset } from "../models/dataset";
import { Api } from "../api/api";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

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

  const onRowSelect = (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
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

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeadCell}>ID</TableCell>
              <TableCell className={classes.tableHeadCell}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.map((v) => {
              return (
                <TableRow
                  key={v.id}
                  onClick={(e) => onRowSelect(e, v.id)}
                  selected={datasetSelected && datasetSelected.id === v.id}
                >
                  <TableCell component="th" scope="row">
                    {v.id}
                  </TableCell>
                  <TableCell>{moment.unix(v.date).format()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {datasetSelected && <BarGroup dataset={datasetSelected} />}
    </div>
  );
};
