<template>
    <div class="main-loyat" >
       <div class="left-side" >
        <h3>东软颐养中心</h3>
        <img src="/image/1.jpg" width="150" height="150">
        <el-menu default-active="1" class="dhl">
        <el-sub-menu index="2">
      <template #title>
        <el-icon><DataBoard /></el-icon>
        <span >床位管理</span>
      </template>
      <el-menu-item index="2-1" @click="goToBedDiagram">床位示意图</el-menu-item>
      <el-menu-item index="2-2" @click="gotoBedmanagement">床位管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon><User /></el-icon>
        <span >客户管理</span>
      </template>
      <el-menu-item index="3-1" @click="gotoClientDiagram">入住登记</el-menu-item>
      <el-menu-item index="3-2" @click="gotoClientOut">外出登记</el-menu-item>
      <el-menu-item index="3-3" @click="gotoClientOff">退住登记</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
         <el-icon><FirstAidKit /></el-icon>
        <span >护理管理</span>
      </template>
      <el-menu-item index="4-1" @click="gotoNurseLevelem">护理级别</el-menu-item>
      <el-menu-item index="4-2" @click="gotoNurseItem">护理项目</el-menu-item>
      <el-menu-item index="4-2" @click="gotoNurseSetting">客户护理设置</el-menu-item>
      <el-menu-item index="4-2" @click="gotoNurseRecords">护理记录</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>
        <el-icon><Monitor /></el-icon>
        <span >健康管家</span>
      </template>
      <el-menu-item index="5-1" @click="gotoHealthy">设置服务对象</el-menu-item>
      <el-menu-item index="5-2"@click="gotoHealthyHeader" >服务关注</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="6">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span >用户管理</span>
      </template>
      <el-menu-item index="6-1" @click="gotoBasicdate">基础数据维护</el-menu-item>
    </el-sub-menu>
    
    </el-menu>
       </div>
        <div class="right-side">  
          <img src="/image/5.png" style="position: relative; left:-600px">
           
            <div class="top-bar">
               <div>
     <el-tabs
    v-model="activeTab"
    type="card"          
    closable            
    @tab-remove="handleTabRemove"  
    class="independent-tabs" style="position: relative;top:20px;" >
    <el-tab-pane name="bed">
        <template #label>
          <div @click="goToBedDiagram">床位示意图</div>
        </template>
      </el-tab-pane>
    <el-tab-pane name="bedmanagement">
        <template #label>
          <div @click="gotoBedmanagement">床位管理</div>
        </template>
      </el-tab-pane>

      <el-tab-pane name="client">
        <template #label>
          <div @click="gotoClientDiagram">入住登记</div>
        </template>
      </el-tab-pane>

      <el-tab-pane name="nurseRecord">
        <template #label>
          <div @click="gotoNurseRecords">护理记录</div>
        </template>
      </el-tab-pane>

      <el-tab-pane name="clientout">
        <template #label>
          <div @click="gotoClientOut">外出登记</div>
        </template>
      </el-tab-pane>
  </el-tabs>
  <div class="welcome-section" style="position: relative; left: 1500px;top: -120px;">
          <el-icon><User /></el-icon>
          <span class="welcome-text">欢迎，{{ currentUsername }}！</span>
          <el-tag type="info" size="small" style="margin-left: 8px;">
            {{ userType }}
          </el-tag>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleLogout"
            style="margin-left: 10px;"
          >
            退出
          </el-button>
        </div>
      
</div>
</div>
            <div class="content">
              <router-view ></router-view>
                
            </div>
        </div>
        </div>
        
</template>

<script setup>
    import {ref,reactive ,onMounted} from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessageBox } from 'element-plus'
   import { User } from '@element-plus/icons-vue'
    const router = useRouter()
const activeTab = ref('bed')

// 用户信息
const currentUsername = ref('')
const userType = ref('')

// 页面加载时获取用户信息
onMounted(() => {
  const username = localStorage.getItem('currentUsername')
  const type = localStorage.getItem('userType')
  
  if (username) {
    currentUsername.value = username
    userType.value = type || '管理员'
  } else {
    // 如果没有登录信息，跳转到登录页
    router.push('/login')
  }
})

// 标签页关闭处理
const handleTabRemove = (targetName) => {
  console.log('关闭标签:', targetName)
  if (targetName === activeTab.value) {
    activeTab.value = 'bed'
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 清除登录信息
    localStorage.removeItem('currentUsername')
    localStorage.removeItem('userType')
    
    // 跳转到登录页
    router.push('/login')
  })
}
    const goToBedDiagram = () => {
    router.push({ name: 'bed' })
    }
    const gotoClientDiagram = () => {
    router.push({ name: 'client' })
    }
    const gotoBasicdate = () => {
    router.push({ name: 'basicdate' })
    }
    const gotoNurseItem = () => {
    router.push({ name: 'nurseItem' })
    }
    const gotoNurseLevelem = () => {
    router.push({ name: 'nurseLevel' })
    }
    const gotoNurseRecords = () => {
    router.push({ name: 'nurseRecords' })
    }
    const gotoNurseSetting = () => {
    router.push({ name: 'nurseSetting' })
    }

    const gotoHealthy = () => {
    router.push({ name: 'healthy' })
    }
    const gotoHealthyHeader = () => {
    router.push({ name: 'healthyHeader' })
    }
    const gotoClientOut =() =>{
      router.push({ name: 'clientout' })
    }
     const gotoClientOff =() =>{
      router.push({ name: 'clientoff' })
    }
    const gotoBedmanagement =() =>{
      router.push({ name: 'bedmanagement' })
    }
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
  justify-content: space-between; 
}
.welcome-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #d9ecff;
  white-space: nowrap; 
  background: transparent;
}

.welcome-section .el-icon {
  color: #409eff;
  font-size: 18px;
}

.welcome-text {
  color: #409eff;
  font-weight: 500;
  font-size: 14px;
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