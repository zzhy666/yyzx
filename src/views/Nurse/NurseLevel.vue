<script setup lang="js">
import { reactive, ref } from 'vue';
// 引入 Element Plus 的消息提示组件
import { ElMessage } from 'element-plus';
import {useRouter} from 'vue-router'
import loyat from '../loyat.vue';


// --- 1. 纯前端静态数据定义 ---

// 初始表格数据 (护理级别列表)
// 注意：为了支持搜索和新增后的一致性，我们将作为数据源
const initialTableData = reactive([
  { id: 1, levelName: '特级护理', levelStatus: 1, createDate: '2023-01-01' },
  { id: 2, levelName: '一级护理', levelStatus: 1, createDate: '2023-01-02' },
  { id: 3, levelName: '二级护理', levelStatus: 0, createDate: '2023-01-03' },
  { id: 4, levelName: '三级护理', levelStatus: 1, createDate: '2023-01-04' },
  { id: 5, levelName: '重症监护', levelStatus: 1, createDate: '2023-01-05' },
  { id: 6, levelName: '普通护理', levelStatus: 1, createDate: '2023-01-06' },
]);

// --- 2. 响应式状态定义 ---

// 表格显示的数据 (从初始数据复制一份用于分页展示)
let tableData = reactive([]);

// 弹窗控制
let reviseDialogvisible = ref(false);
let addDialogVisible = ref(false); // 新增弹窗控制

// 分页参数 (纯前端分页逻辑需要用到)
let queryParam = reactive({
  pageInfoVo: {
    currentPage: 1,
    pageSize: 5,
    total: initialTableData.length, // 初始总数
  },
  bedDetailsVo: {
    customerName: "", // 用于搜索过滤
  }
});

// 修改信息表单数据
let reviseData = reactive({
  reviseForm: {
    id: "",
    customerName: "",
    customerSex: "",
    bedDetails: "",
    startDate: "",
    endDate: "",
    customerId: ""
  }
});

// 新增护理级别表单数据
let formData = reactive({
  levelName: '',
  levelStatus: 1 // 默认启用
});

// --- 3. 纯前端逻辑函数 ---

// 初始化加载数据 / 刷新数据
function BedInfoData() {
  // 1. 前端过滤 (如果搜索框有值)
  let filteredData = [...initialTableData]; // 使用展开运算符创建副本，避免直接修改源数据影响其他逻辑
  if (queryParam.bedDetailsVo.customerName) {
    const keyword = queryParam.bedDetailsVo.customerName.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.levelName.toLowerCase().includes(keyword)
    );
  }

  // 2. 更新总数
  queryParam.pageInfoVo.total = filteredData.length;

  // 3. 前端分页切片
  const start = (queryParam.pageInfoVo.currentPage - 1) * queryParam.pageInfoVo.pageSize;
  const end = start + queryParam.pageInfoVo.pageSize;
  const paginatedData = filteredData.slice(start, end);

  // 4. 更新视图数据
  tableData.splice(0, tableData.length);
  tableData.push(...paginatedData);
}

// 页面加载时执行一次
BedInfoData();

// 分页事件处理
function handleCurrentChange(val) {
  queryParam.pageInfoVo.currentPage = val;
  BedInfoData();
}

function handlePrevClick(val) {
  queryParam.pageInfoVo.currentPage = val;
  BedInfoData();
}

function handleNextClick(val) {
  queryParam.pageInfoVo.currentPage = val;
  BedInfoData();
}

// 查询按钮
function btnQuery() {
  queryParam.pageInfoVo.currentPage = 1; // 重置到第一页
  BedInfoData();
}

// --- 新增护理级别逻辑 ---

function showAddDialog() {
  addDialogVisible.value = true;
  // 重置表单
  formData.levelName = '';
  formData.levelStatus = 1;
}

function saveNewLevel() {
  if (!formData.levelName.trim()) {
    ElMessage.warning('请输入护理级别名称');
    return;
  }

  // 生成新的 ID（取当前最大ID + 1）
  const maxId = initialTableData.length > 0 ? Math.max(...initialTableData.map(item => item.id)) : 0;
  const newId = maxId + 1;

  // 创建新对象
  const newLevel = {
    id: newId,
    levelName: formData.levelName,
    levelStatus: formData.levelStatus,
    createDate: new Date().toISOString().split('T')[0]
  };

  // 添加到源数据中 (这样搜索也能搜到)
  initialTableData.push(newLevel);

  // 关闭弹窗
  addDialogVisible.value = false;

  // 刷新列表显示
  // 如果当前不在第一页，且新增导致页数变化，可能需要调整页码，这里简单重置到第一页或保持当前页刷新
  BedInfoData(); 

  ElMessage.success('护理级别添加成功！');
}

// --- 修改/配置逻辑 ---

function revise(row) {
  reviseDialogvisible.value = true;
  reviseData.reviseForm.id = row.id;
  reviseData.reviseForm.customerName = row.levelName;
  reviseData.reviseForm.customerSex = "女";
  reviseData.reviseForm.bedDetails = row.levelName;
  reviseData.reviseForm.startDate = "2023-10-01";
  reviseData.reviseForm.endDate = "";
  reviseData.reviseForm.customerId = "CUST_" + row.id;
}

function reviseSave() {
  console.log("执行前端修改:", reviseData.reviseForm);
  ElMessage.success('修改信息成功 (前端模拟)');
  reviseDialogvisible.value = false;
}

const handleSaveConfirm = () => {
  if (!reviseData.reviseForm.endDate) {
    ElMessage.warning('请选择结束日期');
    return;
  }
  reviseSave();
};

</script>

<template>
  <div style="margin-left: 70px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">护理管理</el-breadcrumb-item>
      <el-breadcrumb-item>护理级别</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  
  <div class="common-layout" style="overflow-x: hidden;">
    <el-container style="margin-top: 25px;">
      <el-header>
        <div style="margin-left: 50px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="级别：">
                <el-input 
                  clearable 
                  v-model="queryParam.bedDetailsVo.customerName" 
                  placeholder="输入级别名称搜索"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button @click="btnQuery" type="primary">查询</el-button>
              <!-- 新增添加按钮 -->
              <el-button @click="showAddDialog" type="success" style="margin-left: 10px;">添加</el-button>
            </el-col>
          </el-row>
        </div>
      </el-header>

      <el-divider style="margin:0;margin-left: 48px;"></el-divider>

      <el-main style="margin-left: 28px">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="100" />
          <el-table-column align="center" prop="levelName" label="护理级别" width="200" />
          <el-table-column align="center" label="状态" width="150">
            <template #default="scope">
              <el-tag :type="scope.row.levelStatus === 1 ? 'success' : 'info'">
                {{ scope.row.levelStatus === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template #default="scoped">
              <!-- 已删除调换床位按钮 -->
              <el-button type="warning" size="small" @click="revise(scoped.row)">护理项目配置</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="position: fixed; margin-left: 10px;margin-top: 25px;"
          background
          :page-size="queryParam.pageInfoVo.pageSize"
          layout="prev, pager, next"
          :total="queryParam.pageInfoVo.total"
          @current-change="handleCurrentChange"
          @prev-click="handlePrevClick"
          @next-click="handleNextClick"
        />
      </el-main>
    </el-container>
  </div>

  <!-- 新增护理级别弹窗 -->
  <el-dialog v-model="addDialogVisible" title="添加护理级别" width="400px">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="护理级别">
        <el-input v-model="formData.levelName" placeholder="请输入护理级别名称"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formData.levelStatus" style="width: 100%">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNewLevel">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 护理项目配置弹窗 -->
  <el-dialog v-model="reviseDialogvisible" title="护理项目配置" width="400px">
    <el-form :model="reviseData.reviseForm" label-width="80px">
      <el-form-item label="护理级别">
        <el-input v-model="reviseData.reviseForm.bedDetails" disabled></el-input>
      </el-form-item>
      <el-form-item label="生效开始">
        <el-input v-model="reviseData.reviseForm.startDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="生效结束">
        <el-date-picker 
          v-model="reviseData.reviseForm.endDate" 
          type="date" 
          placeholder="选择结束日期" 
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="reviseDialogvisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveConfirm">保存配置</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="css" scoped>
</style>