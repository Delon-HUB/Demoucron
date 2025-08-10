<template>
  <div>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis
    itaque eligendi dolore nemo iste, harum labore dolores nesciunt, doloremque
    ipsam voluptas aliquam! Perferendis molestias explicabo iste placeat animi?
    Vel, modi.
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { IMatrix } from "../Models/table";
import { getEdgeOfNode } from "../utils/fonctions";
import _ from "lodash";

const props = defineProps<{ isMin: boolean; firstMatrix: IMatrix }>();
const emits = defineEmits(["finished"]);
const matrixList = ref<IMatrix[]>([props.firstMatrix]);

watch(
  () => props.isMin,
  () => {
    matrixList.value = solve(props.isMin, props.firstMatrix);
    emits("finished", matrixList.value);
  }
);

function solve(isMin: boolean, firstMatrix: IMatrix) {
  const matrixList: IMatrix[] = [firstMatrix];
  matrixList[0].title = "Matrice D1";

  for (let i = 0; i < firstMatrix.rows.length; i++) {
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
</script>
