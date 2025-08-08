<template>
  <div>
    <q-layout view="hHh Lpr lff" container class="shadow-2 layout">
      <q-header class="header">
        <q-toolbar>
          <q-toolbar-title class="text-bold text-right text-uppercase">
            <div class="text-left">
              <q-avatar>
                <img alt="brain icon" src="/src/assets/brain_icon.png" />
              </q-avatar>
              <span class="title-princ text-h5">Algorithme de Demoucron</span>
              <div class="q-pr-md text-white">
                <q-btn-group flat>
                  <q-btn
                    @click="drawer = !drawer"
                    round
                    dense
                    icon="visibility"
                    class="text-bold"
                    :label="drawer ? 'Cacher la démarche' : 'Voir la démarche'"
                    no-caps
                  />
                  <q-btn
                    class="text-bold"
                    no-caps
                    label="Minimum"
                    icon="arrow_downward"
                    @click="solve(true)"
                  />
                  <q-btn
                    class="text-bold"
                    no-caps
                    label="Maximum"
                    icon="arrow_upward"
                    @click="solve(false)"
                  />
                </q-btn-group>
              </div>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" show-if-above :width="900">
        <q-scroll-area class="fit approach">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple v-for="i in matrixList.length">
              <div class="row" v-if="matrixList[i]">
                <div class="col">
                  <Matrix :data="matrixList[i - 1]" />
                </div>
                <div class="col">
                  <Matrix :data="matrixList[i]" />
                </div>
              </div>
              <div class="col" v-if="matrixList.length == 1">
                <Matrix :data="matrixList[i - 1]" />
              </div>
            </q-item>
            <div
              class="row"
              v-if="transposedMatrixInitial && transposedMatrixFinal"
            >
              <div class="col">
                <Matrix :data="transposedMatrixInitial" />
              </div>
              <div class="col">
                <Matrix :data="transposedMatrixFinal" />
              </div>
            </div>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page>
          <div class="graphContainer">
            <VueFlow>
              <Background class="background" />
              <template #node-custom="props">
                <CustomNode v-bind="props" />
              </template>
            </VueFlow>
          </div>
          <div class="btnAdd">
            <q-btn
              round
              size="18px"
              class="btn text-bold"
              icon="add"
              color="white"
              text-color="blue"
              @click="generateNode"
            />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { useVueFlow, VueFlow } from "@vue-flow/core";
import CustomNode from "./components/CustomNode.vue";
import { ref } from "vue";
import { Background } from "@vue-flow/background";
import { IMatrix, IRow } from "./Models/table";
import Matrix from "./components/Matrix.vue";
import {
  demoucron,
  searchMaxPath,
  searchMinPath,
  transposedOfMatrix,
} from "./utils/fonctions";

const drawer = ref(false);
const matrixList = ref<IMatrix[]>([]);

const { onConnect, addEdges, addNodes, getNodes, getEdges } = useVueFlow();
const nodeCompter = ref(0);

function generateNode() {
  const newNode = {
    id: `${++nodeCompter.value}`,
    type: "custom",
    position: {
      x: Math.round(Math.random() * 500),
      y: Math.round(Math.random() * 500),
    },
    data: { label: `X${nodeCompter.value}` },
  };

  addNodes(newNode);
}

function example() {
  for (let i = 0; i < 12; i++) generateNode();
  connect(getNodes.value[0].id, getNodes.value[1].id, 3);
  connect(getNodes.value[0].id, getNodes.value[3].id, 9);
  connect(getNodes.value[0].id, getNodes.value[2].id, 3);

  connect(getNodes.value[1].id, getNodes.value[4].id, 9);
  connect(getNodes.value[1].id, getNodes.value[3].id, 7);
  connect(getNodes.value[1].id, getNodes.value[5].id, 1);

  connect(getNodes.value[2].id, getNodes.value[3].id, 2);
  connect(getNodes.value[2].id, getNodes.value[6].id, 2);

  connect(getNodes.value[3].id, getNodes.value[4].id, 2);
  connect(getNodes.value[3].id, getNodes.value[7].id, 3);
  connect(getNodes.value[3].id, getNodes.value[5].id, 3);
  connect(getNodes.value[3].id, getNodes.value[6].id, 1);

  connect(getNodes.value[4].id, getNodes.value[7].id, 5);

  connect(getNodes.value[5].id, getNodes.value[7].id, 4);
  connect(getNodes.value[5].id, getNodes.value[8].id, 2);
  connect(getNodes.value[5].id, getNodes.value[9].id, 5);

  connect(getNodes.value[6].id, getNodes.value[5].id, 5);
  connect(getNodes.value[6].id, getNodes.value[9].id, 3);
  connect(getNodes.value[6].id, getNodes.value[10].id, 11);

  connect(getNodes.value[7].id, getNodes.value[8].id, 6);

  connect(getNodes.value[8].id, getNodes.value[11].id, 8);
  connect(getNodes.value[8].id, getNodes.value[9].id, 2);

  connect(getNodes.value[9].id, getNodes.value[11].id, 4);

  connect(getNodes.value[10].id, getNodes.value[9].id, 4);
  connect(getNodes.value[10].id, getNodes.value[11].id, 5);
}
example();

function createInitialMatrix(isMin: boolean) {
  const nodes = getNodes.value;
  const edges = getEdges.value;

  const rows: IRow[] = nodes.map((node) => {
    const outgoingEdge = edges.filter((edge) => edge.sourceNode == node);
    const row: IRow = {
      name: `X${node.id}`,
      data: [],
    };
    outgoingEdge.forEach((ed) => {
      const index = getNodes.value.findIndex(
        (nod) => ed.targetNode.id == nod.id
      );
      row.data[index] = parseInt(ed.label?.toString() || "invalid");
    });

    if (isMin) {
      for (let i = 0; i < nodes.length; i++) {
        if (!row.data[i]) row.data[i] = Infinity;
      }
    } else {
      for (let i = 0; i < nodes.length; i++) {
        if (!row.data[i]) row.data[i] = -Infinity;
      }
    }

    return row;
  });

  return {
    title: "Matrice D1",
    rows: rows,
  };
}
const transposedMatrixInitial = ref<IMatrix>();
const transposedMatrixFinal = ref<IMatrix>();

function solve(isMin: boolean) {
  getEdges.value.forEach((edge) => {
    edge.style = { strokeWidth: 6 };
  });
  const initMatrix = createInitialMatrix(isMin);
  matrixList.value = demoucron(isMin, initMatrix);

  let path: number[] = [];
  if (isMin)
    path = searchMinPath(
      0,
      getNodes.value.length - 1,
      matrixList.value[matrixList.value.length - 1]
    );
  else
    path = searchMaxPath(
      0,
      getNodes.value.length - 1,
      matrixList.value[0],
      matrixList.value[matrixList.value.length - 1]
    );
  // transposedMatrixInitial.value = transposedOfMatrix(matrixList.value[0]);
  // transposedMatrixFinal.value = transposedOfMatrix(
  //   matrixList.value[matrixList.value.length - 1]
  // );
  // console.log("cjfaskdlfjalfdkjalk");

  for (let i = 0; i < path.length; i++) {
    const edge = getEdges.value.find(
      (edge) => edge.id == `${path[i] + 1}->${path[i + 1] + 1}`
    );
    if (edge) edge.style = { strokeWidth: 6, stroke: "#3498db" };
  }
}

function connect(from: string, to: string, val: number) {
  addEdges({
    id: `${from}->${to}`,
    source: from,
    target: to,
    data: {
      label: val.toString(),
    },
    style: { strokeWidth: 6 },
    type: "simplebezier",
    label: val.toString(),
    animated: true,
    labelStyle: {
      fontSize: "16px",
    },
  });
}

onConnect((params) => {
  const val = parseInt(prompt("Valeur de l'arc") || "invalid");
  if (val && val > 0) {
    addEdges({
      id: `${params.source}->${params.target}`,
      ...params,
      style: { strokeWidth: 6 },
      type: "simplebezier",
      label: val.toString(),
      animated: true,
      labelStyle: {
        fontSize: "16px",
      },
    });
  }
});
</script>

<style scoped>
.btn {
  background: linear-gradient(to right, #2b0948, #440f50);
  box-shadow: 2px 3px 10px black;
}
.btnAdd {
  position: fixed;
  bottom: 32px;
  right: 32px;
}

.graphContainer {
  background-color: whitesmoke;
  width: 100vw;
  height: 100vh;
}

.background {
  /* background: linear-gradient(to right, #eed991, #ccf7f4); */
  background: whitesmoke;
}

.layout {
  width: 100vw;
  height: 100vh;
}

.header {
  background: linear-gradient(to right, #295270, #524175);
}

.title-princ {
  background-image: linear-gradient(to right, #fcef64, #fcc44b, #f20089);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
