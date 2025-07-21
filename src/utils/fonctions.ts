import _ from "lodash";
import { IMatrix, INodeIncomingAndOutgoingEdge } from "../Models/table";

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

export function indexOfMaxInColumn(
  column: number,
  matrix: IMatrix,
  exclude?: number[]
): number {
  let max: number = -Infinity;
  let indexOfMax: number = -1;
  for (let i = 0; i < matrix.rows.length; i++) {
    const currentVal = matrix.rows[i].data[column];
    if (exclude?.includes(currentVal)) {
      continue;
    } else if (Math.max(currentVal, max) == currentVal) {
      max = currentVal;
      indexOfMax = i;
    }
  }

  return indexOfMax;
}

export function demoucron(isMin: boolean, initMatrix: IMatrix): IMatrix[] {
  const matrixList: IMatrix[] = [];
  matrixList.push(initMatrix);
  matrixList[0].title = "Matrice D1";

  for (let i = 0; i < initMatrix.rows.length; i++) {
    const lastMatrix = matrixList[matrixList.length - 1];
    const edgeOfThisNode = getEdgeOfNode(i, lastMatrix);
    if (
      edgeOfThisNode.Incoming.length > 0 &&
      edgeOfThisNode.outgoing.length > 0
    ) {
      const nextMatrix: IMatrix = _.cloneDeep(lastMatrix);
      nextMatrix.title = `Matrice D${i + 1}`;
      edgeOfThisNode.Incoming.forEach((incoming) => {
        edgeOfThisNode.outgoing.forEach((outgoing) => {
          const distance =
            lastMatrix.rows[incoming].data[edgeOfThisNode.nodeId] +
            lastMatrix.rows[edgeOfThisNode.nodeId].data[outgoing];

          const val = isMin
            ? Math.min(distance, lastMatrix.rows[incoming].data[outgoing])
            : Math.max(distance, lastMatrix.rows[incoming].data[outgoing]);
          nextMatrix.rows[incoming].data[outgoing] = val;
        });
      });

      matrixList.push(nextMatrix);
    }
  }

  return matrixList;
}

export function searchMinPath(
  fromIndex: number,
  toIndex: number,
  lastMatrix: IMatrix
): number[] {
  let path: number[] = [toIndex];

  const pathLength = lastMatrix.rows[fromIndex].data[toIndex];
  const isAccessible = pathLength && pathLength != (Infinity || -Infinity);
  if (!isAccessible) return [];

  while (path[0] != fromIndex) {
    let min = Infinity;
    let predecessor = path[0];

    for (let i = 0; i < lastMatrix.rows.length; i++) {
      const val = lastMatrix.rows[i].data[path[0]];
      let minTmp = Math.min(val, min);
      if (minTmp != Infinity && minTmp != min) {
        min = minTmp;
        predecessor = i;
      }
    }

    if (min == Infinity) break;

    path.unshift(predecessor);
  }

  return path;
}

export function searchMaxPath(
  fromIndex: number,
  toIndex: number,
  firstMatrix: IMatrix,
  lastMatrix: IMatrix
) {
  let path: number[] = [fromIndex];
  const isAccessible = lastMatrix.rows[fromIndex].data[toIndex] != -Infinity;
  if (!isAccessible) return [];
  const excludes: number[] = [
    -Infinity,
    lastMatrix.rows[fromIndex].data[toIndex],
  ];

  let coordonate: { row: number; col: number } = {
    row: fromIndex,
    col: toIndex,
  };

  while (path[0] != toIndex) {
    const isDirectPath =
      firstMatrix.rows[coordonate.row].data[toIndex] ==
      lastMatrix.rows[coordonate.row].data[toIndex];
    if (isDirectPath) {
      path.push(toIndex);
      break;
    }

    const index = indexOfMaxInColumn(toIndex, lastMatrix, excludes);
    if (index == -1) {
      path.push(toIndex);
      break;
    }
    const max = lastMatrix.rows[index].data[toIndex];
    excludes.push(max);

    const result =
      lastMatrix.rows[coordonate.row].data[toIndex] -
      lastMatrix.rows[index].data[toIndex];

    for (const row of lastMatrix.rows) {
      if (row.data[index] == result) {
        path.push(index);
        coordonate.row = index;
        break;
      }
    }
  }
  return path;
}
