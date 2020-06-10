export interface DatasetsRequest {
  data: LightDataset[];
}

export interface DatasetRequest {
  data: Dataset;
}

export interface Dataset extends LightDataset {
  logs: Log[];
  twoFirstComponentsPlot:string
  componentsAndFeaturesPlot :string
  explainedVarianceRatio: number[]
}

export interface LightDataset {
  id: number;
  date: number;
  name: string;
}

export interface Log {
  id: number;
  time: number;
  records: Record[];
}

// TODO: set to SensorPID enum when the api be ready
export interface Record {
  id: number;
  value: number;
  sensorPID: string;
}

export enum SensorPID {
  EngineRPM = "ENGINE_RPM",
  VehicleSpeed = "VEHICLE_SPEED",
  Throttle = "THROTTLE",
  EngineLoad = "ENGINE_LOAD",
  CoolantTemperature = "COOLANT_TEMPERATURE",
  LongTermFuelTrimBank1 = "LONG_TERM_FUEL_TRIM_BANK_1",
  ShortTermFuelTrimBank1 = "SHORT_TERM_FUEL_TRIM_BANK_1",
  IntakeManifoldPressure = "INTAKE_MANIFOLD_PRESSURE",
  FuelTank = "FUEL_TANK",
  AbsoluteThrottleB = "ABSOLUTE_THROTTLE_B",
  PedalD = "PEDAL_D",
  PedalE = "PEDAL_E",
  CommandThrottleActuator = "COMMAND_THROTTLE_ACTUATOR",
  FuelAirCommandedEquivRatio = "FUEL_AIR_COMMANDED_EQUIV_RATIO",
  AbsoluteBarometricPressure = "ABSOLUTE_BAROMETRIC_PRESSURE",
  RelativeThrottlePosition = "RELATIVE_THROTTLE_POSITION",
  IntakeAirTemp = "INTAKE_AIR_TEMP",
  TimingAdvance = "TIMING_ADVANCE",
  CatalystTemperatureBank1Sensor1 = "CATALYST_TEMPERATURE_BANK1_SENSOR1",
  CatalystTemperatureBank1Sensor2 = "CATALYST_TEMPERATURE_BANK1_SENSOR2",
  ControlModuleVoltage = "CONTROL_MODULE_VOLTAGE",
  CommandedEvaporativePurge = "COMMANDED_EVAPORATIVE_PURGE",
  TimeRunWithMilOn = "TIME_RUN_WITH_MIL_ON",
  TimeSinceTroubleCodesCleared = "TIME_SINCE_TROUBLE_CODES_CLEARED",
  DistanceTraveledWithMilOn = "DISTANCE_TRAVELED_WITH_MIL_ON",
  WarmUpsSinceCodesCleared = "WARM_UPS_SINCE_CODES_CLEARED",
}

export interface Sensor {
  id: number;
  pid: string;
  description: string;
  measureUnit: string;
}
