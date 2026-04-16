<script setup lang="js">
import { reactive, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import loyat from '../loyat.vue';

// ================= 1. 静态数据定义 (Mock Data) =================

// 左侧：所有护理项目数据
const allNursingItems = [
  { id: 1, serialNumber: 'NM001', nursingName: '日常清洁', servicePrice: 50, executionCycle: '每日', executionTimes: 1, level: '一级' },
  { id: 2, serialNumber: 'NM002', nursingName: '翻身拍背', servicePrice: 30, executionCycle: '每2小时', executionTimes: 6, level: '一级' },
  { id: 3, serialNumber: 'NM003', nursingName: '喂饭服务', servicePrice: 40, executionCycle: '每日三餐', executionTimes: 3, level: '二级' },
  { id: 4, serialNumber: 'NM004', nursingName: '洗澡协助', servicePrice: 80, executionCycle: '每周2次', executionTimes: 2, level: '二级' },
  { id: 5, serialNumber: 'NM005', nursingName: '药物管理', servicePrice: 20, executionCycle: '每日', executionTimes: 1, level: '三级' },
  { id: 6, serialNumber: 'NM006', nursingName: '心理疏导', servicePrice: 100, executionCycle: '每周1次', executionTimes: 1, level: '三级' },
  { id: 7, serialNumber: 'NM007', nursingName: '康复训练', servicePrice: 150, executionCycle: '每日', executionTimes: 1, level: '一级' },
  { id: 8, serialNumber: 'NM008', nursingName: '夜间巡视', servicePrice: 60, executionCycle: '每晚', executionTimes: 1, level: '二级' },
];

// 右侧：默认显示一级护理项目 (模拟初始状态)
const levelOneItems = allNursingItems.filter(item => item.level === '一级');

// ================= 2. 响应式状态 =================

// --- 左侧表格状态 ---
let leftTableData = reactive([]); // 当前页显示的数据
let leftQueryParam = reactive({
  pageInfoVo: {
    currentPage: 1,
    pageSize: 5,
    total: 0,
  },
  customer: {
    customerName: "", // 用作搜索关键词
  }
});

// --- 右侧表格状态 ---
let rightTableData = reactive([...levelOneItems]); // 当前页显示的数据
let rightQueryParam = reactive({
  pageInfoVo: {
    currentPage: 1,
    pageSize: 5,
    total: levelOneItems.length,
  }
});

// --- 新增弹窗状态 ---
let addDialogVisible = ref(false);
let formData = reactive({
  serialNumber: '',
  nursingName: '',
  servicePrice: '',
  executionCycle: '每日',
  executionTimes: '',
  description: '',
  status: '启用'
});

// ================= 3. 核心逻辑函数 =================

// --- 左侧：渲染表格数据 (包含搜索和分页) ---
function renderLeftTable() {
  // 1. 搜索过滤
  const keyword = leftQueryParam.customer.customerName.toLowerCase();
  let filteredData = allNursingItems;
  
  if (keyword) {
    filteredData = allNursingItems.filter(item => 
      item.nursingName.toLowerCase().includes(keyword) || 
      item.serialNumber.toLowerCase().includes(keyword)
    );
  }

  // 2. 更新总数
  leftQueryParam.pageInfoVo.total = filteredData.length;

  // 3. 分页切片
  const start = (leftQueryParam.pageInfoVo.currentPage - 1) * leftQueryParam.pageInfoVo.pageSize;
  const end = start + leftQueryParam.pageInfoVo.pageSize;
  const paginatedData = filteredData.slice(start, end);

  // 4. 更新视图
  leftTableData.splice(0, leftTableData.length);
  leftTableData.push(...paginatedData);
}

// 初始化加载
renderLeftTable();

// --- 右侧：渲染表格数据 (仅分页，暂不加搜索以简化) ---
function renderRightTable() {
  const sourceData = levelOneItems; 
  
  rightQueryParam.pageInfoVo.total = sourceData.length;

  const start = (rightQueryParam.pageInfoVo.currentPage - 1) * rightQueryParam.pageInfoVo.pageSize;
  const end = start + rightQueryParam.pageInfoVo.pageSize;
  const paginatedData = sourceData.slice(start, end);

  rightTableData.splice(0, rightTableData.length);
  rightTableData.push(...paginatedData);
}

// 初始化加载右侧
renderRightTable();

// --- 新增护理项目 ---
function showAddDialog() {
  addDialogVisible.value = true;
  // 重置表单
  formData.serialNumber = '';
  formData.nursingName = '';
  formData.servicePrice = '';
  formData.executionsTimes = '';
  formData.description = '';
  formData.status = '启用';
}

function saveNewItem() {
  if (!formData.serialNumber.trim()) {
    ElMessage.warning('请输入编号');
    return;
  }
  if (!formData.nursingName.trim()) {
    ElMessage.warning('请输入名称');
    return;
  }
  if (!formData.servicePrice) {
    ElMessage.warning('请输入价格');
    return;
  }
  if (!formData.executionsTimes) {
    ElMessage.warning('请输入执行次数');
    return;
  }

  // 生成新的 ID
  const newId = Math.max(...allNursingItems.map(item => item.id)) + 1;

  // 创建新对象
  const newItem = {
    id: newId,
    serialNumber: formData.serialNumber,
    nursingName: formData.nursingName,
    servicePrice: Number(formData.servicePrice),
    executionCycle: formData.executionsTimes,
    executionTimes: Number(formData.executionsTimes),
    description: formData.description,
    level: '一级', // 默认为一级，可根据需要调整
    status: formData.status
  };

  // 添加到源数据中
  allNursingItems.push(newItem);

  // 关闭弹窗
  addDialogVisible.value = false;

  // 刷新左侧列表
  leftQueryParam.pageInfoVo.currentPage = 1; // 重置到第一页
  renderLeftTable();

  ElMessage.success('护理项目添加成功！');
}

// ================= 4. 事件处理 =================

// --- 左侧分页事件 ---
function handleLeftCurrentChange(val) {
  leftQueryParam.pageInfoVo.currentPage = val;
  renderLeftTable();
}
function handleLeftPrevClick(val) {
  leftQueryParam.pageInfoVo.currentPage = val;
  renderLeftTable();
}
function handleLeftNextClick(val) {
  leftQueryParam.pageInfoVo.currentPage = val;
  renderLeftTable();
}

// --- 右侧分页事件 ---
function handleRightCurrentChange(val) {
  rightQueryParam.pageInfoVo.currentPage = val;
  renderRightTable();
}
function handleRightPrevClick(val) {
  rightQueryParam.pageInfoVo.currentPage = val;
  renderRightTable();
}
function handleRightNextClick(val) {
  rightQueryParam.pageInfoVo.currentPage = val;
  renderRightTable();
}

// --- 左侧查询按钮 ---
function btnQuery() {
  leftQueryParam.pageInfoVo.currentPage = 1; // 重置到第一页
  renderLeftTable();
}

// --- 右侧操作按钮 ---
function handleEdit(row) {
  console.log('编辑项目:', row);
  ElMessage.info(`你点击了编辑: ${row.nursingName}`);
}

// 修复原代码缺失的 index 方法
function indexMethodRecord(index) {
  return index + 1 + (rightQueryParam.pageInfoVo.currentPage - 1) * rightQueryParam.pageInfoVo.pageSize;
}

</script>

<template>
  <el-breadcrumb separator="/" style="margin-left: 70px;">
    <el-breadcrumb-item :to="{ path: '/' }">护理管理</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">护理项目</a></el-breadcrumb-item>
  </el-breadcrumb>

  <div class="common-layot" style="overflow-x: hidden;">
    <el-container style="margin-top: 25px;">
      <el-header>
        <div style="margin-left: 50px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="项目：">
                <!-- 绑定到左侧查询参数 -->
                <el-input clearable v-model="leftQueryParam.customer.customerName" placeholder="输入名称或编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button @click="btnQuery" type="primary">查询</el-button>
              <!-- 新增按钮 -->
              <el-button @click="showAddDialog" type="success" style="margin-left: 10px;">添加</el-button>
            </el-col>
          </el-row>
        </div>
      </el-header>

      <el-divider style="margin-left: 60px;"></el-divider>

      <el-main>
        <el-row :gutter="20">
          <!-- 左侧表格：所有护理项目 -->
          <el-col :span="9">
            <div class="table-main" style="margin-left: 50px;">
              <div class="table-main-header">护理项目列表</div>
              <div class="table-content">
                <el-table
                  :data="leftTableData"
                  border
                  style="width: 100%; color:black"
                  stripe
                  height="450"
                >
                  <el-table-column align="center" type="index" label="序号" width="60" />
                  <el-table-column align="center" prop="serialNumber" label="编号" width="100"/>
                  <el-table-column align="center" prop="nursingName" label="名称" width="100" />
                  <el-table-column align="center" prop="servicePrice" label="价格" width="80"/>
                  <el-table-column align="center" prop="executionCycle" label="周期" width="100"/>
                  <el-table-column align="center" prop="executionTimes" label="次数" width="80"/>
                </el-table>
                
                <div style="margin-top: 20px; display: flex; justify-content: center;">
                  <el-pagination
                    background
                    small
                    :page-size="leftQueryParam.pageInfoVo.pageSize"
                    :total="leftQueryParam.pageInfoVo.total"
                    layout="prev, pager, next"
                    @current-change="handleLeftCurrentChange"
                    @prev-click="handleLeftPrevClick"
                    @next-click="handleLeftNextClick"
                  />
                </div>
              </div>
            </div>
          </el-col>

          <!-- 右侧表格：特定级别的项目 (例如一级) -->
          <el-col :span="15">
            <div class="table-main" style="margin-right: 40px;">
              <div class="table-main-header" style="padding-left: 20px">护理项目（一级配置）</div>
              <div class="table-content">
                <el-table 
                  :data="rightTableData" 
                  size="small" 
                  border
                  height="450"
                >
                  <el-table-column
                    align="center"
                    type="index"
                    label="序号"
                    width="60"
                    :index="indexMethodRecord"
                  />
                  <el-table-column align="center" prop="serialNumber" label="编号" width="100"/>
                  <el-table-column align="center" prop="nursingName" label="名称" width="150" />
                  <el-table-column align="center" prop="servicePrice" label="价格" width="100"/>
                  <el-table-column align="center" prop="executionCycle" label="执行周次" width="120"/>
                  <el-table-column align="center" prop="executionTimes" label="执行次数" width="100"/>
                  <el-table-column align="center" label="操作" width="100">
                    <template #default="scope">
                      <el-button type="primary" size="small" @click="handleEdit(scope.row)">配置</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                
                <div style="margin-top: 20px; display: flex; justify-content: center;">
                  <el-pagination
                    background
                    small
                    :page-size="rightQueryParam.pageInfoVo.pageSize"
                    :total="rightQueryParam.pageInfoVo.total"
                    layout="prev, pager, next"
                    @current-change="handleRightCurrentChange"
                    @prev-click="handleRightPrevClick"
                    @next-click="handleRightNextClick"
                  />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>

  <!-- 添加护理项目弹窗 -->
  <el-dialog v-model="addDialogVisible" title="添加/编辑护理项目" width="500px">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="编号">
        <el-input v-model="formData.serialNumber" placeholder="请输入编号"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formData.nursingName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model.number="formData.servicePrice" placeholder="请输入价格"></el-input>
      </el-form-item>
      <el-form-item label="执行周期">
        <el-select v-model="formData.executionsTimes" style="width: 100%">
          <el-option label="每日" value="每日"></el-option>
          <el-option label="每2小时" value="每2小时"></el-option>
          <el-option label="每日三餐" value="每日三餐"></el-option>
          <el-option label="每周2次" value="每周2次"></el-option>
          <el-option label="每周1次" value="每周1次"></el-option>
          <el-option label="每晚" value="每晚"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行次数">
        <el-input v-model.number="formData.executionsTimes" placeholder="请输入执行次数"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formData.description" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formData.status" style="width: 100%">
          <el-option label="启用" value="启用"></el-option>
          <el-option label="停用" value="停用"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNewItem">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="css" scoped>
.table-main {
  height: 600px;
  border: 1px solid #d4c5c5;
  display: flex;
  flex-direction: column;
}

.table-content {
  flex: 1;
  padding: 10px;
  overflow: hidden;
}

.table-main .table-main-header {
  height: 50px;
  background-color: #3ca2e0;
  color: #fff;
  font-size: 20px;
  font-family: "Microsoft YaHei";
  line-height: 50px;
  padding-left: 20px;
}
</style>