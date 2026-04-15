<template>
    <div class="main-loyat">
       <div class="left-side" >
        <h3>东软颐养中心</h3>
        <img src="/image/1.jpg" width="150" height="150">
        <el-menu default-active="1" class="dhl">
        <el-sub-menu index="2">
      <template #title>
        <el-icon><DataBoard /></el-icon>
        <span >床位管理</span>
      </template>
      <el-menu-item index="2-1">床位示意图</el-menu-item>
      <el-menu-item index="2-2">床位管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon><DataBoard /></el-icon>
        <span >客户管理</span>
      </template>
      <el-menu-item index="3-1">入住登记</el-menu-item>
      <el-menu-item index="3-2">外出登记</el-menu-item>
      <el-menu-item index="3-3">退住登记</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <el-icon><DataBoard /></el-icon>
        <span >护理管理</span>
      </template>
      <el-menu-item index="4-1">护理级别</el-menu-item>
      <el-menu-item index="4-2">护理项目</el-menu-item>
      <el-menu-item index="4-2">客户护理设置</el-menu-item>
      <el-menu-item index="4-2">护理记录</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>
        <el-icon><DataBoard /></el-icon>
        <span >健康管家</span>
      </template>
      <el-menu-item index="5-1">设置服务对象</el-menu-item>
      <el-menu-item index="5-2">服务关注</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="6">
      <template #title>
        <el-icon><DataBoard /></el-icon>
        <span >用户管理</span>
      </template>
      <el-menu-item index="6-1">基础数据维护</el-menu-item>
    </el-sub-menu>
    </el-menu>
       </div>
        <div class="right-side">    
            <div class="top-bar">
                <p>logo</p>
                导航栏
            </div>
            <div class="content">
                <router-view></router-view>
                内容
            </div>
        </div>
        </div>
</template>

<script setup>
    import {ref,reactive} from 'vue'
</script>

<style scoped>
.main-loyat{ 
width: 100vw;
height: 100vh;
display: flex;
border: 1px solid grey; 
box-sizing: border-box; 
}
.left-side{
    width: 220px;
    background:#f8f9fa;
    padding: 24px 16px;
    border-right: 1px solid grey;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    
}
.right-side{
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid grey; 
  box-sizing: border-box;
}
.top-bar{
  height: 60px;
  background: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid grey;
}
.content{
  flex: 1;
  padding: 20px;
  overflow-y: auto;  
  background: #f9f9f9;
}
.dhl{
  background-color: transparent;
  border: none;
  width: 100%;
  position: relative;
  left: 10px;
}
h3{
    text-align: center;
    margin-bottom: 20px;
    font-size: 20px;
}
img{
    margin: 0 auto;
}
</style>