<template>
  <div class="customer-management">
    <div class="search-bar">
      <div class="search-item">
        <label>客户姓名：</label>
        <input v-model="searchParams.customerName" type="text" placeholder="请输入姓名" class="input-text" />
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

    <div class="table-container">
      <table class="customer-table">
        <thead>
          <tr><th>ID</th><th>姓名</th><th>年龄</th><th>性别</th><th>身份证</th><th>类型</th><th>护理项目</th><th>位置</th><th>入住时间</th><th>到期时间</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredCustomerList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.age }}</td>
            <td>{{ item.gender }}</td>
            <td>{{ item.idCard }}</td>
            <td>{{ item.elderType === 'self' ? '自理' : '护理' }}</td>
            <td>{{ item.careItems || '无' }}</td>
            <td>606-{{ item.roomNo }}-{{ item.bedNo }}</td>
            <td>{{ item.checkInTime }}</td>
            <td>{{ item.contractEndTime }}</td>
            <td>
              <button @click="openEditModal(item)" class="btn-edit">编辑</button>
              <button @click="handleDelete(item)" class="btn-delete">删除</button>
            </td>
          </tr>
          <tr v-if="!filteredCustomerList.length">
            <td colspan="11" class="empty-tip">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ isEdit ? '编辑客户' : '登记入住' }}</h3>
        <form @submit.prevent="handleSubmit" class="checkin-form">
          <div class="form-row">
            <div class="form-item"><label><span class="required">*</span>姓名：</label><input v-model="formData.name" type="text" required /></div>
            <div class="form-item"><label><span class="required">*</span>出生日期：</label><input v-model="formData.birthDate" type="date" @input="calcAge" required /></div>
            <div class="form-item"><label>年龄：</label><input v-model="formData.age" type="number" readonly /></div>
          </div>
          <div class="form-row">
            <div class="form-item"><label><span class="required">*</span>性别：</label><select v-model="formData.gender" required><option>男</option><option>女</option></select></div>
            <div class="form-item"><label><span class="required">*</span>身份证：</label><input v-model="formData.idCard" type="text" required /></div>
            <div class="form-item"><label>血型：</label><select v-model="formData.bloodType"><option v-for="t in ['A','B','AB','O','其他']" :value="t">{{ t }}型</option></select></div>
          </div>
          <div class="form-row">
            <div class="form-item"><label><span class="required">*</span>家属：</label><input v-model="formData.familyMember" type="text" required /></div>
            <div class="form-item"><label><span class="required">*</span>电话：</label><input v-model="formData.phone" type="tel" required /></div>
            <div class="form-item"><label>类型：</label><select v-model="formData.elderType"><option value="self">自理</option><option value="care">护理</option></select></div>
          </div>
          <div class="form-row" v-if="formData.elderType === 'care'">
            <div class="form-item full-width"><label>护理项目：</label><input v-model="formData.careItems" type="text" placeholder="逗号分隔" /></div>
          </div>
          <div class="form-row">
            <div class="form-item"><label>楼栋：</label><input value="606" readonly /></div>
            <div class="form-item"><label><span class="required">*</span>房间：</label><select v-model="formData.roomNo" @change="getAvailableBeds" required><option value="">请选择</option><optgroup v-for="f in roomList" :label="f.floor+'层'" :key="f.floor"><option v-for="r in f.rooms" :value="r.roomNo">{{ r.roomNo }}</option></optgroup></select></div>
            <div class="form-item"><label><span class="required">*</span>床位：</label><select v-model="formData.bedNo" required><option value="">先选房间</option><option v-for="bed in availableBeds" :value="bed">{{ bed }}</option></select></div>
          </div>
          <div class="form-row">
            <div class="form-item"><label><span class="required">*</span>入住：</label><input v-model="formData.checkInTime" type="date" @input="validateTime" required /></div>
            <div class="form-item"><label><span class="required">*</span>到期：</label><input v-model="formData.contractEndTime" type="date" @input="validateTime" required /></div>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">取消</button>
            <button type="submit" class="btn-submit">{{ isEdit ? '保存' : '提交' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'

const roomList = ref([
  { floor: 1, rooms: [{ roomNo: '101', beds: ['101-1', '101-2', '101-3'], occupiedBeds: [] }, { roomNo: '102', beds: ['102-1', '102-2'], occupiedBeds: [] }] },
  { floor: 2, rooms: [{ roomNo: '201', beds: ['201-1', '201-2'], occupiedBeds: [] }, { roomNo: '202', beds: ['202-1', '202-2', '202-3'], occupiedBeds: [] }] }
])

const customerList = ref([
  { id: 1, name: '张建国', birthDate: '1947-03-15', age: 78, gender: '男', idCard: '110101194703151234', bloodType: 'A', familyMember: '张三', phone: '13800138001', elderType: 'self', careItems: '', roomNo: '101', bedNo: '101-1', checkInTime: '2025-01-15', contractEndTime: '2026-01-14', isDeleted: false, bedRecordId: 'b1' },
  { id: 2, name: '李桂兰', birthDate: '1943-05-20', age: 82, gender: '女', idCard: '110101194305201235', bloodType: 'B', familyMember: '李四', phone: '13800138002', elderType: 'care', careItems: '日常护理', roomNo: '101', bedNo: '101-2', checkInTime: '2025-02-20', contractEndTime: '2026-02-19', isDeleted: false, bedRecordId: 'b2' }
])

const searchParams = reactive({ customerName: '', elderType: 'self' })

const filteredCustomerList = computed(() => customerList.value.filter(i => !i.isDeleted && i.name.includes(searchParams.customerName) && (searchParams.elderType === 'all' || i.elderType === searchParams.elderType)))

const handleSearch = () => {}
const handleReset = () => { searchParams.customerName = ''; searchParams.elderType = 'self' }

const showModal = ref(false)
const isEdit = ref(false)
const currentEditId = ref(null)
const availableBeds = ref([])

const formData = reactive({ name: '', birthDate: '', age: '', gender: '男', idCard: '', bloodType: 'A', familyMember: '', phone: '', elderType: 'self', careItems: '', roomNo: '', bedNo: '', checkInTime: new Date().toISOString().split('T')[0], contractEndTime: '' })

const openAddModal = () => { isEdit.value = false; currentEditId.value = null; resetForm(); showModal.value = true }
const openEditModal = (item) => { isEdit.value = true; currentEditId.value = item.id; Object.assign(formData, item); getAvailableBeds(item.roomNo, item.bedNo); showModal.value = true }
const closeModal = () => { showModal.value = false; resetForm() }
const resetForm = () => { Object.assign(formData, { name: '', birthDate: '', age: '', gender: '男', idCard: '', bloodType: 'A', familyMember: '', phone: '', elderType: 'self', careItems: '', roomNo: '', bedNo: '', checkInTime: new Date().toISOString().split('T')[0], contractEndTime: '' }); availableBeds.value = [] }

const calcAge = () => { if (!formData.birthDate) return; const b = new Date(formData.birthDate); const t = new Date(); let age = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--; formData.age = age }

const getAvailableBeds = (roomNo = formData.roomNo, currentBed = '') => {
  if (!roomNo) { availableBeds.value = []; return }
  const room = roomList.value.flatMap(f => f.rooms).find(r => r.roomNo === roomNo)
  if (!room) return
  const occupied = customerList.value.filter(c => !c.isDeleted && c.roomNo === roomNo && c.bedNo !== currentBed).map(c => c.bedNo)
  availableBeds.value = room.beds.filter(b => !occupied.includes(b))
  if (currentBed && !availableBeds.value.includes(currentBed)) availableBeds.value.unshift(currentBed)
}

const validateTime = () => { if (formData.checkInTime && formData.contractEndTime && new Date(formData.contractEndTime) < new Date(formData.checkInTime)) { alert('到期时间不能早于入住时间'); formData.contractEndTime = formData.checkInTime } }

const handleSubmit = () => {
  validateTime()
  if (!formData.roomNo || !formData.bedNo) { alert('请选择房间床位'); return }
  if (isEdit.value) {
    const idx = customerList.value.findIndex(c => c.id === currentEditId.value)
    if (idx > -1) { customerList.value[idx] = { ...customerList.value[idx], ...formData }; alert('修改成功') }
  } else {
    const newC = { ...formData, id: Date.now(), isDeleted: false, bedRecordId: `b${Date.now()}` }
    customerList.value.push(newC)
    const room = roomList.value.flatMap(f => f.rooms).find(r => r.roomNo === formData.roomNo)
    if (room && !room.occupiedBeds.includes(formData.bedNo)) room.occupiedBeds.push(formData.bedNo)
    alert('入住成功')
  }
  closeModal()
}

const handleDelete = (item) => {
  if (!confirm(`确定删除【${item.name}】？`)) return
  const idx = customerList.value.findIndex(c => c.id === item.id)
  if (idx > -1) customerList.value[idx].isDeleted = true
  const room = roomList.value.flatMap(f => f.rooms).find(r => r.roomNo === item.roomNo)
  if (room) room.occupiedBeds = room.occupiedBeds.filter(b => b !== item.bedNo)
  alert('删除成功')
}

watch(() => formData.roomNo, (val) => getAvailableBeds(val))
</script>

<style scoped>
.customer-management { padding: 20px; }
.search-bar { display: flex; gap: 15px; margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; align-items: center; flex-wrap: wrap; }
.search-item { display: flex; align-items: center; gap: 8px; }
.input-text, .input-select { padding: 6px 12px; border: 1px solid #dcdfe6; border-radius: 4px; }
button { padding: 6px 16px; border: none; border-radius: 4px; cursor: pointer; color: #fff; }
.btn-search { background: #409eff; }
.btn-reset { background: #909399; }
.btn-add { background: #67c23a; }
.table-container { overflow-x: auto; }
.customer-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
.customer-table th, .customer-table td { padding: 10px; border: 1px solid #ebeef5; text-align: left; font-size: 13px; }
.customer-table th { background: #f5f7fa; }
.empty-tip { text-align: center; color: #909399; padding: 20px; }
.btn-edit { background: #e6a23c; margin-right: 5px; padding: 4px 10px; font-size: 12px; }
.btn-delete { background: #f56c6c; padding: 4px 10px; font-size: 12px; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal-content { background: #fff; padding: 25px; border-radius: 8px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; }
.modal-content h3 { margin-top: 0; margin-bottom: 20px; }
.checkin-form { display: flex; flex-direction: column; gap: 15px; }
.form-row { display: flex; gap: 15px; flex-wrap: wrap; }
.form-item { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 200px; }
.form-item.full-width { flex: 1 1 100%; }
.form-item label { white-space: nowrap; font-size: 14px; }
.required { color: #f56c6c; }
.form-item input, .form-item select { flex: 1; padding: 6px 10px; border: 1px solid #dcdfe6; border-radius: 4px; }
.form-item input[readonly] { background: #f5f5f5; }
.form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
.btn-cancel { background: #909399; }
.btn-submit { background: #409eff; }
</style>