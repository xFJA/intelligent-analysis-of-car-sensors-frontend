export interface Dataset {
  id: number;
  date: number;
  logs: Log[];
}

export interface Log {
  id: number;
  time: number;
  records: Record[];
}

// TODO: create enum for sensorPID
export interface Record {
  id: number;
  value: number;
  sensorPID: string;
}

export interface Sensor {
  id: number;
  pid: string;
  description: string;
  measureUnit: string;
}
