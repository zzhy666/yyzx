<template>
  <div class="main-loyat">
    <!-- 左侧菜单 -->
    <div class="left-side">
      <h3>东软颐养中心</h3>
      <img src="/image/1.jpg" width="150" height="150" alt="Logo">
      <el-menu default-active="3-1" class="dhl">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>护工页面</span>
          </template>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 右侧主内容区 -->
    <div class="right-side">
      <!-- 顶部 Tab 栏 -->
      <img src="/image/5.png" style="position:relative; left: -600px;"></img>
      <p class="wenzi">欢迎登录护工页面{{ }}</p>
      <div class="welcome-section" style="position: relative;left: 1500px;top: -120px; ">
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

      <!-- 内容区域：根据 currentView 动态显示不同页面 -->
      <div class="content">
        
        <!-- ================= 图一：客户列表 (默认) ================= -->
        <div v-if="currentView === 'list'" class="view-container">
          <!-- 搜索区域 -->
          <div class="search-box">
            <el-input placeholder="客户姓名" v-model="searchName" style="width: 200px;" />
            <el-button type="primary" @click="searchClient">查询</el-button>
          </div>

          <!-- 客户列表表格 -->
          <div class="table-container">
            <el-table :data="clientList" style="width: 100%" border>
              <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
              <el-table-column prop="name" label="客户姓名" align="center"></el-table-column>
              <el-table-column prop="age" label="年龄" width="80" align="center"></el-table-column>
              <el-table-column prop="gender" label="性别" width="80" align="center"></el-table-column>
              <el-table-column prop="roomNo" label="房间号" width="100" align="center"></el-table-column>
              <el-table-column prop="bedNo" label="床号" width="100" align="center"></el-table-column>
              <el-table-column prop="floor" label="所属楼房" width="100" align="center"></el-table-column>
              <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
              <el-table-column prop="level" label="护理级别" width="100" align="center">
                <template #default="{ row }">
                  <el-tag size="small">{{ row.level }}</el-tag>
                </template>
              </el-table-column>
              <!-- 已删除“日常护理”按钮列，因为对应的弹窗逻辑已移除 -->
            </el-table>
          </div>

          <!-- 分页组件 -->
          <div class="pagination">
            <el-pagination
              layout="total, prev, pager, next"
              :total="total"
              :current-page="currentPage"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>

        

      </div>
    </div>

    <!-- ==================== 已删除护理项目弹窗 ==================== -->
   
  </div>
   
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { User } from '@element-plus/icons-vue'

const router = useRouter()
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

// ================= 状态管理 =================
// currentView 控制主内容区显示哪个页面: 'list'(图1), 'nurse'(图2), 'out'(图3), 'checkout'(图4)
const currentView = ref('list')
const activeTab = ref('client') // 保持顶部Tab高亮逻辑，可根据需要调整

// ================= 图一数据 =================
const searchName = ref('')
const clientList = ref([
  { id: 1, name: '孙瑞英', age: 68, gender: '女', roomNo: '2012', bedNo: '2012-1', floor: '606', phone: '18167564213', level: '二级' },
  { id: 2, name: '张帆', age: 77, gender: '女', roomNo: '1014', bedNo: '1014-1', floor: '606', phone: '17745189064', level: '' }
])
const total = ref(2)
const currentPage = ref(1)


// ================= 方法定义 =================

// 图一：基础操作
const searchClient = () => {
  console.log('搜索:', searchName.value)
}
const handlePageChange = (page) => {
  currentPage.value = page
}

// 返回逻辑
const backToList = () => {
  currentView.value = 'list' // 回到图一
  activeTab.value = 'client'
}

// 辅助：获取状态标签颜色
const getStatusType = (status) => {
  if (status === '通过' || status === '已完成') return 'success'
  if (status === '不通过' || status === '已撤销') return 'danger'
  return 'warning'
}

const getStatusClass = (status) => {
  switch (status) {
    case '已欠费': return 'overdue'
    case '未到期': return 'normal'
    case '即将用完': return 'warning'
    case '已到期': return 'expired'
    default: return 'normal'
  }
}

const handleTabRemove = (targetName) => {
  if (targetName === 'client') return
  activeTab.value = 'client'
  currentView.value = 'list'
}
</script>

<style scoped>
.main-loyat {
  width: 100vw;
  height: 100vh;
  display: flex;
  border: 1px solid grey;
  box-sizing: border-box;
}

.left-side {
  width: 220px;
  background: #f8f9fa;
  padding: 24px 16px;
  border-right: 1px solid grey;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  box-sizing: border-box;
}


.top-bar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 10;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f9f9f9;
  z-index: 1;
}

.dhl {
  background-color: transparent;
  border: none;
  width: 100%;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
}

 img {
  margin: 0 auto;
 }

/* 通用页面容器 */
.view-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: 100%;
}

.search-box {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.table-container {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

/* 新页面头部样式 */
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  margin-left: 15px;
  color: #333;
}

/* Tab 自定义样式 */
.independent-tabs {
  width: 100%;
  padding: 12px 0;
}

:deep(.independent-tabs .el-tabs__nav) {
  border-bottom: none !important;
  display: flex;
  gap: 8px;
}

:deep(.independent-tabs .el-tabs__item) {
  font-size: 14px;
  padding: 8px 20px;
  margin: 0;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  transition: all 0.3s ease;
}

:deep(.independent-tabs .el-tabs__item.is-active) {
  border-color: #409eff;
  background-color: #ecf5ff;
  color: #409eff;
}
.wenzi{
  color: red;
  font-size: 16pxpx;
  position: relative;
  left: 50px;
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
</style>