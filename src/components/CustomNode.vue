<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";

defineProps<NodeProps>();
</script>

<template>
  <div class="circle-node">
    <div class="label text-bold text-black">{{ data.label }}</div>

    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Left" />
    <Handle type="target" :position="Position.Right" />
    <Handle type="source" :position="Position.Right" />
    <Handle type="target" :position="Position.Top" />
    <Handle type="source" :position="Position.Top" />
    <Handle type="target" :position="Position.Bottom" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
@import "@vue-flow/core/dist/style.css";

.circle-node {
  width: 64px;
  height: 64px;
  border: 4px solid black;
  border-radius: 360px;
  background-color: #f9f5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  /* box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.9); */
}

.label {
  text-align: center;
  text-transform: uppercase;
  font-size: x-large;
  /* background-color: linear-gradient(to right, #074e53, #0752f3); */
}
</style>
