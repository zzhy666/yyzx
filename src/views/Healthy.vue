<template>
  <!-- 页面最外层容器，包裹所有内容 -->
  <div class="healthy-container">
    <!-- 页面主体内容区域 -->
    <div class="main-content">
      <!-- 页面头部区域 -->
      <div class="page-header">
        <!-- 页面标题 -->
        <h2 class="page-title"></h2>
      </div>

      <!-- 搜索工具栏 -->
      <div class="toolbar">
        <!-- 搜索输入框，双向绑定搜索关键词 -->
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="输入客户姓名查询"
        />
        <!-- 搜索按钮，点击触发search方法 -->
        <button @click="search" class="btn btn-primary">查询</button>
      </div>

      <!-- 客户信息模块 -->
      <div class="section">
        <!-- 模块标题 -->
        <h3>客户信息</h3>
        <!-- 客户信息表格 -->
        <table class="data-table">
          <!-- 表头 -->
          <thead>
            <tr>
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
          <!-- 表格内容，循环渲染客户数据 -->
          <tbody>
            <tr v-for="(client, index) in filteredClients" :key="client.id">
              <td>{{ index + 1 }}</td>
              <td>{{ client.name }}</td>
              <td>{{ client.age }}</td>
              <td>{{ client.gender }}</td>
              <td>{{ client.roomNo }}</td>
              <td>{{ client.bedNo }}</td>
              <td>{{ client.bedRoom }}</td>
              <td>{{ client.phone }}</td>
              <td>{{ client.nurseLevel }}</td>
              <td>
                <!-- 点击打开护理记录弹窗 -->
                <button @click="openNurseRecord(client)" class="btn btn-blue">日常护理</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 护理记录弹窗，showModal控制显示隐藏 -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <!-- 弹窗内容 -->
        <div class="modal-dialog">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <h3>添加护理记录</h3>
            <!-- 关闭按钮 -->
            <span class="close-btn" @click="closeModal">&times;</span>
          </div>
          <!-- 弹窗表单区域 -->
          <div class="modal-body">
            <!-- 客户姓名输入框，禁用不可编辑 -->
            <div class="form-group">
              <label>客户姓名：</label>
              <input type="text" v-model="formData.clientName" disabled />
            </div>
            <!-- 护理项目编号 -->
            <div class="form-group">
              <label>护理项目编号：</label>
              <input type="text" v-model="formData.projectId" />
            </div>
            <!-- 护理项目选择下拉框 -->
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
            <!-- 护理时间选择 -->
            <div class="form-group">
              <label>护理时间：</label>
              <input type="datetime-local" v-model="formData.time" required />
            </div>
            <!-- 护理数量输入 -->
            <div class="form-group">
              <label>护理数量：</label>
              <input type="number" v-model.number="formData.quantity" min="1" required />
            </div>
            <!-- 护理内容备注 -->
            <div class="form-group">
              <label>护理内容：</label>
              <textarea v-model="formData.content" rows="3"></textarea>
            </div>
          </div>
          <!-- 弹窗底部按钮 -->
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
// 引入Vue响应式函数
import { ref, computed } from 'vue';

// 搜索关键词，绑定搜索框
const searchKeyword = ref('');
// 控制弹窗显示隐藏
const showModal = ref(false);
// 弹窗表单数据
const formData = ref({
  clientName: '',    // 客户姓名
  projectId: '',     // 护理项目编号
  projectName: '',   // 护理项目名称
  time: '',          // 护理时间
  quantity: 1,       // 护理数量
  content: ''        // 护理内容
});

// 客户数据列表
const clients = ref([
  { id: 1, name: '孙瑞英', age: 68, gender: '女', roomNo: '2012', bedNo: '2012-1', bedRoom: '606', phone: '18167564213', nurseLevel: '二级' },
  { id: 2, name: '张帆', age: 77, gender: '女', roomNo: '1014', bedNo: '1014-1', bedRoom: '606', phone: '17745189064', nurseLevel: '三级' },
  { id: 3, name: '薛月兰', age: 67, gender: '女', roomNo: '2005', bedNo: '2005-1', bedRoom: '605', phone: '13517177668', nurseLevel: '一级' }
]);

// 筛选客户列表
const filteredClients = computed(() => {
  // 无关键词时返回全部
  if (!searchKeyword.value) return clients.value;
  // 过滤出包含关键词的客户
  return clients.value.filter(client => client.name.includes(searchKeyword.value));
});

// 搜索按钮点击事件
const search = () => {
  alert('搜索成功');
};

// 打开护理记录弹窗，自动填充客户信息
const openNurseRecord = (client) => {
  formData.value.clientName = client.name;
  formData.value.projectId = '';
  formData.value.projectName = '';
  formData.value.time = new Date().toISOString().slice(0, 16);
  formData.value.quantity = 1;
  formData.value.content = '';
  showModal.value = true;
};

// 关闭弹窗
const closeModal = () => {
  showModal.value = false;
};

// 保存护理记录
const saveNurseRecord = () => {
  alert('护理记录已添加');
  closeModal();
};
</script>

<style scoped>
/* 最外层容器样式 */
.healthy-container {
  display: flex;
  height: 100vh;
  width: 100%;
}
/* 主体内容区 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
/* 头部间距 */
.page-header {
  margin-bottom: 20px;
}
/* 搜索栏布局 */
.toolbar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
/* 搜索输入框 */
.toolbar input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 220px;
}
/* 模块卡片样式 */
.section {
  margin-bottom: 30px;
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
/* 模块标题 */
.section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #303133;
}
/* 表格样式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
/* 表格单元格 */
.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: center;
  font-size: 13px;
}
/* 表头样式 */
.data-table th {
  background: #f0f0f0;
  font-weight: bold;
}
/* 按钮通用样式 */
.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
/* 主要按钮 */
.btn-primary {
  background: #409eff;
  color: #fff;
}
/* 蓝色按钮 */
.btn-blue {
  background: #59a0ff;
  color: #fff;
}
/* 默认按钮 */
.btn-default {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}
/* 弹窗遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
/* 弹窗内容框 */
.modal-dialog {
  background: white;
  width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
/* 弹窗头部 */
.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 关闭按钮 */
.close-btn {
  font-size: 20px;
  cursor: pointer;
}
/* 弹窗主体 */
.modal-body {
  padding: 20px;
}
/* 表单项布局 */
.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}
/* 表单标签 */
.form-group label {
  width: 120px;
  text-align: right;
  margin-right: 10px;
  line-height: 32px;
}
/* 表单输入控件 */
.form-group input, .form-group select, .form-group textarea {
  flex: 1;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
/* 弹窗底部 */
.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}
</style>