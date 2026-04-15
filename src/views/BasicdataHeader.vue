<template>
    <div>
     <el-menu :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  @select="handleSelect">
  <el-menu-item index="1">基础数据维护</el-menu-item>
  <el-sub-menu index="2"> 暂无</el-sub-menu>
</el-menu>
</div>
</template>
<script setup>
    import {ref,reactive} from 'vue'
    import {useRouter} from 'vue-router'
    import loyat from './loyat.vue';
</script>

<style scoped>

</style>