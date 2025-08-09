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
    const val1 = matrix.rows[i].data[nodeId];
    if (val1 != -Infinity && val1 != Infinity) {
      incomingAndOutgoing.Incoming.push(i);
    }
    const val2 = matrix.rows[nodeId].data[i];
    if (val2 != -Infinity && val2 != Infinity) {
      incomingAndOutgoing.outgoing.push(i);
    }
  }

  return incomingAndOutgoing;
}

export function indexOfMaxInColumn(
  column: number,
  matrix: IMatrix,
  excludeIndex?: number[]
): number {
  let max: number = -Infinity;
  let indexOfMax: number = -1;
  for (let i = 0; i < matrix.rows.length; i++) {
    if (!excludeIndex?.includes(i)) {
      const currentVal = matrix.rows[i].data[column];
      if (Math.max(currentVal, max) == currentVal) {
        max = currentVal;
        indexOfMax = i;
      }
    }
  }

  return indexOfMax;
}

export function indexOfMinInColumn(
  column: number,
  matrix: IMatrix,
  exclude?: number[]
): number {
  let min: number = Infinity;
  let indexOfMin: number = -1;
  for (let i = 0; i < matrix.rows.length; i++) {
    const currentVal = matrix.rows[i].data[column];
    if (exclude?.includes(currentVal)) {
      continue;
    } else if (Math.min(currentVal, min) == currentVal) {
      indexOfMin = min != currentVal ? i : indexOfMin;
      min = currentVal;
    }
  }

  return indexOfMin;
}

export function transposedOfMatrix(matrix: IMatrix): IMatrix {
  const length = matrix.rows.length;
  let transposedMatrix: IMatrix = _.cloneDeep(matrix);
  for (let rowIndex = 0; rowIndex < length; rowIndex++) {
    for (let colIndex = 0; colIndex < length; colIndex++) {
      transposedMatrix.rows[colIndex].data[rowIndex] =
        matrix.rows[rowIndex].data[colIndex];
    }
  }

  return transposedMatrix;
}

export function demoucron(isMin: boolean, initMatrix: IMatrix): IMatrix[] {
  const matrixList: IMatrix[] = [];
  matrixList.push(initMatrix);
  matrixList[0].title = "Matrice D1";

  for (let i = 0; i < initMatrix.rows.length; i++) {
    const previousMatrix = matrixList[matrixList.length - 1];
    const edgeOfThisNode = getEdgeOfNode(i, previousMatrix);
    const isValid_K =
      edgeOfThisNode.Incoming.length > 0 && edgeOfThisNode.outgoing.length > 0;

    if (isValid_K) {
      const nextMatrix: IMatrix = _.cloneDeep(previousMatrix);
      nextMatrix.title = `Matrice D${matrixList.length + 1}`;
      edgeOfThisNode.Incoming.forEach((incoming) => {
        edgeOfThisNode.outgoing.forEach((outgoing) => {
          const distance =
            previousMatrix.rows[incoming].data[edgeOfThisNode.nodeId] +
            previousMatrix.rows[edgeOfThisNode.nodeId].data[outgoing];

          const val = isMin
            ? Math.min(distance, previousMatrix.rows[incoming].data[outgoing])
            : Math.max(distance, previousMatrix.rows[incoming].data[outgoing]);
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

  let coordonate: { row: number; col: number } = {
    row: fromIndex,
    col: toIndex,
  };
  const excludeIndex: number[] = [fromIndex];

  while (path[path.length - 1] != toIndex) {
    const isDirectPath =
      firstMatrix.rows[coordonate.row].data[toIndex] ==
      lastMatrix.rows[coordonate.row].data[toIndex];
    if (isDirectPath) {
      path.push(toIndex);
      break;
    }
    const index = indexOfMaxInColumn(toIndex, lastMatrix, excludeIndex);
    if (index == -1) {
      path.push(toIndex);
      break;
    }

    const result =
      lastMatrix.rows[coordonate.row].data[toIndex] -
      lastMatrix.rows[index].data[toIndex];

    for (const row of lastMatrix.rows) {
      if (row.data[index] == result) {
        if (firstMatrix.rows[path[path.length - 1]].data[index] != -Infinity) {
          path.push(index);
          coordonate.row = index;
          break;
        }
      }
    }
    excludeIndex.push(index);
  }

  return path;
}
