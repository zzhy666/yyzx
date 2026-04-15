<template>
    <div>
     <el-tabs
    v-model="activeTab"
    type="card"          
    closable            
    @tab-remove="handleTabRemove"  
    class="custom-tabs" >
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
.custom-tabs {
  width: 100%;
  padding: 8px 0; /* 增加上下间距 */
}

/* 深度选择器修改Element Plus默认样式 */
:deep(.custom-tabs .el-tabs__header) {
  margin: 0 0 8px; /* 增加底部间距 */
}

:deep(.custom-tabs .el-tabs__item) {
  font-size: 16px; /* 增大字体大小（默认14px） */
  padding: 0  50px; /* 增加水平间距（默认12px） */
  margin-right: 8px; /* 增加标签间的间距（默认4px） */
  height: 40px; /* 增加标签高度（默认36px） */
  line-height: 40px; /* 保持文字垂直居中 */
  border-radius: 8px 8px 0 0; /* 稍微增大圆角 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

/* 鼠标悬浮效果 - 改为蓝色系 */
:deep(.custom-tabs .el-tabs__item:hover) {
  color: #409eff; /* 悬停文字颜色 - Element主题蓝 */
  background-color: rgba(64, 158, 255, 0.08); /* 浅蓝色背景 */
  border-color: #c6e2ff; /* 边框颜色变浅蓝 */
}

/* 激活标签样式 */
:deep(.custom-tabs .el-tabs__item.is-active) {
  color: #409eff; /* 激活文字颜色 */
  background-color: rgba(64, 158, 255, 0.1); /* 激活状态背景 */
  border-bottom-color: #fff; /* 隐藏底部边框，与背景融合 */
  font-weight: 600; /* 激活标签文字加粗 */
}

/* 关闭按钮样式 */
:deep(.custom-tabs .el-tabs__item .is-icon-close) {
  width: 16px; /* 关闭按钮大小 */
  height: 16px;
  font-size: 12px; /* 关闭图标大小 */
  margin-left: 6px; /* 关闭按钮与文字的间距 */
  border-radius: 50%; /* 圆形关闭按钮 */
  transition: all 0.2s;
}

/* 关闭按钮悬停效果 */
:deep(.custom-tabs .el-tabs__item .is-icon-close:hover) {
  background-color: rgba(64, 158, 255, 0.2); /* 浅蓝色背景 */
  color: #409eff; /* 蓝色关闭图标 */
  transform: scale(1.1); /* 轻微放大 */
}

/* 卡片式标签的整体背景和边框 */
:deep(.custom-tabs .el-tabs__nav) {
  border: none; /* 移除默认边框 */
}

:deep(.custom-tabs .el-tabs__nav-wrap) {
  padding-bottom: 1px; /* 增加底部空间 */
}
</style>