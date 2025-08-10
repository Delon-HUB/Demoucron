<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";

defineProps<NodeProps>();
</script>

<template>
  <div class="circle-node">
    <div class="label text-bold text-black">{{ data.label }}</div>

    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
@import "@vue-flow/core/dist/style.css";

.circle-node {
  width: 52px;
  height: 52px;
  border: 4px solid grey;
  border-radius: 360px;
  background-color: #f9f5ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  text-align: center;
  text-transform: uppercase;
  font-size: x-large;
}
</style>
