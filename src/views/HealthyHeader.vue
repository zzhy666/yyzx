<template>
  <div class="healthy-container">
    <!-- 右侧主内容区（全屏） -->
    <div class="main-content">
      <div class="page-header">
        <h2 class="page-title">健康管家 → {{ currentPage }}</h2>

        <!-- 👇 新加：页面切换按钮 -->
        <div class="switch-buttons" style="margin-top: 10px;">
          <button 
            class="btn" 
            :class="currentPage === '设置服务对象' ? 'btn-primary' : 'btn-default'"
            @click="gotoServiceObj"
          >
            设置服务对象
          </button>
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

      <!-- 搜索栏 -->
      <div class="toolbar">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="输入客户姓名查询"
        />
        <button @click="search" class="btn btn-primary">查询</button>
      </div>

      <!-- 客户信息表格 -->
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

      <!-- 👇 只有服务关注才显示：护理项目 + 护理记录 -->
      <template v-if="currentPage === '服务关注'">
        <!-- 护理项目 -->
        <div class="section">
          <h3>护理项目</h3>
          <table class="data-table">
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
            <tbody>
              <tr v-for="(project, idx) in nurseProjects" :key="project.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ project.projectId }}</td>
                <td>{{ project.name }}</td>
                <td>{{ project.standard }}</td>
                <td>{{ project.price }}元/次</td>
                <td>{{ project.quantity }}</td>
                <td>{{ project.expireDate }}</td>
                <td>
                  <span :class="['status-tag', project.status === '已启用' ? 'active' : 'inactive']">
                    {{ project.status }}
                  </span>
                </td>
                <td>
                  <button @click="handleNurse(project)" class="btn btn-blue">护理</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 护理记录 -->
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

      <!-- 弹窗：添加护理记录 -->
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

// 当前页面
const currentPage = ref('服务关注');

// 搜索关键词
const searchKeyword = ref('');

// 模拟客户数据
const clients = ref([
  { id: 1, name: '孙瑞英', age: 68, gender: '女', roomNo: '2012', bedNo: '2012-1', bedRoom: '606', phone: '18167564213', nurseLevel: '二级' },
  { id: 2, name: '张帆', age: 77, gender: '女', roomNo: '1014', bedNo: '1014-1', bedRoom: '606', phone: '17745189064', nurseLevel: '三级' },
  { id: 3, name: '薛月兰', age: 67, gender: '女', roomNo: '2005', bedNo: '2005-1', bedRoom: '605', phone: '13517177668', nurseLevel: '一级' }
]);

// 过滤客户
const filteredClients = computed(() => {
  if (!searchKeyword.value) return clients.value;
  return clients.value.filter(client => client.name.includes(searchKeyword.value));
});

// 护理项目数据
const nurseProjects = ref([
  { id: 1, projectId: 'HLXM0001', name: '吸氧', standard: '每小时一次', price: 60, quantity: 5, expireDate: '2024-01-19', status: '已启用' },
  { id: 2, projectId: 'HLXM0002', name: '协助服药', standard: '每日两次', price: 20, quantity: 2, expireDate: '2023-11-17', status: '已启用' }
]);

// 护理记录数据
const nurseRecords = ref([
  { projectId: 'HLXM0001', projectName: '吸氧', quantity: 1, content: '吸氧治疗', nurseName: '吴丹', phone: '13517177668', time: '2023-11-24' },
  { projectId: 'HLXM0002', projectName: '协助服药', quantity: 1, content: '协助服用降压药', nurseName: '吴丹', phone: '13517177668', time: '2023-11-24' }
]);

// 弹窗控制
const showModal = ref(false);
const formData = ref({
  clientName: '',
  projectId: '',
  projectName: '',
  time: '',
  quantity: 1,
  content: ''
});

// 路由跳转方法
const gotoServiceObj = () => {
  currentPage.value = '设置服务对象';
};

const gotoFollow = () => {
  currentPage.value = '服务关注';
};

const search = () => {
  alert('搜索功能暂未实现');
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

const handleNurse = (project) => {
  alert(`执行护理项目：${project.name}`);
};

const closeModal = () => {
  showModal.value = false;
};

const saveNurseRecord = () => {
  if (!formData.value.projectName || !formData.value.time) {
    alert('请填写必填项！');
    return;
  }

  nurseRecords.value.push({
    ...formData.value,
    projectId: formData.value.projectId || `HLXM${Math.floor(Math.random() * 10000)}`
  });

  closeModal();
  alert('护理记录添加成功！');
};
</script>

<style scoped>
/* 全局布局 */
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

.status-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.status-tag.active {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status-tag.inactive {
  background-color: #f4f4f5;
  color: #909399;
}

/* 按钮样式补充 */
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #dcdfe6;
}
.btn-primary {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.btn-default {
  background: #fff;
  color: #333;
}
.btn-blue {
  background: #59a0ff;
  color: #fff;
  border: none;
}

/* 弹窗样式 */
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

.modal-dialog {
  background: white;
  width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.close-btn {
  font-size: 20px;
  cursor: pointer;
  color: #909399;
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
  color: #606266;
  font-size: 14px;
}

.form-group input, .form-group select, .form-group textarea {
  flex: 1;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  font-family: inherit;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #409eff;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

.modal-footer .btn {
  margin-left: 10px;
}
</style>