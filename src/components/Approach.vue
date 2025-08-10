<template>
  <q-scroll-area class="fit">
    <q-list padding class="menu-list">
      <q-item clickable v-ripple v-for="i in matrixList.length">
        <q-card v-if="matrixList[i]" flat>
          <q-card-section>
            <div>
              <div class="row">
                <div class="col">
                  <Matrix :data="matrixList[i - 1]" />
                </div>
                <div class="col">
                  <Matrix :data="matrixList[i]" />
                </div>
              </div>
              <div class="row q-mt-md">
                <span style="text-decoration: underline">K = {{ i + 1 }}</span>

                <div class="col">
                  <ul v-for="incoming in k_list[i - 1].Incoming">
                    <li v-for="outgoing in k_list[i - 1].outgoing">
                      <p>
                        W<sup>({{ i }})</sup
                        ><sub>{{ incoming + 1 }}/{{ outgoing + 1 }}</sub> = V
                        <sup>({{ i }})</sup
                        ><sub
                          >{{ incoming + 1 }}/{{
                            k_list[i - 1].nodeId + 1
                          }}</sub
                        >
                        + V <sup>({{ i }})</sup
                        ><sub
                          >{{ k_list[i - 1].nodeId + 1 }}/{{
                            outgoing + 1
                          }}</sub
                        >
                        =
                        {{
                          matrixList[i - 1].rows[incoming].data[
                            k_list[i - 1].nodeId
                          ]
                        }}
                        +
                        {{
                          matrixList[i - 1].rows[k_list[i - 1].nodeId].data[
                            outgoing
                          ]
                        }}
                        =
                        {{
                          matrixList[i - 1].rows[incoming].data[
                            k_list[i - 1].nodeId
                          ] +
                          matrixList[i - 1].rows[k_list[i - 1].nodeId].data[
                            outgoing
                          ]
                        }}
                      </p>
                    </li>
                  </ul>
                </div>
                <div class="col">
                  <ul v-for="incoming in k_list[i - 1].Incoming">
                    <li v-for="outgoing in k_list[i - 1].outgoing">
                      <p>
                        V<sup>({{ i + 1 }})</sup
                        ><sub>{{ incoming + 1 }}/{{ outgoing + 1 }}</sub> =
                        {{ props.isMin ? "Min" : "Max" }} (W<sup>({{ i }})</sup
                        ><sub
                          >{{ incoming + 1 }}/{{
                            k_list[i - 1].nodeId + 1
                          }}</sub
                        >
                        , V<sup>({{ i }})</sup
                        ><sub
                          >{{ k_list[i - 1].nodeId + 1 }}/{{
                            outgoing + 1
                          }}</sub
                        >) = {{ props.isMin ? "Min" : "Max" }} ({{
                          matrixList[i - 1].rows[incoming].data[
                            k_list[i - 1].nodeId
                          ] +
                          matrixList[i - 1].rows[k_list[i - 1].nodeId].data[
                            outgoing
                          ]
                        }}
                        , {{ matrixList[i - 1].rows[incoming].data[outgoing] }})
                        =
                        {{
                          props.isMin
                            ? Math.min(
                                matrixList[i - 1].rows[incoming].data[
                                  k_list[i - 1].nodeId
                                ] +
                                  matrixList[i - 1].rows[k_list[i - 1].nodeId]
                                    .data[outgoing],
                                matrixList[i - 1].rows[incoming].data[outgoing]
                              )
                            : Math.max(
                                matrixList[i - 1].rows[incoming].data[
                                  k_list[i - 1].nodeId
                                ] +
                                  matrixList[i - 1].rows[k_list[i - 1].nodeId]
                                    .data[outgoing],
                                matrixList[i - 1].rows[incoming].data[outgoing]
                              )
                        }}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col" v-if="matrixList.length == 1">
              <Matrix :data="matrixList[i - 1]" />
            </div>
          </q-card-section>
        </q-card>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { IMatrix, INodeIncomingAndOutgoingEdge } from "../Models/table";
import { getEdgeOfNode } from "../utils/fonctions";
import _ from "lodash";
import Matrix from "./Matrix.vue";

const props = defineProps<{ isMin: boolean; firstMatrix: IMatrix }>();
const emits = defineEmits(["finished"]);
const matrixList = ref<IMatrix[]>([props.firstMatrix]);
const k_list = ref<INodeIncomingAndOutgoingEdge[]>([]);

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
      k_list.value.push(edgeOfThisNode);
      matrixList.push(nextMatrix);
    }
  }
  return matrixList;
}
</script>
