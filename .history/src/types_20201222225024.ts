export interface Message {
  type: string;
  payload: any;
}

export enum Tabs {
  Current = 'current',
  All = 'all',
}
