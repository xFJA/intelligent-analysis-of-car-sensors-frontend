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
  TablePagination,
  Toolbar,
} from "@material-ui/core";
import { LightDataset, Dataset, SensorPID } from "../../models/dataset";
import { Api } from "../../api/api";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { ColumnNames } from "./ColumnNames";
import { saveAs } from "@progress/kendo-file-saver";
import DescriptionIcon from "@material-ui/icons/Description";
import DeleteIcon from "@material-ui/icons/Delete";
import LinearProgress from "@material-ui/core/LinearProgress";
import { PCAPanel } from "../PCAPanel.tsx/PCAPanel";
import { Record as DataRecord } from "./../../models/bar";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const service = new Api();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
    tableContainer: { padding: theme.spacing(6) },
    tableToolbar: { backgroundColor: theme.palette.primary.main },
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
    tabs: {
      flexGrow: 1,
    },
    tabsDatasetID: {
      marginRight: 10,
    },
    tableTitle: {
      color: theme.palette.common.white,
      marginLeft: -10,
    },
    checkIcon: {
      color: theme.palette.success.main,
    },
    cancelIcon: {
      color: theme.palette.error.main,
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
  const [datasetTransformed, setDatasetTransformed] = useState<
    Record<SensorPID, DataRecord[]>
  >();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(3);
  const [datasetsNumber, setDatasetsNumber] = useState<number>(0);

  useEffect(() => {
    service
      .getDatasets(rowsPerPage, page)
      .then((res) => {
        setDatasets(
          res.data.sort((a, b) => {
            return a.id - b.id;
          })
        );
        setDatasetsNumber(res.datasetsNumber);
      })
      .catch((e) => {
        // TODO: Use snackbar component
        console.warn(e);
      });
  }, [rowsPerPage, page]);

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
        setDatasetTransformed(transformDataset(res.data));
      })
      .catch((e) => {
        // TODO: Use snackbar component
        console.log(e);
      });
  };

  const onPCAButtonClick = (
    id: number,
    clustersNumber: number,
    componentsNumber: number
  ) => {
    setPCALoading(true);

    service
      .pca(id, clustersNumber, componentsNumber)
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

  const onDelete = (id: number) => {
    service
      .deleteDataset(id)
      .then(() => {
        service
          .getDatasets(rowsPerPage, page)
          .then((res) => {
            setDatasets(
              res.data.sort((a, b) => {
                return a.id - b.id;
              })
            );
            setDatasetsNumber(res.datasetsNumber);
          })
          .catch((e) => {
            // TODO: Use snackbar component
            console.warn(e);
          });
      })
      .catch((e) => {
        // TODO: Use snackbar component
        console.warn(e);
      });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Tabs selection
  const [value, setValue] = useState<number>(1);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const transformDataset = (
    dataset: Dataset
  ): Record<SensorPID, DataRecord[]> => {
    // Transform dataset for charts
    // TODO: Find a way to avoid initialize the map
    let res: Record<SensorPID, DataRecord[]> = {
      ENGINE_RPM: [],
      VEHICLE_SPEED: [],
      THROTTLE: [],
      ENGINE_LOAD: [],
      COOLANT_TEMPERATURE: [],
      LONG_TERM_FUEL_TRIM_BANK_1: [],
      SHORT_TERM_FUEL_TRIM_BANK_1: [],
      INTAKE_MANIFOLD_PRESSURE: [],
      FUEL_TANK: [],
      ABSOLUTE_THROTTLE_B: [],
      PEDAL_D: [],
      PEDAL_E: [],
      COMMAND_THROTTLE_ACTUATOR: [],
      FUEL_AIR_COMMANDED_EQUIV_RATIO: [],
      ABSOLUTE_BAROMETRIC_PRESSURE: [],
      RELATIVE_THROTTLE_POSITION: [],
      INTAKE_AIR_TEMP: [],
      TIMING_ADVANCE: [],
      CATALYST_TEMPERATURE_BANK1_SENSOR1: [],
      CATALYST_TEMPERATURE_BANK1_SENSOR2: [],
      CONTROL_MODULE_VOLTAGE: [],
      COMMANDED_EVAPORATIVE_PURGE: [],
      TIME_RUN_WITH_MIL_ON: [],
      TIME_SINCE_TROUBLE_CODES_CLEARED: [],
      DISTANCE_TRAVELED_WITH_MIL_ON: [],
      WARM_UPS_SINCE_CODES_CLEARED: [],
    };

    for (let log of dataset.logs) {
      for (let record of log.records) {
        let dataRecord = res[(record.sensorPID as unknown) as SensorPID];
        if (dataRecord) {
          let newRecord: DataRecord = { logID: log.id, value: record.value };
          newRecord[record.sensorPID as string] = record.value;
          res[record.sensorPID as SensorPID].push(newRecord);
        }
      }
    }

    return res;
  };

  return (
    <div className={classes.root}>
      <div className={classes.tableContainer}>
        <Paper elevation={12}>
          <Toolbar className={classes.tableToolbar}>
            <Typography variant="h5" className={classes.tableTitle}>
              Datasets
            </Typography>
          </Toolbar>
          <TableContainer component={Paper}>
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
                    PCA applied
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    Download CSV
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    Delete CSV
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datasets.map((v, i) => {
                  const TypographySelected =
                    i % 2 ? WhiteTypography : Typography;
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
                      <TableCell onClick={(e) => onRowSelect(e, v.id)}>
                        <TypographySelected variant="h6">
                          {v.pcaApplied ? (
                            <CheckCircleIcon className={classes.checkIcon} fontSize="large" />
                          ) : (
                            <CancelIcon className={classes.cancelIcon} fontSize="large"/>
                          )}
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
                      <TableCell>
                        <div style={{ color: "#FFFFFF" }}>
                          <IconButton
                            edge="start"
                            color={i % 2 ? "inherit" : "primary"}
                            onClick={() => {
                              onDelete(v.id);
                              setDatasetSelected(undefined);
                            }}
                          >
                            <DeleteIcon fontSize="large" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[3, 5, 7]}
            component="div"
            count={datasetsNumber}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {progressOpen && (
        <LinearProgress className={classes.linearProgress} variant="query" />
      )}
      {datasetSelected && datasetTransformed && (
        <div className={classes.datasetSelected}>
          <Paper elevation={12}>
            <AppBar position="static">
              <Toolbar>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="dataset tab"
                  className={classes.tabs}
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
                <Typography variant="h5" className={classes.tabsDatasetID}>
                  {datasetSelected.id}:
                </Typography>
                <Typography variant="h6">{datasetSelected.name}</Typography>
              </Toolbar>
            </AppBar>
            <TabPanel value={value} index={0}>
              <BarGroup dataset={datasetTransformed} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PCAPanel
                dataset={datasetSelected}
                datasetTransformed={datasetTransformed}
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
