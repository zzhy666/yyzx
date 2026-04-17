<template>
  <div class="healthy-container">
    <div class="main-content">
      <div class="page-header">
        <h2 class="page-title">设置服务对象</h2>
      </div>

      <div class="toolbar">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="输入客户姓名查询"
        />
        <button @click="search" class="btn btn-primary">查询</button>
      </div>

      <!-- 仅客户信息 -->
      <div class="section">
        <h3>客户信息</h3>
        <table class="data-table">
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
                <button @click="openNurseRecord(client)" class="btn btn-blue">日常护理</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 弹窗 -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3>添加护理记录</h3>
            <span class="close-btn" @click="closeModal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>客户姓名：</label>
              <input type="text" v-model="formData.clientName" disabled />
            </div>
            <div class="form-group">
              <label>护理项目编号：</label>
              <input type="text" v-model="formData.projectId" />
            </div>
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
            <div class="form-group">
              <label>护理时间：</label>
              <input type="datetime-local" v-model="formData.time" required />
            </div>
            <div class="form-group">
              <label>护理数量：</label>
              <input type="number" v-model.number="formData.quantity" min="1" required />
            </div>
            <div class="form-group">
              <label>护理内容：</label>
              <textarea v-model="formData.content" rows="3"></textarea>
            </div>
          </div>
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
import { ref, computed } from 'vue';

const searchKeyword = ref('');
const showModal = ref(false);
const formData = ref({
  clientName: '',
  projectId: '',
  projectName: '',
  time: '',
  quantity: 1,
  content: ''
});

const clients = ref([
  { id: 1, name: '孙瑞英', age: 68, gender: '女', roomNo: '2012', bedNo: '2012-1', bedRoom: '606', phone: '18167564213', nurseLevel: '二级' },
  { id: 2, name: '张帆', age: 77, gender: '女', roomNo: '1014', bedNo: '1014-1', bedRoom: '606', phone: '17745189064', nurseLevel: '三级' },
  { id: 3, name: '薛月兰', age: 67, gender: '女', roomNo: '2005', bedNo: '2005-1', bedRoom: '605', phone: '13517177668', nurseLevel: '一级' }
]);

const filteredClients = computed(() => {
  if (!searchKeyword.value) return clients.value;
  return clients.value.filter(client => client.name.includes(searchKeyword.value));
});

const search = () => {
  alert('搜索成功');
};

const openNurseRecord = (client) => {
  formData.value.clientName = client.name;
  formData.value.projectId = '';
  formData.value.projectName = '';
  formData.value.time = new Date().toISOString().slice(0, 16);
  formData.value.quantity = 1;
  formData.value.content = '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveNurseRecord = () => {
  alert('护理记录已添加');
  closeModal();
};
</script>

<style scoped>
.healthy-container {
  display: flex;
  height: 100vh;
  width: 100%;
}
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
.page-header {
  margin-bottom: 20px;
}
.toolbar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.toolbar input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 220px;
}
.section {
  margin-bottom: 30px;
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #303133;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: center;
  font-size: 13px;
}
.data-table th {
  background: #f0f0f0;
  font-weight: bold;
}
.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.btn-primary {
  background: #409eff;
  color: #fff;
}
.btn-blue {
  background: #59a0ff;
  color: #fff;
}
.btn-default {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-dialog {
  background: white;
  width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  font-size: 20px;
  cursor: pointer;
}
.modal-body {
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}
.form-group label {
  width: 120px;
  text-align: right;
  margin-right: 10px;
  line-height: 32px;
}
.form-group input, .form-group select, .form-group textarea {
  flex: 1;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}
</style>