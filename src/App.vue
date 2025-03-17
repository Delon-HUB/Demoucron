<template>
  <div>
    <q-layout view="hHh Lpr lff" container class="shadow-2 layout">
      <q-header class="header">
        <q-toolbar>
          <q-toolbar-title class="text-bold text-right text-uppercase">
            <div class="text-left">
              <q-avatar>
                <img src="/src/assets/brain_icon.png" />
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
                    @click="min"
                  />
                  <q-btn
                    class="text-bold"
                    no-caps
                    label="Maximum"
                    icon="arrow_upward"
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
import { Edge, Node, useVueFlow, VueFlow } from "@vue-flow/core";
import CustomNode from "./components/CustomNode.vue";
import { ref } from "vue";
import { Background } from "@vue-flow/background";
import { IMatrix, IRow } from "./Models/table";
import CustomTable from "./components/CustomTable.vue";
import { demoucronMin } from "./utils/fonctions";

const model = ref(null);
const options = ref(["Google", "Facebook", "Twitter", "Apple", "Oracle"]);

const drawer = ref(false);
const matrixList = ref<IMatrix[]>([]);

const { onConnect, addEdges, getNodes, getEdges, onNodesChange } = useVueFlow();
const nodeCompter = ref(0);
const nodeList = ref<Node[]>([]);

function min() {
  getEdges.value.forEach((edge) => {
    edge.style = { strokeWidth: 6 };
  });

  matrixList.value = demoucronMin(createInitialMatrix());
  let rowsName: string[] = nodeList.value.map((node) => node.data.label);

  matrixList.value.forEach((matrix, index) => {
    matrix.title = `Matrice D${index + 1}`;
    matrix.rows.forEach((row) => (row.rowName = rowsName));
  });

  const paths = searchPath(
    nodeList.value[0],
    nodeList.value[nodeList.value.length - 1]
  );

  paths.forEach((edge) => {
    const found = getEdges.value.find((ed) => ed.id == edge.id);
    if (found) found.style = { strokeWidth: 6, stroke: "greenyellow" };
  });
}

function searchPath(from: Node, to: Node): Edge[] {
  const lastMatrix = matrixList.value[matrixList.value.length - 1];
  const firstMatrix = matrixList.value[0];
  const pathNode: Node[] = [to];
  const edgePath: Edge[] = [];

  const sourceIndex = nodeList.value.findIndex((node) => node.id == from.id);
  let destIndex = nodeList.value.findIndex((node) => node.id == to.id);

  let lengthOfDestination = lastMatrix.rows[sourceIndex].data[destIndex];
  if (lengthOfDestination && lengthOfDestination != Infinity) {
    while (pathNode[0] != from) {
      destIndex = nodeList.value.findIndex(
        (node) => node.id == pathNode[0]?.id
      );

      const isDirectPath =
        firstMatrix.rows[sourceIndex].data[destIndex] ==
        lastMatrix.rows[sourceIndex].data[destIndex];

      console.log("dest index = " + destIndex);
      console.log("Direct path: " + isDirectPath);

      if (isDirectPath) {
        pathNode.unshift(from);
      } else {
        let minVal: { rowId: number; val: number } = {
          rowId: -1,
          val: Infinity,
        };

        for (let i = 0; i < lastMatrix.rows.length; i++) {
          const currentVal: number = lastMatrix.rows[i].data[destIndex];
          if (Math.min(minVal.val, currentVal) == currentVal) {
            minVal.val = currentVal;
            minVal.rowId = i;
          }
        }
        pathNode.unshift(nodeList.value[minVal.rowId]);
        console.log(pathNode.map((node) => node.data.label).join(" => "));
      }
    }

    getEdges.value.forEach((ed) => {
      for (let i = 0; i < pathNode.length; i++) {
        if (
          ed.sourceNode?.id == pathNode[i]?.id &&
          ed.targetNode?.id == pathNode[i + 1]?.id
        )
          edgePath.push(ed);
        console.log(ed.sourceNode.data?.label + " => ");
      }
    });
  }
  return edgePath;
}

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
