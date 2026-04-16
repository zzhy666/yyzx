<template>
  <div class="main-loyat">
    <!-- 左侧菜单 -->
    <div class="left-side">
      <h3>东软颐养中心</h3>
      <img src="/image/1.jpg" width="150" height="150" alt="Logo">
      <el-menu default-active="3-1" class="dhl">
        <el-sub-menu index="2">
          <template #title>
            <el-icon><DataBoard /></el-icon>
            <span>床位管理</span>
          </template>
          <el-menu-item index="2-1" @click="goToBedDiagram">床位示意图</el-menu-item>
          <el-menu-item index="2-2" @click="gotoBedmanagement">床位管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </template>
          <el-menu-item index="3-1" @click="gotoClientDiagram">入住登记</el-menu-item>
          <el-menu-item index="3-2" @click="gotoClientOut">外出登记</el-menu-item>
          <el-menu-item index="3-3" @click="gotoClientOff">退住登记</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><FirstAidKit /></el-icon>
            <span>护理管理</span>
          </template>
          <el-menu-item index="4-1" @click="gotoNurseLevelem">护理级别</el-menu-item>
          <el-menu-item index="4-2" @click="gotoNurseItem">护理项目</el-menu-item>
          <el-menu-item index="4-3" @click="gotoNurseSetting">客户护理设置</el-menu-item>
          <el-menu-item index="4-4" @click="gotoNurseRecords">护理记录</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="5">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>健康管家</span>
          </template>
          <el-menu-item index="5-1" @click="gotoHealthy">设置服务对象</el-menu-item>
          <el-menu-item index="5-2">服务关注</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="6">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="6-1" @click="gotoBasicdate">基础数据维护</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 右侧主内容区 -->
    <div class="right-side">
      <!-- 背景装饰图 -->
      <img src="/image/5.png" style="position: relative; left:-600px">

      <!-- 顶部 Tab 栏 -->
      <div class="top-bar">
        <el-tabs v-model="activeTab" type="card" closable @tab-remove="handleTabRemove" class="independent-tabs">
          <el-tab-pane name="bed" label="床位示意图"></el-tab-pane>
          <el-tab-pane name="bedmanagement" label="床位管理"></el-tab-pane>
          <el-tab-pane name="client" label="入住登记"></el-tab-pane>
          <el-tab-pane name="nurseRecord" label="护理记录"></el-tab-pane>
          <el-tab-pane name="clientout" label="外出登记"></el-tab-pane>
        </el-tabs>
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
              <el-table-column label="操作" width="120" align="center">
                <template #default="{ row }">
                  <el-button size="small" type="primary" @click="openCareDialog(row)">日常护理</el-button>
                </template>
              </el-table-column>
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

        <!-- ================= 图二：护理记录列表 ================= -->
        <div v-else-if="currentView === 'nurse'" class="view-container">
          <div class="page-header">
            <el-button type="primary" icon="ArrowLeft" @click="backToList">返回</el-button>
            <span class="page-title">护理记录列表</span>
          </div>
          
          <div class="table-container">
            <el-table :data="nurseRecordList" style="width: 100%" border stripe>
              <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
              <el-table-column prop="customerName" label="客户" align="center"></el-table-column>
              <el-table-column prop="projectName" label="护理项目" align="center"></el-table-column>
              <el-table-column prop="quantity" label="数量" width="80" align="center"></el-table-column>
              <el-table-column prop="content" label="护理内容" align="center"></el-table-column>
              <el-table-column prop="operator" label="护理人员" width="100" align="center"></el-table-column>
              <el-table-column prop="time" label="护理时间" width="180" align="center"></el-table-column>
            </el-table>
          </div>
           <div class="pagination">
            <el-pagination
              layout="total, prev, pager, next"
              :total="10"
              :current-page="1"
            ></el-pagination>
          </div>
        </div>

        <!-- ================= 图三：外出申请列表 ================= -->
        <div v-else-if="currentView === 'out'" class="view-container">
          <div class="page-header">
            <el-button type="primary" icon="ArrowLeft" @click="backToList">返回</el-button>
            <span class="page-title">外出申请列表</span>
            <el-button type="success" style="margin-left: auto;">新建外出申请</el-button>
          </div>

          <div class="table-container">
            <el-table :data="outRequestList" style="width: 100%" border stripe>
              <el-table-column prop="id" label="序号" width="60" align="center"></el-table-column>
              <el-table-column prop="customerName" label="客户姓名" align="center"></el-table-column>
              <el-table-column prop="reason" label="外出事由" align="center"></el-table-column>
              <el-table-column prop="startTime" label="外出时间" width="180" align="center"></el-table-column>
              <el-table-column prop="endTime" label="预计回院时间" width="180" align="center"></el-table-column>
              <el-table-column prop="actualReturnTime" label="实际回院时间" width="180" align="center"></el-table-column>
              <el-table-column prop="companion" label="陪同人" width="100" align="center"></el-table-column>
              <el-table-column prop="relation" label="与老人关系" width="100" align="center"></el-table-column>
              <el-table-column prop="phone" label="陪同人电话" width="120" align="center"></el-table-column>
              <el-table-column prop="status" label="审批状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template #default="{ row }">
                  <el-button size="small" type="primary" link v-if="row.status === '通过'">登记回院</el-button>
                  <el-button size="small" type="danger" link v-if="row.status === '已提交'">撤销</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
           <div class="pagination">
            <el-pagination
              layout="total, prev, pager, next"
              :total="10"
              :current-page="1"
            ></el-pagination>
          </div>
        </div>

        <!-- ================= 图四：退住申请列表 ================= -->
        <div v-else-if="currentView === 'checkout'" class="view-container">
          <div class="page-header">
            <el-button type="primary" icon="ArrowLeft" @click="backToList">返回</el-button>
            <span class="page-title">退住申请列表</span>
            <el-button type="danger" style="margin-left: auto;">新建退住申请</el-button>
          </div>

          <div class="table-container">
            <el-table :data="checkOutList" style="width: 100%" border stripe>
              <el-table-column prop="id" label="序号" width="60" align="center"></el-table-column>
              <el-table-column prop="customerName" label="客户姓名" align="center"></el-table-column>
              <el-table-column prop="checkInTime" label="入住时间" width="180" align="center"></el-table-column>
              <el-table-column prop="checkOutTime" label="退住时间" width="180" align="center"></el-table-column>
              <el-table-column prop="type" label="退住类型" width="100" align="center"></el-table-column>
              <el-table-column prop="reason" label="退住原因" align="center"></el-table-column>
              <el-table-column prop="reviewTime" label="审批时间" width="180" align="center"></el-table-column>
              <el-table-column prop="status" label="审批状态" width="100" align="center">
                <template #default="{ row }">
                   <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="bedNo" label="床位" width="100" align="center"></el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                  <el-button size="small" type="danger" link v-if="row.status === '已提交'">撤销申请</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
           <div class="pagination">
            <el-pagination
              layout="total, prev, pager, next"
              :total="10"
              :current-page="1"
            ></el-pagination>
          </div>
        </div>

      </div>
    </div>

    <!-- ==================== 护理项目弹窗 (触发跳转的入口) ==================== -->
    <el-dialog
      v-model="careDialogVisible"
      title="客户护理项目"
      width="900px"
      :close-on-click-modal="false"
    >
      <div class="dialog-header">
        <div class="customer-info">
          <strong>客户：</strong>{{ currentCustomer.name }}
        </div>
      </div>

      <div class="project-table-container">
        <el-table :data="projectList" style="width: 100%" border>
          <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="customerName" label="客户" align="center"></el-table-column>
          <el-table-column prop="code" label="护理项目编号" width="120" align="center"></el-table-column>
          <el-table-column prop="name" label="护理项目名称" align="center"></el-table-column>
          <el-table-column prop="price" label="价格" width="100" align="center"></el-table-column>
          <el-table-column prop="remaining" label="余量" width="100" align="center"></el-table-column>
          <el-table-column prop="expireDate" label="服务到期日期" width="120" align="center"></el-table-column>
          <el-table-column label="状态" width="120" align="center">
            <template #default="{ row }">
              <div class="status-cell">
                <span :class="['status', getStatusClass(row.status)]">{{ row.status }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 操作列：点击按钮跳转到对应页面 -->
          <el-table-column label="操作" width="260" align="center">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="jumpToNurse">护理</el-button>
              <el-button size="small" type="success" @click="jumpToOut">外出</el-button>
              <el-button size="small" type="danger" @click="jumpToCheckOut">退住</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <el-button @click="careDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="careDialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue' // 确保图标已注册或全局可用

const router = useRouter()

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

// ================= 弹窗数据 =================
const careDialogVisible = ref(false)
const currentCustomer = ref({})
const projectList = ref([
  { id: 1, customerName: '孙瑞英', code: 'HLXM0001', name: '吸氧', price: '60元/次', remaining: -5, expireDate: '2024-01-17', status: '已欠费' },
  { id: 2, customerName: '孙瑞英', code: 'HLXM0003', name: '测量血压', price: '免费', remaining: 2, expireDate: '2023-11-17', status: '即将用完' }
])

// ================= 图二数据 (护理记录) =================
const nurseRecordList = ref([
  { id: 1, customerName: '孙瑞英', projectName: '吸氧', quantity: 1, content: '常规吸氧护理', operator: '吴伟', time: '2023-11-24 10:00:00' },
  { id: 2, customerName: '孙瑞英', projectName: '协助服药', quantity: 1, content: '饭后服药', operator: '吴伟', time: '2023-11-24 12:00:00' }
])

// ================= 图三数据 (外出申请) =================
const outRequestList = ref([
  { id: 1, customerName: '孙瑞英', reason: '回家探亲', startTime: '2023-11-13 09:00', endTime: '2023-11-14 18:00', actualReturnTime: '', companion: '孙丽', relation: '子女', phone: '13456786754', status: '通过' },
  { id: 2, customerName: '孙瑞英', reason: '购买生活用品', startTime: '2023-11-10 14:00', endTime: '2023-11-10 17:00', actualReturnTime: '', companion: '孙丽', relation: '子女', phone: '13456786754', status: '不通过' },
  { id: 3, customerName: '孙瑞英', reason: '参加社区活动', startTime: '2023-11-15 08:00', endTime: '2023-11-15 16:00', actualReturnTime: '', companion: '孙丽', relation: '子女', phone: '13456786754', status: '已提交' }
])

// ================= 图四数据 (退住申请) =================
const checkOutList = ref([
  { id: 1, customerName: '孙瑞英', checkInTime: '2023-11-10', checkOutTime: '2023-11-15', type: '正常退住', reason: '家里有事', reviewTime: '', status: '已提交', bedNo: '1201-1' },
  { id: 2, customerName: '孙瑞英', checkInTime: '2023-11-10', checkOutTime: '2023-11-20', type: '保留床位', reason: '短期回家', reviewTime: '2023-12-30', status: '不通过', bedNo: '1201-1' },
  { id: 3, customerName: '孙瑞英', checkInTime: '2023-11-10', checkOutTime: '2023-12-30', type: '死亡退住', reason: '自然离世', reviewTime: '2023-12-30', status: '已撤销', bedNo: '1201-1' }
])

// ================= 方法定义 =================

// 图一：基础操作
const searchClient = () => {
  console.log('搜索:', searchName.value)
}
const handlePageChange = (page) => {
  currentPage.value = page
}
const openCareDialog = (row) => {
  currentCustomer.value = row
  careDialogVisible.value = true
}

// 弹窗中的跳转逻辑
const jumpToNurse = () => {
  careDialogVisible.value = false
  currentView.value = 'nurse' // 切换到图二
  activeTab.value = 'nurseRecord' // 同步顶部Tab
}

const jumpToOut = () => {
  careDialogVisible.value = false
  currentView.value = 'out' // 切换到图三
  activeTab.value = 'clientout' // 同步顶部Tab
}

const jumpToCheckOut = () => {
  careDialogVisible.value = false
  currentView.value = 'checkout' // 切换到图四
  // 注意：原顶部Tab没有退住，这里可以保持client或新增，暂不强制修改activeTab以免UI错位，或者你可以手动添加一个tab
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
  position: relative;
}

/* 背景图定位 */
.right-side > img {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
  opacity: 0.1;
  pointer-events: none;
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

.left-side img {
  margin: 0 auto;
  display: block;
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

/* 弹窗样式 */
.dialog-header {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.customer-info {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.project-table-container {
  margin-bottom: 20px;
}

.status-cell {
  text-align: center;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  text-align: center;
}

.status.overdue { background-color: red; color: white; }
.status.normal { background-color: green; color: white; }
.status.warning { background-color: orange; color: white; }
.status.expired { background-color: darkred; color: white; }

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
</style>