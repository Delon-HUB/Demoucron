import _ from "lodash";
import {
  IMatrix,
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

  for (let i = 0; i < matrix.rows.length; i++) {
    if (matrix.rows[i].data[nodeId] != (Infinity | -Infinity)) {
      incomingAndOutgoing.Incoming.push(i);
    }
    if (matrix.rows[nodeId].data[i] != (Infinity | -Infinity)) {
      incomingAndOutgoing.outgoing.push(i);
    }
  }

  return incomingAndOutgoing;
}

export function demoucron(isMin: boolean, initMatrix: IMatrix): IMatrix[] {
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

          const val = isMin
            ? Math.min(w, lastMatrix.rows[incoming].data[outgoing])
            : Math.max(w, lastMatrix.rows[incoming].data[outgoing]);
          nextMatrix.rows[incoming].data[outgoing] = val;
        });
      });

      matrixList.push(nextMatrix);
    }
  }
  return matrixList;
}
