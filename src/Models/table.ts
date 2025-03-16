export interface IRow {
  rowName?: string[];
  data: number[];
}

export interface IMatrix {
  title: string;
  rows: IRow[];
}

export interface INodeIncomingAndOutgoingEdge {
  nodeId: number;
  Incoming: number[];
  outgoing: number[];
}
