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
  Typography,
  withStyles,
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
      backgroundColor: theme.palette.background.paper,
    },
    tableContainer: { padding: theme.spacing(6) },
    tableHeadCell: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: theme.typography.fontWeightBold,
      fontSize: 20,
    },
    pair: {
      background: theme.palette.common.white,
    },
    odd: {
      background: theme.palette.primary.main,
      opacity: 0.75,
      color: theme.palette.common.white,
    },
    idColumn: {
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

const WhiteTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

export const Home: React.FC = () => {
  const classes = useStyles();

  const [datasets, setDatasets] = useState<LightDataset[]>([]);
  const [datasetSelected, setDatasetSelected] = useState<Dataset>();
  const [indexSelected, setIndexSelected] = useState<number>();

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
    setIndexSelected(id);

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
    <div className={classes.root}>
      <div className={classes.tableContainer}>
        <TableContainer component={Paper} elevation={12}>
          <Table aria-label="datasets table">
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
              {datasets.map((v, i) => {
                const TypographySelected = i % 2 ? WhiteTypography : Typography;
                return (
                  <TableRow
                    key={v.id}
                    selected={indexSelected === v.id}
                    className={i % 2 ? classes.odd : classes.pair}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={(e) => onRowSelect(e, v.id)}
                    >
                      <TypographySelected
                        variant="h6"
                        className={classes.idColumn}
                      >
                        {v.id}
                      </TypographySelected>
                    </TableCell>
                    <TableCell onClick={(e) => onRowSelect(e, v.id)}>
                      <TypographySelected variant="h6">
                        {moment.unix(v.date).format()}{" "}
                      </TypographySelected>
                    </TableCell>
                    <TableCell onClick={(e) => onRowSelect(e, v.id)}>
                      <TypographySelected variant="h6">
                        {v.name}
                      </TypographySelected>
                    </TableCell>
                    <TableCell onClick={(e) => onRowSelect(e, v.id)}>
                      <TypographySelected variant="h6">
                        {v.rowsNumber}
                      </TypographySelected>
                    </TableCell>
                    <TableCell>
                      <ColumnNames names={v.columnNames} index={i} />
                    </TableCell>
                    <TableCell>
                      <div style={{ color: "#FFFFFF" }}>
                        <IconButton
                          edge="start"
                          color={i % 2 ? "inherit" : "primary"}
                          onClick={() => {
                            onCSVDownload(v.id, v.name);
                          }}
                        >
                          <DescriptionIcon fontSize="large" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
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
