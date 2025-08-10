<template>
  <div
    :class="props.data.active ? 'circle-node active' : 'circle-node not-active'"
  >
    <div :class="props.data.active ? 'label label-active' : 'label'">
      {{ props.data.label }}
    </div>

    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";

const props = defineProps<NodeProps>();
</script>

<style scoped>
@import "@vue-flow/core/dist/style.css";

.circle-node {
  width: 52px;
  height: 52px;
  border-radius: 360px;
  border: 4px solid gray;
  background-color: #f9f5ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active {
  border: 4px solid #FA812F;
}

.not-active {
  border: 4px solid gray;
}

.label-active {
  color: #24243e;
}

.label {
  color: black;
  text-align: center;
  text-transform: uppercase;
  font-size: x-large;
  font-weight: bold;
}
</style>
