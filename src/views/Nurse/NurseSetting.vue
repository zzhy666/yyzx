<script setup lang="js">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import loyat from '../loyat.vue';

// ================= 1. 静态数据定义 (Mock Data) =================

// 初始客户护理设置数据
const initialCustomerData = [
  { id: 1, customerName: '张三', customerAge: 75, customerSex: 0, roomNo: '101', buildingNo: '606', contactTel: '13800138001', levelName: '一级护理', bedId: 'B101-1', startDate: '2023-01-01', endDate: '2023-12-31', customerId: 'C001' },
  { id: 2, customerName: '李四', customerAge: 82, customerSex: 1, roomNo: '102', buildingNo: '606', contactTel: '13800138002', levelName: '二级护理', bedId: 'B102-1', startDate: '2023-02-01', endDate: '2023-12-31', customerId: 'C002' },
  { id: 3, customerName: '王五', customerAge: 68, customerSex: 0, roomNo: '103', buildingNo: '606', contactTel: '13800138003', levelName: '三级护理', bedId: 'B103-1', startDate: '2023-03-01', endDate: '2023-12-31', customerId: 'C003' },
  { id: 4, customerName: '赵六', customerAge: 90, customerSex: 1, roomNo: '101', buildingNo: '606', contactTel: '13800138004', levelName: '特级护理', bedId: 'B101-2', startDate: '2023-04-01', endDate: '2023-12-31', customerId: 'C004' },
  { id: 5, customerName: '孙七', customerAge: 77, customerSex: 0, roomNo: '104', buildingNo: '606', contactTel: '13800138005', levelName: '一级护理', bedId: 'B104-1', startDate: '2023-05-01', endDate: '2023-12-31', customerId: 'C005' },
  { id: 6, customerName: '周八', customerAge: 85, customerSex: 1, roomNo: '105', buildingNo: '606', contactTel: '13800138006', levelName: '二级护理', bedId: 'B105-1', startDate: '2023-06-01', endDate: '2023-12-31', customerId: 'C006' },
];

// 静态房间数据（保留但不再使用）
const staticRoomList = [
  { roomNo: '101', floor: '一楼' },
  { roomNo: '102', floor: '一楼' },
  { roomNo: '103', floor: '一楼' },
  { roomNo: '201', floor: '二楼' },
  { roomNo: '202', floor: '二楼' },
];

// 静态床位数据（保留但不再使用）
const staticBedList = [
  { bedId: 'BED_01', bedNo: '1号床' },
  { bedId: 'BED_02', bedNo: '2号床' },
  { bedId: 'BED_03', bedNo: '3号床' },
];

// ================= 2. 响应式状态 =================

// 表格显示的数据
let tableData = reactive([]);

// 查询参数
let queryParam = reactive({
  pageInfoVo: {
    currentPage: 1,
    pageSize: 5,
    total: initialCustomerData.length,
    pageNum: 0
  },
  bedDetailsVo: {
    customerName: "",
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

// ================= 3. 核心逻辑函数 =================

// 渲染表格数据 (包含搜索和分页)
function BedInfoData() {
  // 1. 搜索过滤
  const keyword = queryParam.bedDetailsVo.customerName.toLowerCase();
  let filteredData = initialCustomerData;

  if (keyword) {
    filteredData = initialCustomerData.filter(item =>
      item.customerName.toLowerCase().includes(keyword)
    );
  }

  // 2. 更新总数
  queryParam.pageInfoVo.total = filteredData.length;

  // 3. 分页切片
  const start = (queryParam.pageInfoVo.currentPage - 1) * queryParam.pageInfoVo.pageSize;
  const end = start + queryParam.pageInfoVo.pageSize;
  const paginatedData = filteredData.slice(start, end);

  // 4. 更新视图
  tableData.splice(0, tableData.length);
  tableData.push(...paginatedData);
}

// 初始化加载
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

// --- 修改/配置逻辑 ---

function revise(row) {
  reviseDialogvisible.value = true;
  reviseData.reviseForm.id = row.id;
  reviseData.reviseForm.customerName = row.customerName;
  reviseData.reviseForm.customerSex = row.customerSex;
  reviseData.reviseForm.bedDetails = row.levelName;
  reviseData.reviseForm.startDate = row.startDate;
  reviseData.reviseForm.endDate = row.endDate;
  reviseData.reviseForm.customerId = row.customerId;
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
  <!-- 显示标题 -->
  <div style="margin-left: 70px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">护理管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户护理设置</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  
  <div class="common-layout" style="overflow-x: hidden;">
    <!-- 外层容器 -->
    <el-container style="margin-top: 25px;">
      <!-- 顶部容器 -->
      <el-header>
        <div style="margin-left: 50px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="姓名：">
                <el-input clearable v-model="queryParam.bedDetailsVo.customerName" placeholder="输入客户姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button @click="btnQuery" type="primary">查询</el-button>
            </el-col>
          </el-row>
        </div>
      </el-header>

      <!-- 分割线 -->
      <el-divider style="margin:0;margin-left: 48px;"></el-divider>

      <!-- 主要区域容器 -->
      <el-main style="margin-left: 28px">
        <!-- 表格区 -->
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80" />
          <el-table-column align="center" prop="customerName" label="客户姓名" width="120" />
          <el-table-column align="center" prop="customerAge" label="年龄" width="80" />
          <el-table-column align="center" prop="customerSex" label="性别" width="80">
            <template #default="scoped">
              {{ scoped.row.customerSex == 0 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="roomNo" label="房间号" width="100" />
          <el-table-column align="center" prop="buildingNo" label="所属楼房" width="120" />
          <el-table-column align="center" prop="contactTel" label="联系电话" width="150" />
          <el-table-column align="center" prop="levelName" label="护理级别" width="120" />
          <el-table-column align="center" label="操作" width="200">
            <template #default="scoped">
              <!-- 已删除调换床位按钮 -->
              <el-button type="warning" size="small" @click="revise(scoped.row)">修改信息</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
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

  <!-- 修改信息弹窗 -->
  <el-dialog v-model="reviseDialogvisible" title="修改护理信息" width="400px">
    <el-form :model="reviseData.reviseForm" label-width="80px">
      <el-form-item label="客户姓名">
        <el-input v-model="reviseData.reviseForm.customerName" disabled></el-input>
      </el-form-item>
      <el-form-item label="护理级别">
        <el-input v-model="reviseData.reviseForm.bedDetails" disabled></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-input v-model="reviseData.reviseForm.startDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="结束日期">
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
        <el-button type="primary" @click="handleSaveConfirm">保存修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="css" scoped>
</style>