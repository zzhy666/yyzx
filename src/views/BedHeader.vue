<template>
    <div>
     <el-tabs
    v-model="activeTab"
    type="card"          
    closable            
    @tab-remove="handleTabRemove"  
    class="independent-tabs" >
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
.independent-tabs {
  width: 100%;
  padding: 12px 0; /* 增加上下间距 */
}

/* 隐藏默认的底部连接线（关键：去掉 el-tabs__nav 的底部边框） */
:deep(.independent-tabs .el-tabs__nav) {
  border-bottom: none !important; /* 去掉底部横线 */
  display: flex;
  gap: 8px; /* 标签之间的间距 */
}

/* 每个标签的样式：独立卡片 */
:deep(.independent-tabs .el-tabs__item) {
  font-size: 16px; /* 字体大一些 */
  padding: 10px 24px; /* 增加内边距，让标签更饱满 */
  margin: 0;
  border: 1px solid #e4e7ed; /* 边框 */
  border-radius: 6px; /* 圆角 */
  background-color: #fff; /* 背景色 */
  transition: all 0.3s ease; /* 平滑过渡 */
  position: relative;
  z-index: 1;
}

/* 鼠标悬浮效果：边框变色 + 背景色微变 + 阴影 */
:deep(.independent-tabs .el-tabs__item:hover) {
  border-color: #409eff; /* 悬浮边框颜色 */
  background-color: rgba(64, 158, 255, 0.05); /* 悬浮背景色 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* 轻微阴影增强立体感 */
  transform: translateY(-1px); /* 微微上浮，增强交互感 */
}

/* 选中状态的标签：边框 + 背景 + 阴影 */
:deep(.independent-tabs .el-tabs__item.is-active) {
  border-color: #409eff;
  background-color: #ecf5ff; /* 选中背景色 */
  color: #409eff; /* 选中文字颜色 */
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15); /* 选中阴影 */
  transform: translateY(-1px);
}

/* 关闭按钮的样式（可选：调整大小和颜色） */
:deep(.independent-tabs .el-tabs__close-btn) {
  font-size: 14px;
  margin-left: 8px;
  color: #909399;
  transition: color 0.2s;
}

:deep(.independent-tabs .el-tabs__close-btn:hover) {
  color: #f56c6c; /* 关闭按钮悬浮变红 */
}
</style>