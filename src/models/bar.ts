export interface Record {
  logID: number;
  [key: string]: number;
  // TODO: remove this duplicate property
  value: number; 
}
