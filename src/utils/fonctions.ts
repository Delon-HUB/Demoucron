import _ from "lodash";
import {
  IMatrix as IMatrix,
  INodeIncomingAndOutgoingEdge,
} from "../Models/table";

export function getEdgeOfNode(
  nodeId: number,
  matrix: IMatrix
): INodeIncomingAndOutgoingEdge {
  const incomingAndOutgoing: INodeIncomingAndOutgoingEdge = {
    nodeId: nodeId,
    Incoming: [],
    outgoing: [],
  };

  for (
    let indexOfColumn = 0;
    indexOfColumn < matrix.rows[nodeId].data.length;
    indexOfColumn++
  ) {
    if (matrix.rows[nodeId].data[indexOfColumn] != Infinity) {
      incomingAndOutgoing.outgoing.push(indexOfColumn);
    }
  }

  if (incomingAndOutgoing.outgoing.length > 0) {
    for (let indexOfRow = 0; indexOfRow < matrix.rows.length; indexOfRow++) {
      if (matrix.rows[indexOfRow].data[nodeId] != Infinity) {
        incomingAndOutgoing.Incoming.push(indexOfRow);
      }
    }
  }

  return incomingAndOutgoing;
}

export function demoucronMin(initMatrix: IMatrix): IMatrix[] {
  const matrixList: IMatrix[] = [];
  matrixList.push(initMatrix);

  for (let i = 0; i < initMatrix.rows.length; i++) {
    const lastMatrix = matrixList[matrixList.length - 1];
    const edgeOfThisNode = getEdgeOfNode(i, lastMatrix);
    if (
      edgeOfThisNode.Incoming.length > 0 &&
      edgeOfThisNode.outgoing.length > 0
    ) {
      const nextMatrix: IMatrix = _.cloneDeep(lastMatrix);

      edgeOfThisNode.Incoming.forEach((incoming) => {
        edgeOfThisNode.outgoing.forEach((outgoing) => {
          const w =
            lastMatrix.rows[incoming].data[edgeOfThisNode.nodeId] +
            lastMatrix.rows[edgeOfThisNode.nodeId].data[outgoing];

          const min = Math.min(w, lastMatrix.rows[incoming].data[outgoing]);
          nextMatrix.rows[incoming].data[outgoing] = min;
        });
      });

      matrixList.push(nextMatrix);
    }
  }

  return matrixList;
}
