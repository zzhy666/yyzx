<template>
  <!-- 整个页面的最外层根容器，包裹所有内容 -->
  <div class="healthy-container">
    <!-- 页面主体内容区域，用于展示所有业务模块 -->
    <div class="main-content">
      <!-- 页面头部区域，包含标题和切换按钮 -->
      <div class="page-header">
        <!-- 页面标题标签，动态展示当前页面名称 -->
        <h2 class="page-title"></h2>

        <!-- 按钮容器，存放页面切换按钮，设置顶部外边距 -->
        <div class="switch-buttons" style="margin-top: 10px;">
          <!-- 切换到【设置服务对象】页面的按钮 -->
          <button 
            class="btn" 
            :class="currentPage === '设置服务对象' ? 'btn-primary' : 'btn-default'"
            @click="gotoServiceObj"
          >
            设置服务对象
          </button>
          <!-- 切换到【服务关注】页面的按钮 -->
          <button 
            class="btn" 
            :class="currentPage === '服务关注' ? 'btn-primary' : 'btn-default'"
            style="margin-left: 8px;"
            @click="gotoFollow"
          >
            服务关注
          </button>
        </div>
      </div>

      <!-- 搜索工具栏容器，包含搜索框和查询按钮 -->
      <div class="toolbar">
        <!-- 搜索输入框，双向绑定搜索关键词 -->
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="输入客户姓名查询"
        />
        <!-- 查询按钮，点击触发搜索方法 -->
        <button @click="search" class="btn btn-primary">查询</button>
      </div>

      <!-- 客户信息展示模块 -->
      <div class="section">
        <!-- 模块标题 -->
        <h3>客户信息</h3>
        <!-- 客户信息表格 -->
        <table class="data-table">
          <!-- 表格表头部分 -->
          <thead>
            <!-- 表头行 -->
            <tr>
              <!-- 每一列的标题 -->
              <th>序号</th>
              <th>客户姓名</th>
              <th>年龄</th>
              <th>性别</th>
              <th>房间号</th>
              <th>床号</th>
              <th>所属病房</th>
              <th>联系电话</th>
              <th>护理级别</th>
              <th>操作</th>
            </tr>
          </thead>
          <!-- 表格内容部分 -->
          <tbody>
            <!-- 循环遍历客户数据，生成表格行 -->
            <tr v-for="(client, index) in filteredClients" :key="client.id">
              <!-- 序号列，从1开始 -->
              <td>{{ index + 1 }}</td>
              <!-- 客户姓名 -->
              <td>{{ client.name }}</td>
              <!-- 年龄 -->
              <td>{{ client.age }}</td>
              <!-- 性别 -->
              <td>{{ client.gender }}</td>
              <!-- 房间号 -->
              <td>{{ client.roomNo }}</td>
              <!-- 床号 -->
              <td>{{ client.bedNo }}</td>
              <!-- 所属病房 -->
              <td>{{ client.bedRoom }}</td>
              <!-- 联系电话 -->
              <td>{{ client.phone }}</td>
              <!-- 护理级别 -->
              <td>{{ client.nurseLevel }}</td>
              <!-- 操作列，包含日常护理按钮 -->
              <td>
                <!-- 点击按钮打开添加护理记录弹窗 -->
                <button @click="openNurseRecord(client)" class="btn btn-blue">日常护理</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 条件渲染：只有当前页面是【服务关注】时才显示 -->
      <template v-if="currentPage === '服务关注'">
        <!-- 护理项目模块 -->
        <div class="section">
          <!-- 模块标题 -->
          <h3>护理项目</h3>
          <!-- 护理项目表格 -->
          <table class="data-table">
            <!-- 表头 -->
            <thead>
              <tr>
                <th>序号</th>
                <th>护理项目编号</th>
                <th>护理项目名称</th>
                <th>护理标准</th>
                <th>价格</th>
                <th>余量</th>
                <th>服务到期日期</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <!-- 表格内容 -->
            <tbody>
              <!-- 循环遍历护理项目数据 -->
              <tr v-for="(project, idx) in nurseProjects" :key="project.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ project.projectId }}</td>
                <td>{{ project.name }}</td>
                <td>{{ project.standard }}</td>
                <td>{{ project.price }}元/次</td>
                <td>{{ project.quantity }}</td>
                <td>{{ project.expireDate }}</td>
                <!-- 状态标签，动态样式 -->
                <td>
                  <span :class="['status-tag', project.status === '已启用' ? 'active' : 'inactive']">
                    {{ project.status }}
                  </span>
                </td>
                <!-- 操作按钮 -->
                <td>
                  <button @click="handleNurse(project)" class="btn btn-blue">护理</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 护理记录模块 -->
        <div class="section">
          <h3>护理记录</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>护理项目编号</th>
                <th>护理项目名称</th>
                <th>护理数量</th>
                <th>护理内容</th>
                <th>护理人员</th>
                <th>护理人员手机</th>
                <th>护理时间</th>
              </tr>
            </thead>
            <tbody>
              <!-- 循环遍历护理记录数据 -->
              <tr v-for="(record, idx) in nurseRecords" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ record.projectId }}</td>
                <td>{{ record.projectName }}</td>
                <td>{{ record.quantity }}</td>
                <td>{{ record.content }}</td>
                <td>{{ record.nurseName }}</td>
                <td>{{ record.phone }}</td>
                <td>{{ record.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- 弹窗遮罩层，点击空白处关闭弹窗 -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <!-- 弹窗内容容器 -->
        <div class="modal-dialog">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <h3>添加护理记录</h3>
            <!-- 关闭按钮 -->
            <span class="close-btn" @click="closeModal">&times;</span>
          </div>
          <!-- 弹窗表单主体 -->
          <div class="modal-body">
            <!-- 表单项：客户姓名 -->
            <div class="form-group">
              <label>客户姓名：</label>
              <input type="text" v-model="formData.clientName" disabled />
            </div>
            <!-- 表单项：护理项目编号 -->
            <div class="form-group">
              <label>护理项目编号：</label>
              <input type="text" v-model="formData.projectId" />
            </div>
            <!-- 表单项：护理项目名称 -->
            <div class="form-group">
              <label>护理项目名称：</label>
              <select v-model="formData.projectName">
                <option value="">请选择</option>
                <option value="吸氧">吸氧</option>
                <option value="协助服药">协助服药</option>
                <option value="血压监测">血压监测</option>
                <option value="康复训练">康复训练</option>
              </select>
            </div>
            <!-- 表单项：护理时间 -->
            <div class="form-group">
              <label>护理时间：</label>
              <input type="datetime-local" v-model="formData.time" required />
            </div>
            <!-- 表单项：护理数量 -->
            <div class="form-group">
              <label>护理数量：</label>
              <input type="number" v-model.number="formData.quantity" min="1" required />
            </div>
            <!-- 表单项：护理内容 -->
            <div class="form-group">
              <label>护理内容：</label>
              <textarea v-model="formData.content" rows="3"></textarea>
            </div>
          </div>
          <!-- 弹窗底部按钮区 -->
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-default">取消</button>
            <button @click="saveNurseRecord" class="btn btn-primary">立即创建</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入Vue3组合式API：ref创建响应式变量，computed创建计算属性
import { ref, computed } from 'vue';

// 定义当前页面变量，默认显示【服务关注】页面
const currentPage = ref('服务关注');

// 定义搜索关键词变量，存储搜索框输入内容
const searchKeyword = ref('');

// 定义客户数据数组，模拟后台返回的客户信息
const clients = ref([
  { id: 1, name: '孙瑞英', age: 68, gender: '女', roomNo: '2012', bedNo: '2012-1', bedRoom: '606', phone: '18167564213', nurseLevel: '二级' },
  { id: 2, name: '张帆', age: 77, gender: '女', roomNo: '1014', bedNo: '1014-1', bedRoom: '606', phone: '17745189064', nurseLevel: '三级' },
  { id: 3, name: '薛月兰', age: 67, gender: '女', roomNo: '2005', bedNo: '2005-1', bedRoom: '605', phone: '13517177668', nurseLevel: '一级' }
]);

// 筛选后的客户列表，根据关键词自动过滤
const filteredClients = computed(() => {
  // 如果没有输入关键词，返回全部客户
  if (!searchKeyword.value) return clients.value;
  // 否则返回包含关键词的客户数据
  return clients.value.filter(client => client.name.includes(searchKeyword.value));
});

// 护理项目数据，模拟后台护理项目列表
const nurseProjects = ref([
  { id: 1, projectId: 'HLXM0001', name: '吸氧', standard: '每小时一次', price: 60, quantity: 5, expireDate: '2024-01-19', status: '已启用' },
  { id: 2, projectId: 'HLXM0002', name: '协助服药', standard: '每日两次', price: 20, quantity: 2, expireDate: '2023-11-17', status: '已启用' }
]);

// 护理记录数据，存储已添加的护理记录
const nurseRecords = ref([
  { projectId: 'HLXM0001', projectName: '吸氧', quantity: 1, content: '吸氧治疗', nurseName: '吴丹', phone: '13517177668', time: '2023-11-24' },
  { projectId: 'HLXM0002', projectName: '协助服药', quantity: 1, content: '协助服用降压药', nurseName: '吴丹', phone: '13517177668', time: '2023-11-24' }
]);

// 控制弹窗显示/隐藏，默认隐藏(false)
const showModal = ref(false);

// 弹窗表单数据对象，存储用户输入的信息
const formData = ref({
  clientName: '',    // 客户姓名
  projectId: '',     // 护理项目编号
  projectName: '',   // 护理项目名称
  time: '',          // 护理时间
  quantity: 1,       // 护理数量，默认1
  content: ''        // 护理内容
});

// 切换到【设置服务对象】页面的方法
const gotoServiceObj = () => {
  currentPage.value = '设置服务对象';
};

// 切换到【服务关注】页面的方法
const gotoFollow = () => {
  currentPage.value = '服务关注';
};

// 搜索按钮点击事件
const search = () => {
  alert('搜索功能暂未实现');
};

// 打开添加护理记录弹窗
const openNurseRecord = (client) => {
  // 自动填充当前客户姓名
  formData.value.clientName = client.name;
  // 重置其他表单字段
  formData.value.projectId = '';
  formData.value.projectName = '';
  formData.value.time = new Date().toISOString().slice(0, 16);
  formData.value.quantity = 1;
  formData.value.content = '';
  // 显示弹窗
  showModal.value = true;
};

// 点击护理按钮触发的事件
const handleNurse = (project) => {
  alert(`执行护理项目：${project.name}`);
};

// 关闭弹窗
const closeModal = () => {
  showModal.value = false;
};

// 保存护理记录到列表
const saveNurseRecord = () => {
  // 校验必填项是否填写
  if (!formData.value.projectName || !formData.value.time) {
    alert('请填写必填项！');
    return;
  }
  // 将表单数据添加到护理记录数组
  nurseRecords.value.push({
    ...formData.value,
    projectId: formData.value.projectId || `HLXM${Math.floor(Math.random() * 10000)}`
  });
  // 关闭弹窗
  closeModal();
  // 提示添加成功
  alert('护理记录添加成功！');
};
</script>

<style scoped>
/* 页面最外层容器样式：弹性布局，占满屏幕 */
.healthy-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* 主体内容区样式：自动占满剩余空间，带滚动条 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 头部区域底部外边距 */
.page-header {
  margin-bottom: 20px;
}

/* 搜索栏样式：弹性布局，元素居中对齐，间距10px */
.toolbar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 搜索输入框样式：内边距、边框、圆角、宽度 */
.toolbar input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 220px;
}

/* 模块卡片样式：背景色、内边距、圆角、阴影 */
.section {
  margin-bottom: 30px;
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* 模块标题样式：去掉顶部margin，设置颜色 */
.section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #303133;
}

/* 表格样式：宽度100%，合并边框 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

/* 表格单元格样式：边框、内边距、居中、字体大小 */
.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: center;
  font-size: 13px;
}

/* 表头样式：背景色、加粗 */
.data-table th {
  background: #f0f0f0;
  font-weight: bold;
}

/* 状态标签样式：内边距、圆角、字体大小 */
.status-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

/* 启用状态标签：绿色背景、绿色文字 */
.status-tag.active {
  background-color: #f0f9eb;
  color: #67c23a;
}

/* 禁用状态标签：灰色背景、灰色文字 */
.status-tag.inactive {
  background-color: #f4f4f5;
  color: #909399;
}

/* 按钮通用样式：内边距、圆角、鼠标手势、边框 */
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #dcdfe6;
}

/* 主要按钮：蓝色背景、白色文字 */
.btn-primary {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

/* 默认按钮：白色背景、深色文字 */
.btn-default {
  background: #fff;
  color: #333;
}

/* 蓝色小按钮 */
.btn-blue {
  background: #59a0ff;
  color: #fff;
  border: none;
}

/* 弹窗遮罩层：固定定位、全屏、半透明黑色、居中 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 弹窗内容框：白色背景、宽度、圆角、阴影、纵向布局 */
.modal-dialog {
  background: white;
  width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
}

/* 弹窗头部：内边距、底部边框、两端对齐、垂直居中 */
.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 弹窗标题样式 */
.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

/* 关闭按钮：字体大小、手势、颜色 */
.close-btn {
  font-size: 20px;
  cursor: pointer;
  color: #909399;
}

/* 弹窗主体内容：内边距 */
.modal-body {
  padding: 20px;
}

/* 表单项：底部外边距、弹性布局、顶部对齐 */
.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}

/* 表单标签：宽度、右对齐、右边距、行高、颜色、字体大小 */
.form-group label {
  width: 120px;
  text-align: right;
  margin-right: 10px;
  line-height: 32px;
  color: #606266;
  font-size: 14px;
}

/* 表单输入控件：自动占满、内边距、边框、圆角、去掉轮廓 */
.form-group input, .form-group select, .form-group textarea {
  flex: 1;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  font-family: inherit;
}

/* 输入框聚焦时：边框变蓝色 */
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #409eff;
}

/* 弹窗底部：内边距、顶部边框、右对齐 */
.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

/* 弹窗底部按钮：左边距 */
.modal-footer .btn {
  margin-left: 10px;
}
</style>