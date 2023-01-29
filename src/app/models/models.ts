import { ReportTypes } from "../constants/constants";

export interface Params {
  id: string;
  reportTypes: string[];
  stations: string[];  // TODO stations
  countries: string[];
}

export interface IBLRequest {
  id: string;
  method: string;
  params: Params[];
}

export interface Result {
  placeId: string;
  queryType: ReportTypes | any; // TODO
  receptionTime: string; // todo date ?
  refs: string[];
  reportTime: string;
  reportType: ReportTypes;
  revision: string;
  stationId: string;
  text: string;
  textHTML: string;
}

export interface IBLResponse {
  error: any; // TODO
  id: string;
  result: Result[];
}
