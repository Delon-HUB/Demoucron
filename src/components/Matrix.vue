<template>
  <div>
    <table>
      <caption class="text-bold">
        {{
          data.title
        }}
      </caption>
      <thead>
        <tr>
          <th></th>
          <th v-for="row in data.rows">{{ row.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data.rows">
          <th v-if="row.name">{{ row.name }}</th>
          <td v-for="val in row.data">
            {{ val == Infinity ? "+∞" : val == -Infinity ? "-∞" : val }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { IMatrix } from "../Models/table";

defineProps<{ data: IMatrix }>();
</script>
<style scoped>
table {
  border-collapse: collapse;
}
td {
  border: 2px solid black;
}

td,
th {
  width: 64px;
  text-align: center;
}
</style>
