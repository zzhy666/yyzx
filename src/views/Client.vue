<template>
  <div class="customer-management">
    <!-- 1. 查询筛选区 -->
    <div class="search-bar">
      <div class="search-item">
        <label>客户姓名：</label>
        <input 
          v-model="searchParams.customerName" 
          type="text" 
          placeholder="请输入姓名（模糊搜索）"
          class="input-text"
        />
      </div>
      <div class="search-item">
        <label>老人类型：</label>
        <select v-model="searchParams.elderType" class="input-select">
          <option value="self">自理老人</option>
          <option value="care">护理老人</option>
          <option value="all">全部</option>
        </select>
      </div>
      <button @click="handleSearch" class="btn-search">查询</button>
      <button @click="handleReset" class="btn-reset">重置</button>
      <button @click="openAddModal" class="btn-add">新增入住</button>
    </div>

    <!-- 2. 客户信息列表 -->
    <div class="table-container">
      <table class="customer-table">
        <thead>
          <tr>
            <th>客户ID</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>性别</th>
            <th>身份证号</th>
            <th>老人类型</th>
            <th>护理项目</th>
            <th>楼栋/房间/床位</th>
            <th>入住时间</th>
            <th>合同到期时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredCustomerList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.age }}</td>
            <td>{{ item.gender }}</td>
            <td>{{ item.idCard }}</td>
            <td>{{ item.elderType === 'self' ? '自理老人' : '护理老人' }}</td>
            <td>{{ item.careItems || '无' }}</td>
            <td>606-{{ item.roomNo }}-{{ item.bedNo }}</td>
            <td>{{ item.checkInTime }}</td>
            <td>{{ item.contractEndTime }}</td>
            <td>
              <button @click="openEditModal(item)" class="btn-edit">编辑</button>
              <button @click="handleDelete(item)" class="btn-delete">删除</button>
            </td>
          </tr>
          <tr v-if="filteredCustomerList.length === 0">
            <td colspan="11" class="empty-tip">暂无符合条件的客户信息</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 3. 新增/编辑 入住信息弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ isEdit ? '编辑客户信息' : '登记客户入住信息' }}</h3>
        <form @submit.prevent="handleSubmit" class="checkin-form">
          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span>客户姓名：</label>
              <input v-model="formData.name" type="text" required />
            </div>
            <div class="form-item">
              <label><span class="required">*</span>出生日期：</label>
              <input v-model="formData.birthDate" type="date" @input="calcAge" required />
            </div>
            <div class="form-item">
              <label>年龄：</label>
              <input v-model="formData.age" type="number" readonly />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span>性别：</label>
              <select v-model="formData.gender" required>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-item">
              <label><span class="required">*</span>身份证号：</label>
              <input v-model="formData.idCard" type="text" required />
            </div>
            <div class="form-item">
              <label>血型：</label>
              <select v-model="formData.bloodType">
                <option value="A">A型</option>
                <option value="B">B型</option>
                <option value="AB">AB型</option>
                <option value="O">O型</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span>家属：</label>
              <input v-model="formData.familyMember" type="text" required />
            </div>
            <div class="form-item">
              <label><span class="required">*</span>联系电话：</label>
              <input v-model="formData.phone" type="tel" required />
            </div>
            <div class="form-item">
              <label>老人类型：</label>
              <select v-model="formData.elderType">
                <option value="self">自理老人</option>
                <option value="care">护理老人</option>
              </select>
            </div>
          </div>

          <div class="form-row" v-if="formData.elderType === 'care'">
            <div class="form-item full-width">
              <label>护理项目：</label>
              <input v-model="formData.careItems" type="text" placeholder="多个用逗号分隔" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>楼栋：</label>
              <input value="606" readonly />
            </div>
            <div class="form-item">
              <label><span class="required">*</span>房间号：</label>
              <select v-model="formData.roomNo" @change="getAvailableBeds" required>
                <option value="">请选择房间</option>
                <optgroup v-for="floor in roomList" :label="`${floor.floor}层`" :key="floor.floor">
                  <option v-for="room in floor.rooms" :value="room.roomNo" :key="room.roomNo">
                    {{ room.roomNo }}
                  </option>
                </optgroup>
              </select>
            </div>
            <div class="form-item">
              <label><span class="required">*</span>床位号：</label>
              <select v-model="formData.bedNo" required>
                <option value="">请先选择房间</option>
                <option v-for="bed in availableBeds" :value="bed" :key="bed">{{ bed }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span>入住时间：</label>
              <input v-model="formData.checkInTime" type="date" @input="validateTime" required />
            </div>
            <div class="form-item">
              <label><span class="required">*</span>合同到期时间：</label>
              <input v-model="formData.contractEndTime" type="date" @input="validateTime" required />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">取消</button>
            <button type="submit" class="btn-submit">{{ isEdit ? '保存修改' : '提交入住' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

// ==================== 1. 基础数据 ====================
// 模拟房间数据（实际项目从后端获取）
const roomList = ref([
  {
    floor: 1,
    rooms: [
      { roomNo: '101', beds: ['101-1', '101-2', '101-3'], occupiedBeds: [] },
      { roomNo: '102', beds: ['102-1', '102-2'], occupiedBeds: [] }
    ]
  },
  {
    floor: 2,
    rooms: [
      { roomNo: '201', beds: ['201-1', '201-2'], occupiedBeds: [] },
      { roomNo: '202', beds: ['202-1', '202-2', '202-3'], occupiedBeds: [] }
    ]
  }
])

// 客户数据（模拟后端，包含完整入住信息）
const customerList = ref([
  {
    id: 1,
    name: '张建国',
    birthDate: '1947-03-15',
    age: 78,
    gender: '男',
    idCard: '110101194703151234',
    bloodType: 'A',
    familyMember: '张三',
    phone: '13800138001',
    elderType: 'self',
    careItems: '',
    roomNo: '101',
    bedNo: '101-1',
    checkInTime: '2025-01-15',
    contractEndTime: '2026-01-14',
    isDeleted: false,
    bedRecordId: 'b1'
  },
  {
    id: 2,
    name: '李桂兰',
    birthDate: '1943-05-20',
    age: 82,
    gender: '女',
    idCard: '110101194305201235',
    bloodType: 'B',
    familyMember: '李四',
    phone: '13800138002',
    elderType: 'care',
    careItems: '日常护理、康复训练',
    roomNo: '101',
    bedNo: '101-2',
    checkInTime: '2025-02-20',
    contractEndTime: '2026-02-19',
    isDeleted: false,
    bedRecordId: 'b2'
  }
])

// ==================== 2. 查询相关 ====================
const searchParams = reactive({
  customerName: '',
  elderType: 'self'
})

const filteredCustomerList = computed(() => {
  return customerList.value.filter(item => {
    // 过滤已逻辑删除的客户
    if (item.isDeleted) return false
    // 姓名模糊匹配
    const nameMatch = item.name.includes(searchParams.customerName.trim())
    // 老人类型匹配
    const typeMatch = searchParams.elderType === 'all' 
      ? true 
      : item.elderType === searchParams.elderType
    return nameMatch && typeMatch
  })
})

const handleSearch = () => {
  console.log('查询参数：', searchParams)
}

const handleReset = () => {
  searchParams.customerName = ''
  searchParams.elderType = 'self'
}

// ==================== 3. 新增/编辑弹窗相关 ====================
const showModal = ref(false)
const isEdit = ref(false)
const currentEditId = ref(null)
const availableBeds = ref([])

// 表单数据（初始化）
const formData = reactive({
  name: '',
  birthDate: '',
  age: '',
  gender: '男',
  idCard: '',
  bloodType: 'A',
  familyMember: '',
  phone: '',
  elderType: 'self',
  careItems: '',
  roomNo: '',
  bedNo: '',
  checkInTime: new Date().toISOString().split('T')[0],
  contractEndTime: ''
})

// 打开新增弹窗
const openAddModal = () => {
  isEdit.value = false
  currentEditId.value = null
  resetForm()
  showModal.value = true
}

// 打开编辑弹窗
const openEditModal = (item) => {
  isEdit.value = true
  currentEditId.value = item.id
  // 回填表单数据
  Object.assign(formData, {
    name: item.name,
    birthDate: item.birthDate,
    age: item.age,
    gender: item.gender,
    idCard: item.idCard,
    bloodType: item.bloodType,
    familyMember: item.familyMember,
    phone: item.phone,
    elderType: item.elderType,
    careItems: item.careItems,
    roomNo: item.roomNo,
    bedNo: item.bedNo,
    checkInTime: item.checkInTime,
    contractEndTime: item.contractEndTime
  })
  // 加载当前房间的可用床位（包含当前已占用的床位，用于编辑）
  getAvailableBeds(item.roomNo, item.bedNo)
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    birthDate: '',
    age: '',
    gender: '男',
    idCard: '',
    bloodType: 'A',
    familyMember: '',
    phone: '',
    elderType: 'self',
    careItems: '',
    roomNo: '',
    bedNo: '',
    checkInTime: new Date().toISOString().split('T')[0],
    contractEndTime: ''
  })
  availableBeds.value = []
}

// ==================== 4. 核心业务逻辑 ====================
// 4.1 根据出生日期自动计算年龄
const calcAge = () => {
  if (!formData.birthDate) return
  const birth = new Date(formData.birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  // 生日未过，年龄减1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  formData.age = age
}

// 4.2 房间号联动获取空闲床位
const getAvailableBeds = (roomNo = formData.roomNo, currentBed = '') => {
  if (!roomNo) {
    availableBeds.value = []
    return
  }
  // 找到对应房间
  let targetRoom = null
  for (const floor of roomList.value) {
    targetRoom = floor.rooms.find(r => r.roomNo === roomNo)
    if (targetRoom) break
  }
  if (!targetRoom) return

  // 过滤已被占用的床位（编辑时保留当前床位）
  const occupied = customerList.value
    .filter(c => !c.isDeleted && c.roomNo === roomNo && c.bedNo !== currentBed)
    .map(c => c.bedNo)
  
  availableBeds.value = targetRoom.beds.filter(bed => !occupied.includes(bed))
  // 如果是编辑，把当前床位加回去
  if (currentBed && !availableBeds.value.includes(currentBed)) {
    availableBeds.value.unshift(currentBed)
  }
}

// 4.3 时间校验：合同到期时间不能小于入住时间
const validateTime = () => {
  if (!formData.checkInTime || !formData.contractEndTime) return
  const checkIn = new Date(formData.checkInTime)
  const end = new Date(formData.contractEndTime)
  if (end < checkIn) {
    alert('合同到期时间不能小于入住时间！')
    formData.contractEndTime = formData.checkInTime
  }
}

// 4.4 提交表单（新增/编辑）
const handleSubmit = () => {
  // 最终校验
  validateTime()
  if (!formData.roomNo || !formData.bedNo) {
    alert('请选择房间和床位！')
    return
  }

  if (isEdit.value) {
    // 编辑逻辑
    const index = customerList.value.findIndex(c => c.id === currentEditId.value)
    if (index > -1) {
      const oldItem = customerList.value[index]
      // 如果合同到期时间变更，更新床位退住时间
      if (oldItem.contractEndTime !== formData.contractEndTime) {
        // 实际项目：调用后端接口更新床位使用记录的退住时间
        console.log('更新床位退住时间为：', formData.contractEndTime)
      }
      // 更新客户信息
      customerList.value[index] = {
        ...oldItem,
        ...formData
      }
      alert('修改成功！')
    }
  } else {
    // 新增逻辑
    const newCustomer = {
      id: Date.now(), // 实际项目由后端生成ID
      ...formData,
      isDeleted: false,
      bedRecordId: `b${Date.now()}` // 床位使用记录ID
    }
    customerList.value.push(newCustomer)
    // 标记床位为已占用
    const room = roomList.value
      .flatMap(f => f.rooms)
      .find(r => r.roomNo === formData.roomNo)
    if (room && !room.occupiedBeds.includes(formData.bedNo)) {
      room.occupiedBeds.push(formData.bedNo)
    }
    alert('入住登记成功！')
  }

  closeModal()
}

// 4.5 删除客户信息（逻辑删除）
const handleDelete = (item) => {
  if (!confirm(`确定要删除客户【${item.name}】的信息吗？`)) return

  // 1. 客户信息逻辑删除（隐藏）
  const index = customerList.value.findIndex(c => c.id === item.id)
  if (index > -1) {
    customerList.value[index].isDeleted = true
  }

  // 2. 修改床位状态为空闲
  const room = roomList.value
    .flatMap(f => f.rooms)
    .find(r => r.roomNo === item.roomNo)
  if (room) {
    room.occupiedBeds = room.occupiedBeds.filter(b => b !== item.bedNo)
  }

  // 3. 床位使用详情逻辑删除（隐藏当前显示的记录）
  // 实际项目：调用后端接口更新bedRecordId对应的记录为已删除
  console.log('逻辑删除床位使用记录：', item.bedRecordId)

  alert('删除成功！')
}

// ==================== 5. 监听 ====================
// 监听房间号变化，自动加载床位
watch(() => formData.roomNo, (newVal) => {
  getAvailableBeds(newVal)
})
</script>

<style scoped>
/* 基础样式 */
.customer-management {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
  flex-wrap: wrap;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-text, .input-select {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.btn-search, .btn-reset, .btn-add {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-search {
  background: #409eff;
  color: #fff;
}

.btn-reset {
  background: #f5f5f5;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-add {
  background: #67c23a;
  color: #fff;
}

.table-container {
  overflow-x: auto;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 1200px;
}

.customer-table th, .customer-table td {
  padding: 10px;
  border: 1px solid #ebeef5;
  font-size: 13px;
}

.customer-table th {
  background: #f5f7fa;
  font-weight: 500;
}

.empty-tip {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}

.btn-edit, .btn-delete {
  margin-right: 5px;
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background: #e6a23c;
  color: #fff;
}

.btn-delete {
  background: #f56c6c;
  color: #fff;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.checkin-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.form-item.full-width {
  flex: 1 1 100%;
}

.form-item label {
  white-space: nowrap;
  font-size: 14px;
}

.form-item .required {
  color: #f56c6c;
}

.form-item input, .form-item select {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.form-item input[readonly] {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn-cancel, .btn-submit {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-cancel {
  background: #f5f5f5;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-submit {
  background: #409eff;
  color: #fff;
}
</style>