<template>
    <div>
     <el-tabs
    v-model="activeTab"
    type="card"          
    closable            
    @tab-remove="handleTabRemove"  
    class="tabs-nav" >
    <!-- 每个标签页代表一个导航项 -->
    <el-tab-pane label="床位示意图" name="bed-diagram"></el-tab-pane>
    <el-tab-pane label="床位管理" name="bed-management"></el-tab-pane>
    <el-tab-pane label="入住登记" name="check-in"></el-tab-pane>
    <el-tab-pane label="护理记录" name="nursing-record"></el-tab-pane>
    <el-tab-pane label="外出登记" name="out-register"></el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup>
    import {ref,reactive} from 'vue'
    import {useRouter} from 'vue-router'
    import loyat from './loyat.vue';
    const activeTab = ref('bed-diagram')
    const handleTabRemove = (targetName) => {
    console.log('关闭标签:', targetName)
    }
</script>

<style scoped>

</style>