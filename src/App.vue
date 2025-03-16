<template>
  <div>
    <q-btn @click="min">Min</q-btn>
  </div>
  <div>
    <q-layout view="hHh Lpr lff" container class="shadow-2 layout">
      <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            @click="drawer = !drawer"
            round
            dense
            icon="visibility"
            class="text-bold"
            :label="drawer ? 'Cacher la démarche' : 'Voir la démarche'"
          />
          <q-toolbar-title class="text-bold text-center"
            >Algorithme Demourcon</q-toolbar-title
          >
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" show-if-above :width="900">
        <q-scroll-area class="fit">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple v-for="i in matrixList.length">
              <div v-if="matrixList.length == 1">
                <CustomTable :matrix="matrixList[i - 1]" />
              </div>
              <div class="row" v-if="matrixList[i]">
                <div class="col">
                  <CustomTable :matrix="matrixList[i - 1]" />
                </div>
                <div class="col">
                  <CustomTable :matrix="matrixList[i]" />
                </div>
              </div>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page>
          <div class="graphContainer">
            <VueFlow :nodes="nodeList">
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
import { Node, useVueFlow, VueFlow } from "@vue-flow/core";
import CustomNode from "./components/CustomNode.vue";
import { ref } from "vue";
import { Background } from "@vue-flow/background";
import { IMatrix, IRow } from "./Models/table";
import CustomTable from "./components/CustomTable.vue";
import { demoucronMin } from "./utils/fonctions";

const drawer = ref(false);
const matrixList = ref<IMatrix[]>([]);

function min() {
  matrixList.value = demoucronMin(createInitialMatrix());
  matrixList.value.forEach(
    (matrix, index) => (matrix.title = `Matrice D${index + 1}`)
  );
}

const { onConnect, addEdges, getNodes, getEdges, onNodesChange } = useVueFlow();
const nodeCompter = ref(0);

const nodeList = ref<Node[]>([]);

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

  nodeList.value.push(newNode);
}

onConnect((params) => {
  const val = parseInt(prompt("Valeur de l'arc") || "invalid");
  if (val && val > 0) {
    addEdges({
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

onNodesChange((param) => {
  param.forEach((node) => {
    if (node.type === "remove") {
      nodeList.value.splice(
        nodeList.value.findIndex((n) => n.id == node.id),
        1
      );
    }
  });
});

function createInitialMatrix() {
  const edges = getEdges.value;
  const nodes = getNodes.value;

  const rows: IRow[] = nodes.map((node) => {
    const edgesFound = edges.filter((edge) => edge.sourceNode == node);
    const row: IRow = {
      data: [],
    };

    edgesFound.forEach((ed) => {
      const index = nodeList.value.findIndex(
        (nod) => ed.targetNode.id == nod.id
      );
      row.data[index] = parseInt(ed.label?.toString() || "invalid");
    });

    for (let i = 0; i < nodes.length; i++) {
      if (!row.data[i]) row.data[i] = Infinity;
    }

    return row;
  });

  return {
    title: "",
    rows: rows,
  };
}
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
  background: linear-gradient(to right, #eed991, #ccf7f4);
}

.layout {
  width: 100vw;
  height: 100vh;
}
</style>
