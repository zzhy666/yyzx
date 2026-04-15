<script setup lang="js">
import { reactive, ref } from 'vue';
import {useRouter} from 'vue-router'
import loyat from '../loyat.vue';

// --- 1. 模拟数据 (Mock Data) ---

// 模拟客户数据
const mockCustomers = [
  { id: 1, customerName: '张大爷', customerAge: 78, customerSex: 0, bedNo: '101-A', levelId: '一级护理' },
  { id: 2, customerName: '李奶奶', customerAge: 82, customerSex: 1, bedNo: '102-B', levelId: '二级护理' },
  { id: 3, customerName: '王叔叔', customerAge: 75, customerSex: 0, bedNo: '103-A', levelId: '三级护理' },
  { id: 4, customerName: '赵阿姨', customerAge: 80, customerSex: 1, bedNo: '104-C', levelId: '一级护理' },
  { id: 5, customerName: '孙先生', customerAge: 72, customerSex: 0, bedNo: '105-A', levelId: '二级护理' },
  { id: 6, customerName: '周女士', customerAge: 85, customerSex: 1, bedNo: '106-B', levelId: '特级护理' },
];

// 模拟护理记录/项目数据 (对应原代码右侧表格)
const mockNursingRecords = [
  { id: 101, serialNumber: 'HL001', nursingName: '翻身拍背', servicePrice: 50, executionCycle: '每日', executionTimes: 2, retreattime: 1, retreattype: '基础护理', retreatreason: '护士A', audittime: '13800001111', status: '已完成', auditstatus: '2023-10-27 09:00' },
  { id: 102, serialNumber: 'HL002', nursingName: '测量血压', servicePrice: 10, executionCycle: '每日', executionTimes: 1, retreattime: 1, retreattype: '生命体征', retreatreason: '护士B', audittime: '13800002222', status: '已完成', auditstatus: '2023-10-27 09:30' },
  { id: 103, serialNumber: 'HL003', nursingName: '喂药服务', servicePrice: 20, executionCycle: '按需', executionTimes: 3, retreattime: 1, retreattype: '医疗护理', retreatreason: '护士A', audittime: '13800001111', status: '进行中', auditstatus: '2023-10-27 10:00' },
  { id: 104, serialNumber: 'HL004', nursingName: '清洁护理', servicePrice: 80, executionCycle: '每周', executionTimes: 1, retreattime: 1, retreattype: '生活护理', retreatreason: '护工C', audittime: '13800003333', status: '待执行', auditstatus: '2023-10-28 08:00' },
  { id: 105, serialNumber: 'HL005', nursingName: '心理疏导', servicePrice: 100, executionCycle: '每月', executionTimes: 1, retreattime: 1, retreattype: '精神护理', retreatreason: '咨询师D', audittime: '13800004444', status: '已完成', auditstatus: '2023-10-26 15:00' },
];

// --- 2. 响应式状态 ---

// 客户数据集
let khxxList = reactive([]);
// 护理记录数据集 (原变量名为 backdownList，这里保持兼容但实际填充护理数据)
let backdownList = reactive([]);

// 客户信息查询参数
let queryParam = reactive({
  pageInfoVo: {
    currentPage: 1,
    pageSize: 5,
    total: 0,
    pageNum: 0
  },
  customer: {
    customerName: "",
  }
});

// 护理记录查询参数 (用于右侧表格分页模拟)
let queryParamTZ = reactive({
  pageInfoVo: {
    currentPage: 1,
    pageSize: 5,
    total: 0,
    pageNum: 0
  }
});

// --- 3. 核心逻辑方法 ---

// 获取/过滤客户信息列表
function getTableDate() {
  // 1. 过滤数据
  let filteredData = mockCustomers;
  if (queryParam.customer.customerName) {
    filteredData = mockCustomers.filter(item => 
      item.customerName.includes(queryParam.customer.customerName)
    );
  }

  // 2. 模拟分页切片 (可选，为了演示分页效果)
  const start = (queryParam.pageInfoVo.currentPage - 1) * queryParam.pageInfoVo.pageSize;
  const end = start + queryParam.pageInfoVo.pageSize;
  const pageData = filteredData.slice(start, end);

  // 3. 更新响应式数据
  khxxList.splice(0, khxxList.length, ...pageData);
  
  // 4. 更新分页总数
  queryParam.pageInfoVo.total = filteredData.length;
  queryParam.pageInfoVo.pageNum = Math.ceil(filteredData.length / queryParam.pageInfoVo.pageSize) || 1;
}

// 获取护理记录列表
function getTZTableDate() {
  // 这里简单展示所有模拟数据，也可以类似上面做分页切片
  // 为了演示，我们暂时展示全部，或者根据 queryParamTZ 做切片
  
  const start = (queryParamTZ.pageInfoVo.currentPage - 1) * queryParamTZ.pageInfoVo.pageSize;
  const end = start + queryParamTZ.pageInfoVo.pageSize;
  const pageData = mockNursingRecords.slice(start, end);

  backdownList.splice(0, backdownList.length, ...pageData);
  
  queryParamTZ.pageInfoVo.total = mockNursingRecords.length;
  queryParamTZ.pageInfoVo.pageNum = Math.ceil(mockNursingRecords.length / queryParamTZ.pageInfoVo.pageSize) || 1;
}

// 初始化加载
getTableDate();
getTZTableDate();

// --- 4. 事件处理 ---

// 左侧表格分页事件
function handleCurrentChange(val) {
  queryParam.pageInfoVo.currentPage = val;
  getTableDate();
}

function handlePrevClick(val) {
  queryParam.pageInfoVo.currentPage = val;
  getTableDate();
}

function handleNextClick(val) {
  queryParam.pageInfoVo.currentPage = val;
  getTableDate();
}

// 右侧表格分页事件 (原代码复用了左侧函数，这里独立出来)
function handleRightCurrentChange(val) {
  queryParamTZ.pageInfoVo.currentPage = val;
  getTZTableDate();
}

function handleRightPrevClick(val) {
  queryParamTZ.pageInfoVo.currentPage = val;
  getTZTableDate();
}

function handleRightNextClick(val) {
  queryParamTZ.pageInfoVo.currentPage = val;
  getTZTableDate();
}

// 查询按钮
function btnQuery() {
  queryParam.pageInfoVo.currentPage = 1; // 重置到第一页
  getTableDate();
}

// 右侧表格序号计算方法 (原代码引用了但未定义)
function indexMethodRecord(index) {
  return (queryParamTZ.pageInfoVo.currentPage - 1) * queryParamTZ.pageInfoVo.pageSize + index + 1;
}

</script>

<template>
  <el-breadcrumb separator="/" style="margin-left: 70px;">
    <el-breadcrumb-item :to="{ path: '/' }">护理管理</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">护理记录</a></el-breadcrumb-item>
  </el-breadcrumb>

  <div class="common-layot" style="overflow-x: hidden;">
    <el-container style="margin-top: 25px;">
        <el-header>
        <div style="margin-left: 50px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="姓名：">
                <el-input clearable v-model="queryParam.customer.customerName" placeholder="输入客户姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button @click="btnQuery" type="primary">查询</el-button>
            </el-col>
          </el-row>
        </div>
      </el-header>

      <el-divider style="margin-left: 60px;"></el-divider>

      <el-main>
        <el-row :gutter="20">
          <!-- 左侧：客户信息 -->
          <el-col :span="9">
            <div class="table-main" style="margin-left: 50px;">
              <!-- 表格的标题 -->
              <div class="table-main-header">客户信息</div>
              <!-- 表格信息 -->
              <div class="table-content" style="padding: 10px;">
                <el-table
                  :data="khxxList"
                  border
                  style="width: 100%;color:black"
                  stripe
                  height="450"
                >
                  <el-table-column align="center" type="index" label="序号" width="60" />
                  <el-table-column align="center" prop="customerName" label="姓名" />
                  <el-table-column align="center" prop="customerAge" label="年龄" />
                  <el-table-column align="center" prop="customerSex" label="性别">
                    <template #default="scope">
                      {{ scope.row.customerSex == 0 ? '男' : '女' }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="bedNo" label="床号" />
                  <el-table-column align="center" prop="levelId" label="护理级别" />
                </el-table>
                <!-- 分页插件 -->
                <div style="margin-top: 20px; display: flex; justify-content: center;">
                  <el-pagination
                    background
                    :page-size="queryParam.pageInfoVo.pageSize"
                    :total="queryParam.pageInfoVo.total"
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    @prev-click="handlePrevClick"
                    @next-click="handleNextClick"
                  />
                </div>
              </div>
            </div>
          </el-col>

          <!-- 右侧：护理记录 -->
          <el-col :span="15">
            <div class="table-main" style="margin-right: 40px;">
              <div class="table-main-header" style="padding-left: 20px">护理记录</div>
              <!-- 表格 -->
              <div class="table-content" style="padding: 10px;">
                <el-table 
                  :data="backdownList" 
                  size="small" 
                  height="450"
                  border
                  stripe
                >
                  <el-table-column
                    align="center"
                    :index="indexMethodRecord"
                    type="index"
                    label="序号"
                    width="60"
                  />
                  <el-table-column align="center" prop="serialNumber" label="项目编号" width="100"/>
                  <el-table-column align="center" prop="nursingName" label="项目名称" width="120" />
                  <el-table-column align="center" prop="servicePrice" label="价格" width="80"/>
                  <el-table-column align="center" prop="executionCycle" label="执行周期" width="100"/>
                  <el-table-column align="center" prop="executionTimes" label="次数" width="80"/>
                  <el-table-column align="center" prop="retreattime" label="数量" width="80" />
                  <el-table-column align="center" prop="retreattype" label="内容类型" width="100"/>
                  <el-table-column align="center" prop="retreatreason" label="护理人员" width="100" />
                  <el-table-column align="center" prop="audittime" label="人员号码" width="120" />
                  <el-table-column align="center" prop="auditstatus" label="护理时间" width="160"/>
                  <el-table-column align="center" label="操作" width="100">
                    <template #default>
                      <el-button type="primary" link size="small">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页插件 -->
                <div style="margin-top: 20px; display: flex; justify-content: center;">
                  <el-pagination
                    background
                    :page-size="queryParamTZ.pageInfoVo.pageSize"
                    :total="queryParamTZ.pageInfoVo.total"
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
</template>

<style lang="css" scoped>
.table-main {
  height: 600px;
  border: 1px solid #d4c5c5;
  display: flex;
  flex-direction: column;
}

.table-main .table-main-header {
  height: 50px;
  background-color: #3ca2e0;
  color: #fff;
  font-size: 20px;
  font-family: "Microsoft YaHei";
  line-height: 50px;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.table-content {
  flex: 1;
  overflow: hidden; /* 让内部表格滚动 */
  display: flex;
  flex-direction: column;
}
</style>