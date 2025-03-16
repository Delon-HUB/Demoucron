<!-- <template>
  <q-list padding class="menu-list">
    <q-item clickable v-ripple v-for="i in matrixs.length">
      <div class="row">
        <div class="col">
          <CustomTable :matrix="matrixs[i - 1]" />
        </div>
        <div class="col">
          <CustomTable :matrix="matrixs[i]" />
        </div>
      </div>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { IMatrix } from "../Models/table";
import CustomTable from "./CustomTable.vue";
import { getNodeHaveIncomingAndOutgoingEdge } from "../utils/fonctions";
import _ from "lodash";

const props = defineProps<{ initMatrix: IMatrix }>();
const emits = defineEmits(["nextMatrix"]);

const nextMatrix: IMatrix = _.cloneDeep(props.initMatrix);

const listMatrix = demoucronMin(props.initMatrix);

watch(
  () => props.initMatrix.rows,
  () => {
    console.log("changement détecté");
  }
);

function demoucronMin(initMatrix: IMatrix): IMatrix[] {
  const matrixList: IMatrix[] = [initMatrix];
  const listKNode = getNodeHaveIncomingAndOutgoingEdge(initMatrix);

  for (let i = 0; i < listKNode.length; i++) {
    const nextMatrix: IMatrix = _.cloneDeep(matrixList[i]);
    listKNode[i].Incoming.forEach((incoming) => {
      listKNode[i].outgoing.forEach((outgoing) => {
        const w =
          matrixList[i].rows[incoming].data[listKNode[i].nodeId] +
          matrixList[i].rows[listKNode[i].nodeId].data[outgoing];

        const min = Math.min(w, matrixList[i].rows[incoming].data[outgoing]);
        nextMatrix.rows[incoming].data[outgoing] = min;

      });
    });
    matrixList.push(nextMatrix);
  }
  console.log(listKNode);

  return matrixList;
}
</script> -->
