export enum ReportTypes {
  METAR = 'METAR',
  TAF = 'TAF_LONGTAF',
  SIGMET = 'SIGMET',
}

export const wordValidationRegex = /^[A-Z]+( [A-Z]+)*$/;
export const QUERY_TYPE = 'query';
