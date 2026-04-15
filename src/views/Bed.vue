<template>
        <label class="select-label">
      <span class="label-text">楼层：</span>
        <el-select v-model="selectedValue" placeholder="请选择" style="width: 300px; position: relative; left: 5px; top: -2px;">
           <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
    </label>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import loyat from './loyat.vue';
const selectedValue = ref('')
// 多选下拉框的绑定值
const multipleValue = ref([])
const options = ref([
  { value: '1', label: '一层' },
  { value: '2', label: '二层' },
  { value: '3', label: '三层' },
  { value: '4', label: '四层' },
])
</script>

<style scoped>

</style>