<template>
    <div>
     <el-menu :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  @select="handleSelect">
  <el-menu-item index="1">床位示意图</el-menu-item>
  <el-menu-item index="1">床位管理</el-menu-item>
  <el-menu-item index="1">入住登记</el-menu-item>
  <el-menu-item index="1">护理记录</el-menu-item>
  <el-menu-item index="1">外出登记</el-menu-item>
 
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