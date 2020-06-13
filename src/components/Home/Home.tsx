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
  IconButton,
  Typography,
  withStyles,
  AppBar,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import { LightDataset, Dataset } from "../../models/dataset";
import { Api } from "../../api/api";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { ColumnNames } from "./ColumnNames";
import { saveAs } from "@progress/kendo-file-saver";
import DescriptionIcon from "@material-ui/icons/Description";
import LinearProgress from "@material-ui/core/LinearProgress";
import { PCAPanel } from "../PCAPanel.tsx/PCAPanel";

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
    datasetSelected: {
      padding: theme.spacing(6),
    },
    tabHeader: {
      color: theme.palette.common.white,
      fontWeight: theme.typography.fontWeightBold,
      fontSize: 24,
      textTransform: "none",
    },
    linearProgress: {
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
    },
  })
);

const WhiteTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

// Linear progress stuff
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export const Home: React.FC = () => {
  const classes = useStyles();

  const [datasets, setDatasets] = useState<LightDataset[]>([]);
  const [datasetSelected, setDatasetSelected] = useState<Dataset>();
  const [indexSelected, setIndexSelected] = useState<number>();
  const [progressOpen, setProgressOpen] = useState<boolean>(false);
  const [pcaLoading, setPCALoading] = useState<boolean>(false);

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
    setProgressOpen(true);

    service
      .getDataset(id)
      .then((res) => {
        setProgressOpen(false);
        setDatasetSelected(res.data);
      })
      .catch((e) => {
        // TODO: Use snackbar component
        console.log(e);
      });
  };

  const onPCAButtonClick = (id: number) => {
    setPCALoading(true);

    service
      .pca(id)
      .then((res) => {
        setPCALoading(false);
        setDatasetSelected(res);
      })
      .catch((e) => {
        setPCALoading(false);
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

  // Linear progress stuff
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
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
      {progressOpen && (
        <LinearProgress className={classes.linearProgress} variant="query" />
      )}
      {datasetSelected && (
        <div className={classes.datasetSelected}>
          <Paper elevation={12}>
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="dataset tab"
              >
                <Tab
                  label="Dataset charts"
                  {...a11yProps(0)}
                  className={classes.tabHeader}
                />
                <Tab
                  label="PCA"
                  {...a11yProps(1)}
                  className={classes.tabHeader}
                />
                <Tab
                  label="Predictions"
                  {...a11yProps(2)}
                  className={classes.tabHeader}
                />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <BarGroup dataset={datasetSelected} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PCAPanel
                dataset={datasetSelected}
                onPCAButtonClick={onPCAButtonClick}
                pcaLoading={pcaLoading}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              Predictions
            </TabPanel>
          </Paper>
        </div>
      )}
    </div>
  );
};
