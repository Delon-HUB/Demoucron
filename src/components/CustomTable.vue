<template>
  <div>
    <table>
      <caption class="text-bold">
        {{
          matrix.title
        }}
      </caption>
      <thead>
        <tr>
          <th></th>
          <th v-for="i in matrix.rows.length">{{ i }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in matrix.rows">
          <th>{{ index + 1 }}</th>
          <td v-for="val in row.data">{{ val != Infinity ? val : "+∞" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { IMatrix } from "../Models/table";

defineProps<{ matrix: IMatrix }>();
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
th {
  font-size: large;
}
</style>
