<script setup lang="js">
import { reactive, ref } from 'vue';
// 引入 Element Plus 的消息提示组件
import { ElMessage } from 'element-plus';
import {useRouter} from 'vue-router'
import loyat from '../loyat.vue';


// --- 1. 纯前端静态数据定义 ---

// 初始表格数据 (护理级别列表)
const initialTableData = [
  { id: 1, levelName: '特级护理', levelStatus: 1, createDate: '2023-01-01' },
  { id: 2, levelName: '一级护理', levelStatus: 1, createDate: '2023-01-02' },
  { id: 3, levelName: '二级护理', levelStatus: 0, createDate: '2023-01-03' },
  { id: 4, levelName: '三级护理', levelStatus: 1, createDate: '2023-01-04' },
  { id: 5, levelName: '重症监护', levelStatus: 1, createDate: '2023-01-05' },
  { id: 6, levelName: '普通护理', levelStatus: 1, createDate: '2023-01-06' },
];

// 静态房间数据
const staticRoomList = [
  { roomNo: '101', floor: '一楼' },
  { roomNo: '102', floor: '一楼' },
  { roomNo: '103', floor: '一楼' },
  { roomNo: '201', floor: '二楼' },
  { roomNo: '202', floor: '二楼' },
];

// 静态床位数据
const staticBedList = [
  { bedId: 'BED_01', bedNo: '1号床' },
  { bedId: 'BED_02', bedNo: '2号床' },
  { bedId: 'BED_03', bedNo: '3号床' },
];

// --- 2. 响应式状态定义 ---

// 表格显示的数据 (从初始数据复制一份)
let tableData = reactive([...initialTableData]);

// 弹窗控制
let changeDialogvisible = ref(false);
let reviseDialogvisible = ref(false);

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

// 调换床位表单数据
let exchangeData = reactive({
  exchangeForm: {
    id: "",
    customerName: "",
    customerSex: "",
    bedDetails: "",
    startDate: "",
    endDate: "",
    oldRoomNo: "",
    customerId: "",
    newRoomNo: "",
    newBedId: "",
    oldBedId: "",
    newRoomFloor: "一楼"
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

// 下拉框选项数据
let roomList = reactive([]);
let bedList = reactive([]);

// --- 3. 纯前端逻辑函数 ---

// 初始化加载数据
function BedInfoData() {
  // 1. 前端过滤 (如果搜索框有值)
  let filteredData = initialTableData;
  if (queryParam.bedDetailsVo.customerName) {
    const keyword = queryParam.bedDetailsVo.customerName.toLowerCase();
    filteredData = initialTableData.filter(item => 
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

// --- 调换床位逻辑 ---

function exchange(row) {
  changeDialogvisible.value = true;

  // 填充表单 (使用静态假数据补充缺失字段)
  exchangeData.exchangeForm.id = row.id;
  exchangeData.exchangeForm.customerName = row.levelName; // 借用级别名称作为名字展示
  exchangeData.exchangeForm.customerSex = "男";
  exchangeData.exchangeForm.bedDetails = row.levelName;
  exchangeData.exchangeForm.startDate = "2023-10-01";
  exchangeData.exchangeForm.endDate = "2023-10-10";
  exchangeData.exchangeForm.oldRoomNo = "101";
  exchangeData.exchangeForm.customerId = "CUST_" + row.id;
  exchangeData.exchangeForm.oldBedId = "BED_OLD";
  
  // 重置新选择
  exchangeData.exchangeForm.newRoomNo = "";
  exchangeData.exchangeForm.newBedId = "";

  // 加载房间列表
  getAllRoomsByFloor();
}

function getAllRoomsByFloor() {
  // 简单过滤静态数据
  roomList.splice(0, roomList.length);
  const filtered = staticRoomList.filter(r => r.floor === exchangeData.exchangeForm.newRoomFloor);
  roomList.push(...filtered);
}

function getBed() {
  // 只要选了房间，就显示所有静态床位 (简化逻辑)
  bedList.splice(0, bedList.length);
  bedList.push(...staticBedList);
  exchangeData.exchangeForm.newBedId = ""; // 重置已选床位
}

function exchangeSave() {
  console.log("执行前端保存:", exchangeData.exchangeForm);
  
  // 前端直接提示成功，不发送请求
  ElMessage.success('床位调换成功 (前端模拟)');
  changeDialogvisible.value = false;
  
  // 这里可以选择是否刷新列表，因为是静态数据，通常不需要变
  // BedInfoData(); 
}

const handleConfirm = () => {
  // 简单校验
  if (!exchangeData.exchangeForm.newRoomNo || !exchangeData.exchangeForm.newBedId) {
    ElMessage.warning('请选择房间和床位');
    return;
  }
  exchangeSave();
};

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
            <el-col :span="6">
              <el-button @click="btnQuery" type="primary">查询</el-button>
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
              <el-button type="primary" size="small" @click="exchange(scoped.row)">调换床位</el-button>
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

  <!-- 调换床位弹窗 -->
  <el-dialog v-model="changeDialogvisible" title="调换床位" width="400px">
    <el-form :model="exchangeData.exchangeForm" label-width="80px">
      <el-form-item label="当前级别">
        <el-input v-model="exchangeData.exchangeForm.bedDetails" disabled></el-input>
      </el-form-item>
      <el-form-item label="当前房间">
        <el-input v-model="exchangeData.exchangeForm.oldRoomNo" disabled></el-input>
      </el-form-item>
      <el-form-item label="目标楼层">
        <el-select v-model="exchangeData.exchangeForm.newRoomFloor" @change="getAllRoomsByFloor" style="width: 100%">
          <el-option label="一楼" value="一楼"></el-option>
          <el-option label="二楼" value="二楼"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标房间">
        <el-select v-model="exchangeData.exchangeForm.newRoomNo" @change="getBed" style="width: 100%" placeholder="请选择房间">
          <el-option v-for="item in roomList" :key="item.roomNo" :label="item.roomNo" :value="item.roomNo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标床位">
        <el-select v-model="exchangeData.exchangeForm.newBedId" style="width: 100%" placeholder="请先选房间">
          <el-option v-for="item in bedList" :key="item.bedId" :label="item.bedNo" :value="item.bedId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="changeDialogvisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定调换</el-button>
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