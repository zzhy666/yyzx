<template>
  <div class="client-out-management">
    <!-- 查询筛选区 -->
    <div class="search-bar">
      <div class="search-item">
        <label>客户姓名：</label>
        <input v-model="searchParams.customerName" type="text" placeholder="请输入姓名模糊查询" />
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

    <!-- 外出登记列表表格 -->
    <div class="table-container">
      <table class="customer-table">
        <thead>
          <tr><th>ID</th><th>客户姓名</th><th>外出事由</th><th>预计外出时间</th><th>预计返回时间</th><th>陪同人</th><th>申请时间</th><th>审核状态</th><th>审批人</th><th>审批时间</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredOutList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ getCustomerName(item.customerId) }}</td>
            <td>{{ item.reason }}</td>
            <td>{{ item.startTime }}</td>
            <td>{{ item.endTime }}</td>
            <td>{{ item.companion || '无' }}</td>
            <td>{{ item.applyTime }}</td>
            <td><span :class="['status-tag', `status-${item.status}`]">{{ getStatusText(item.status) }}</span></td>
            <td>{{ item.approver || '-' }}</td>
            <td>{{ item.approveTime || '-' }}</td>
            <td>
              <button v-if="item.status === 'pending'" @click="openAuditModal(item, 'approved')" class="btn-audit-pass">通过</button>
              <button v-if="item.status === 'pending'" @click="openAuditModal(item, 'rejected')" class="btn-audit-reject">不通过</button>
              <span v-else class="no-action">已处理</span>
            </td>
          </tr>
          <tr v-if="!filteredOutList.length"><td colspan="11" class="empty-tip">暂无数据</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 审核弹窗 -->
    <div v-if="showAuditModal" class="modal-overlay" @click="closeAuditModal">
      <div class="modal-content small-modal" @click.stop>
        <h3>{{ auditType === 'approved' ? '审核通过确认' : '审核不通过' }}</h3>
        <div class="audit-info">
          <p><strong>客户：</strong>{{ getCustomerName(currentAuditItem?.customerId) }}</p>
          <p><strong>事由：</strong>{{ currentAuditItem?.reason }}</p>
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
  { id: 1, name: '张建国', roomNo: '101', bedNo: '101-1', status: 'normal' },
  { id: 2, name: '李桂兰', roomNo: '101', bedNo: '101-2', status: 'normal' },
  { id: 3, name: '王大爷', roomNo: '102', bedNo: '102-1', status: 'normal' }
])

const outList = ref([
  { id: 101, customerId: 1, reason: '回家探亲', startTime: '2025-05-20 09:00', endTime: '2025-05-20 18:00', companion: '张三', applyTime: '2025-05-19 14:30', status: 'pending', approver: '', approveTime: '', rejectReason: '' },
  { id: 102, customerId: 2, reason: '医院复查', startTime: '2025-05-21 08:00', endTime: '2025-05-21 12:00', companion: '李四', applyTime: '2025-05-18 10:00', status: 'approved', approver: 'Admin', approveTime: '2025-05-18 10:30', rejectReason: '' }
])

const searchParams = reactive({ customerName: '', status: '' })
const showAuditModal = ref(false)
const currentAuditItem = ref(null)
const auditType = ref('approved')
const auditReason = ref('')

const filteredOutList = computed(() => outList.value.filter(item => {
  const customer = mockCustomers.value.find(c => c.id === item.customerId)
  const nameMatch = !searchParams.customerName || (customer && customer.name.includes(searchParams.customerName))
  const statusMatch = !searchParams.status || item.status === searchParams.status
  return nameMatch && statusMatch
}))

const getCustomerName = id => mockCustomers.value.find(c => c.id === id)?.name || '未知客户'
const getStatusText = status => ({ pending: '待审核', approved: '已通过', rejected: '不通过' }[status])

const handleSearch = () => {} // 查询按钮触发computed更新
const handleReset = () => { searchParams.customerName = ''; searchParams.status = '' }

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
  const record = outList.value.find(r => r.id === currentAuditItem.value.id)
  if (!record) return

  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  
  record.status = auditType.value
  record.approver = 'CurrentAdmin'
  record.approveTime = timeStr
  if (auditType.value === 'rejected') record.rejectReason = auditReason.value

  if (auditType.value === 'approved') {
    const customer = mockCustomers.value.find(c => c.id === record.customerId)
    if (customer) {
      customer.status = 'out'
      alert(`审核通过！客户【${customer.name}】的床位状态已更新为“外出”。`)
    }
  } else {
    alert('审核已驳回')
  }
  closeAuditModal()
}
</script>

<style scoped>
.client-out-management { padding: 20px; }
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
.status-tag { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
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
.form-item-vertical { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
.form-item-vertical textarea { padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; resize: vertical; }
.form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
.btn-cancel { background: #909399; }
.btn-submit { background: #409eff; }
</style>