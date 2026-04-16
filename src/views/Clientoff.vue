<template>
  <div class="client-off-management">
    <!-- 查询筛选区 -->
    <div class="search-bar">
      <div class="search-item">
        <label>客户姓名：</label>
        <input v-model="searchParams.customerName" type="text" placeholder="请输入姓名模糊查询" />
      </div>
      <div class="search-item">
        <label>退住类型：</label>
        <select v-model="searchParams.type">
          <option value="">全部</option>
          <option value="normal">正常退住</option>
          <option value="death">死亡退住</option>
          <option value="retain">保留床位</option>
        </select>
      </div>
      <div class="search-item">
        <label>审核状态：</label>
        <select v-model="searchParams.status">
          <option value="">全部</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">不通过</option>
        </select>
      </div>
      <button @click="handleSearch" class="btn-search">查询</button>
      <button @click="handleReset" class="btn-reset">重置</button>
    </div>

    <!-- 退住登记列表表格 -->
    <div class="table-container">
      <table class="customer-table">
        <thead><tr><th>ID</th><th>客户姓名</th><th>房间/床位</th><th>退住类型</th><th>申请原因</th><th>申请时间</th><th>审核状态</th><th>审批人</th><th>审批时间</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="item in filteredOffList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ getCustomerName(item.customerId) }}</td>
            <td>{{ getCustomerBedInfo(item.customerId) }}</td>
            <td><span :class="['type-tag', `type-${item.type}`]">{{ typeMap[item.type] }}</span></td>
            <td>{{ item.reason }}</td>
            <td>{{ item.applyTime }}</td>
            <td><span :class="['status-tag', `status-${item.status}`]">{{ statusMap[item.status] }}</span></td>
            <td>{{ item.approver || '-' }}</td>
            <td>{{ item.approveTime || '-' }}</td>
            <td>
              <template v-if="item.status === 'pending'">
                <button @click="openAuditModal(item, 'approved')" class="btn-audit-pass">通过</button>
                <button @click="openAuditModal(item, 'rejected')" class="btn-audit-reject">不通过</button>
              </template>
              <span v-else class="no-action">已处理</span>
            </td>
          </tr>
          <tr v-if="!filteredOffList.length"><td colspan="10" class="empty-tip">暂无数据</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 审核弹窗 -->
    <div v-if="showAuditModal" class="modal-overlay" @click="closeAuditModal">
      <div class="modal-content small-modal" @click.stop>
        <h3>{{ auditType === 'approved' ? '审核通过确认' : '审核不通过' }}</h3>
        <div class="audit-info">
          <p><strong>客户：</strong>{{ getCustomerName(currentAuditItem?.customerId) }}</p>
          <p><strong>退住类型：</strong>{{ typeMap[currentAuditItem?.type] }}</p>
          <p v-if="currentAuditItem?.type !== 'retain' && auditType === 'approved'" class="warning-text">* 审核通过后将释放该客户占用的床位</p>
        </div>
        <div class="form-item-vertical" v-if="auditType === 'rejected'">
          <label>驳回原因：</label>
          <textarea v-model="auditReason" rows="3" placeholder="请输入驳回原因"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" @click="closeAuditModal" class="btn-cancel">取消</button>
          <button type="button" @click="confirmAudit" class="btn-submit">{{ auditType === 'approved' ? '确认通过' : '确认驳回' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// 模拟数据
const mockCustomers = ref([
  { id: 1, name: '张建国', roomNo: '101', bedNo: '101-1', status: 'occupied' },
  { id: 2, name: '李桂兰', roomNo: '101', bedNo: '101-2', status: 'occupied' },
  { id: 3, name: '王大爷', roomNo: '102', bedNo: '102-1', status: 'occupied' }
])
const offList = ref([
  { id: 201, customerId: 1, type: 'normal', reason: '子女接回家养老', applyTime: '2025-05-20 10:00', status: 'pending', approver: '', approveTime: '', rejectReason: '' },
  { id: 202, customerId: 2, type: 'retain', reason: '短期住院，保留床位', applyTime: '2025-05-19 14:30', status: 'approved', approver: 'Admin', approveTime: '2025-05-19 15:00', rejectReason: '' }
])

const searchParams = reactive({ customerName: '', type: '', status: '' })
const showAuditModal = ref(false)
const currentAuditItem = ref(null)
const auditType = ref('approved')
const auditReason = ref('')

// 映射表
const typeMap = { normal: '正常退住', death: '死亡退住', retain: '保留床位' }
const statusMap = { pending: '待审核', approved: '已通过', rejected: '不通过' }

const filteredOffList = computed(() => offList.value.filter(item => {
  const customer = mockCustomers.value.find(c => c.id === item.customerId)
  const nameMatch = !searchParams.customerName || (customer?.name.includes(searchParams.customerName))
  const typeMatch = !searchParams.type || item.type === searchParams.type
  const statusMatch = !searchParams.status || item.status === searchParams.status
  return nameMatch && typeMatch && statusMatch
}))

const getCustomerName = id => mockCustomers.value.find(c => c.id === id)?.name || '未知客户'
const getCustomerBedInfo = id => {
  const c = mockCustomers.value.find(c => c.id === id)
  return c ? `606-${c.roomNo}-${c.bedNo}` : '-'
}

const handleSearch = () => {}
const handleReset = () => { searchParams.customerName = ''; searchParams.type = ''; searchParams.status = '' }

const openAuditModal = (item, type) => {
  currentAuditItem.value = item
  auditType.value = type
  auditReason.value = ''
  showAuditModal.value = true
}
const closeAuditModal = () => {
  showAuditModal.value = false
  currentAuditItem.value = null
  auditReason.value = ''
}

const confirmAudit = () => {
  if (!currentAuditItem.value) return
  const record = offList.value.find(r => r.id === currentAuditItem.value.id)
  if (!record) return

  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  
  record.status = auditType.value
  record.approver = 'CurrentAdmin'
  record.approveTime = timeStr
  if (auditType.value === 'rejected') record.rejectReason = auditReason.value

  if (auditType.value === 'approved') {
    const customer = mockCustomers.value.find(c => c.id === record.customerId)
    if (customer && (record.type === 'normal' || record.type === 'death')) {
      customer.status = 'available'
      alert(`审核通过！客户【${customer.name}】的床位已释放。`)
    } else if (record.type === 'retain') {
      alert(`审核通过！客户【${customer?.name}】已批准保留床位。`)
    }
  } else {
    alert('审核已驳回')
  }
  closeAuditModal()
}
</script>

<style scoped>
.client-off-management { padding: 20px; }
.search-bar { display: flex; gap: 15px; margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; align-items: center; flex-wrap: wrap; }
.search-item { display: flex; align-items: center; gap: 8px; }
.search-item input, .search-item select { padding: 6px 12px; border: 1px solid #dcdfe6; border-radius: 4px; }
button { padding: 6px 16px; border: none; border-radius: 4px; cursor: pointer; color: #fff; }
.btn-search { background: #409eff; }
.btn-reset { background: #909399; }
.btn-audit-pass { background: #67c23a; margin-right: 5px; padding: 4px 10px; font-size: 12px; }
.btn-audit-reject { background: #f56c6c; padding: 4px 10px; font-size: 12px; }
.table-container { overflow-x: auto; }
.customer-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
.customer-table th, .customer-table td { padding: 10px; border: 1px solid #ebeef5; text-align: left; font-size: 13px; }
.customer-table th { background: #f5f7fa; }
.empty-tip { text-align: center; color: #909399; padding: 20px; }
.type-tag, .status-tag { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.type-normal { background: #e1f3d8; color: #67c23a; }
.type-death { background: #fef0f0; color: #f56c6c; }
.type-retain { background: #ecf5ff; color: #409eff; }
.status-pending { background: #fdf6ec; color: #e6a23c; border: 1px solid #faecd8; }
.status-approved { background: #f0f9eb; color: #67c23a; border: 1px solid #e1f3d8; }
.status-rejected { background: #fef0f0; color: #f56c6c; border: 1px solid #fde2e2; }
.no-action { color: #909399; font-size: 12px; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal-content { background: #fff; padding: 25px; border-radius: 8px; width: 90%; max-width: 500px; }
.small-modal { max-width: 400px; }
.modal-content h3 { margin-top: 0; margin-bottom: 20px; }
.audit-info { background: #f9fafc; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 14px; }
.audit-info p { margin: 5px 0; }
.warning-text { color: #e6a23c; font-weight: bold; margin-top: 10px; }
.form-item-vertical { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
.form-item-vertical textarea { padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; resize: vertical; }
.form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
.btn-cancel { background: #909399; }
.btn-submit { background: #409eff; }
</style>