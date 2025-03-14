<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";

defineProps<NodeProps>();
</script>

<template>
  <div class="circle-node">
    <div class="label text-bold text-white">{{ data.label }}</div>

    <Handle type="target" :position="Position.Bottom" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
@import "@vue-flow/core/dist/style.css";

.circle-node {
  width: 80px;
  height: 80px;
  border-radius: 360px;
  background-color: aliceblue;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.9);
  background: linear-gradient(to right, #0e1c26, #2a454b, #294861);
}

.label {
  text-align: center;
  text-transform: uppercase;
  font-size: x-large;
  /* background-color: linear-gradient(to right, #074e53, #0752f3); */
}
</style>
