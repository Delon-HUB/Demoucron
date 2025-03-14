<template>
  <q-list padding class="menu-list">
    <q-item clickable v-ripple v-for="i in tables.length">
      <div class="row">
        <div class="col">
          <CustomTable :matrix="tables[i - 1]" />
        </div>
        <div class="col">
          <CustomTable :matrix="tables[i]" />
        </div>
      </div>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IMatrix } from "../Models/table";
import CustomTable from "./CustomTable.vue";

const props = defineProps<{ initTable: IMatrix }>();

const tables = ref<IMatrix[]>([]);

tables.value.push(props.initTable);
</script>
