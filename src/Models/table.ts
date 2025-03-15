export interface IRow {
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

export interface ICoordonate {
  x: number;
  y: number;
}
