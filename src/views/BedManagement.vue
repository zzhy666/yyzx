<template>
  <div style="padding: 20px;">
     <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3>客户床位绑定信息</h3>
       <div style="width: 300px;">
          <el-input
            v-model="searchKeyword"
            placeholder="输入客户姓名搜索"
            clearable
            @input="handleSearch"
            @clear="handleSearch"
           style="position: relative; left: -500px;">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      <el-button type="primary" @click="showAddDialog = true">添加客户</el-button>
    </div>
   
    
    
    <p>共 {{ sortedBedList.length }} 条记录，当前第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</p>
    
    <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th>序号</th>
          <th>客户姓名</th>
          <th>性别</th>
          <th>床位详情</th>
          <th>使用起始时间</th>
          <th>使用结束时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedBedList" :key="item.id">
          <!-- 计算全局序号: (当前页-1)*每页条数 + 当前行索引 + 1 -->
          <td align="center">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td>{{ item.customerName }}</td>
          <td align="center">{{ item.customerGender }}</td>
          <td>{{ item.roomCode }}室-床{{ item.bedLabel }}</td>
          <td>{{ item.checkInTime }}</td>
          <td>{{ item.checkOutTime || '--' }}</td>
          <td align="center">
            <span :style="{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              backgroundColor: item.status === 'occupied' ? '#f0f9ff' : 
                             item.status === 'out' ? '#fff7e6' : '#f6ffed',
              color: item.status === 'occupied' ? '#409eff' : 
                    item.status === 'out' ? '#e6a23c' : '#67c23a'
            }">
              {{ item.status === 'occupied' ? '占用' : 
                 item.status === 'out' ? '外出' : '空闲' }}
            </span>
          </td>
          <td align="center">
          <!-- 新增删除按钮 -->
          <el-button 
            v-if="item.status === 'occupied' || item.status === 'out'"
            type="danger" 
            size="small" 
            @click="handleDeleteCustomer(item)"
            :loading="deleteLoadingId === item.id"
          >
            删除
          </el-button>
          <span v-else style="color: #999; font-size: 12px;">--</span>
        </td>
        </tr>
      </tbody>
    </table>

    <!-- 分页控件 -->
    <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
      <button 
        @click="goToPrevPage" 
        :disabled="currentPage === 1"
        :style="{ padding: '5px 15px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }"
      >
        上一页
      </button>
      
      <!-- 页码按钮 (简单显示当前页和总页数) -->
      <span style="margin: 0 10px;">
        第 <strong>{{ currentPage }}</strong> 页 / 共 {{ totalPages }} 页
      </span>
      
      <button 
        @click="goToNextPage" 
        :disabled="currentPage === totalPages"
        :style="{ padding: '5px 15px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }"
      >
        下一页
      </button>
    </div>

 <el-dialog
      v-model="showAddDialog"
      title="添加客户"
      width="500px"
    >
      <el-form :model="newCustomerForm" :rules="formRules" ref="addFormRef" label-width="80px">
        <el-form-item label="姓名" prop="customerName">
          <el-input v-model="newCustomerForm.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        
        <el-form-item label="性别" prop="customerGender">
          <el-radio-group v-model="newCustomerForm.customerGender">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="入住时间" prop="checkInTime">
          <el-date-picker
            v-model="newCustomerForm.checkInTime"
            type="date"
            placeholder="选择入住日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="房间号" prop="roomCode">
          <el-select 
            v-model="newCustomerForm.roomCode" 
            placeholder="请选择房间号"
            style="width: 100%"
            @change="handleRoomChange"
          >
            <el-option
              v-for="room in availableRooms"
              :key="room.roomCode"
              :label="`${room.roomCode}室`"
              :value="room.roomCode"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="床铺" prop="bedLabel">
          <el-select 
            v-model="newCustomerForm.bedLabel" 
            placeholder="请选择床铺"
            style="width: 100%"
            :disabled="!newCustomerForm.roomCode"
          >
            <el-option
              v-for="bed in availableBedsInRoom"
              :key="bed.bedLabel"
              :label="`床${bed.bedLabel}`"
              :value="bed.bedLabel"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddCustomer">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
    import {ref,reactive,computed,onMounted} from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    //折叠的是客户数据
    const deleteLoadingId = ref(null)
    const handleDeleteCustomer = (bed) => {
  // 确认删除对话框
  ElMessageBox.confirm(
    `确定要删除客户 "${bed.customerName}" 吗？删除后该床位将变为空闲状态。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    // 设置加载状态
    deleteLoadingId.value = bed.id
    
    try {
      // 1. 在本地数据中找到该床位
      const bedIndex = customerBedList.value.findIndex(item => item.id === bed.id)
      
      if (bedIndex === -1) {
        throw new Error('未找到对应的床位记录')
      }
      
      // 2. 重置床位状态为"空闲"，清空客户信息
      customerBedList.value[bedIndex] = {
        ...customerBedList.value[bedIndex],
        customerName: '',
        customerGender: '',
        checkInTime: '',
        checkOutTime: '',
        status: 'available'
      }
      
      // 3. 保存到 localStorage
      localStorage.setItem('customerBedList', JSON.stringify(customerBedList.value))
      
      // 4. 触发数据更新事件，通知床位示意图页面
      window.dispatchEvent(new CustomEvent('bed-data-updated'))
      
      // 5. 显示成功消息
      ElMessage.success(`已删除客户 "${bed.customerName}"，床位 ${bed.roomCode}-${bed.bedLabel} 已恢复为空闲状态`)
      
    } catch (error) {
      console.error('删除客户失败:', error)
      ElMessage.error(`删除失败: ${error.message}`)
    } finally {
      // 清除加载状态
      deleteLoadingId.value = null
      
      // 6. 检查是否需要调整分页
      // 如果当前页没有数据了，且不是第一页，则返回上一页
      if (paginatedBedList.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
      }
    }
  }).catch(() => {
    // 用户取消了删除
    console.log('用户取消了删除操作')
  })
}
  const customerBedList = ref([
  // 占用客户 (前70个床位中的一部分，入住时间打乱)
  { id: 1, customerName: '张三', customerGender: '男', roomCode: '101', bedLabel: 'A', bedCode: '101-A', checkInTime: '2024-03-01', checkOutTime: '', status: 'occupied' },
  { id: 2, customerName: '李四', customerGender: '女', roomCode: '101', bedLabel: 'B', bedCode: '101-B', checkInTime: '2024-02-25', checkOutTime: '', status: 'occupied' },
  { id: 3, customerName: '王五', customerGender: '男', roomCode: '102', bedLabel: 'A', bedCode: '102-A', checkInTime: '2024-03-10', checkOutTime: '', status: 'occupied' },
  { id: 4, customerName: '赵六', customerGender: '女', roomCode: '102', bedLabel: 'B', bedCode: '102-B', checkInTime: '2024-02-15', checkOutTime: '', status: 'occupied' },
  { id: 5, customerName: '钱七', customerGender: '男', roomCode: '103', bedLabel: 'A', bedCode: '103-A', checkInTime: '2024-03-05', checkOutTime: '', status: 'occupied' },
  { id: 6, customerName: '孙八', customerGender: '女', roomCode: '103', bedLabel: 'B', bedCode: '103-B', checkInTime: '2024-02-28', checkOutTime: '', status: 'occupied' },
  { id: 7, customerName: '周九', customerGender: '男', roomCode: '104', bedLabel: 'A', bedCode: '104-A', checkInTime: '2024-01-20', checkOutTime: '', status: 'occupied' },
  { id: 8, customerName: '吴十', customerGender: '女', roomCode: '104', bedLabel: 'B', bedCode: '104-B', checkInTime: '2024-03-12', checkOutTime: '', status: 'occupied' },
  { id: 9, customerName: '郑十一', customerGender: '男', roomCode: '105', bedLabel: 'A', bedCode: '105-A', checkInTime: '2024-02-10', checkOutTime: '', status: 'occupied' },
  { id: 10, customerName: '王十二', customerGender: '女', roomCode: '105', bedLabel: 'B', bedCode: '105-B', checkInTime: '2024-01-30', checkOutTime: '', status: 'occupied' },
  { id: 11, customerName: '刘十三', customerGender: '男', roomCode: '106', bedLabel: 'A', bedCode: '106-A', checkInTime: '2024-03-08', checkOutTime: '', status: 'occupied' },
  { id: 12, customerName: '陈十四', customerGender: '女', roomCode: '106', bedLabel: 'B', bedCode: '106-B', checkInTime: '2024-02-20', checkOutTime: '', status: 'occupied' },
  { id: 13, customerName: '晨风', customerGender: '男', roomCode: '107', bedLabel: 'A', bedCode: '107-A', checkInTime: '2024-02-18', checkOutTime: '', status: 'occupied' },
  { id: 14, customerName: '雨薇', customerGender: '女', roomCode: '107', bedLabel: 'B', bedCode: '107-B', checkInTime: '2024-03-03', checkOutTime: '', status: 'occupied' },
  { id: 15, customerName: '子墨', customerGender: '男', roomCode: '108', bedLabel: 'A', bedCode: '108-A', checkInTime: '2024-01-25', checkOutTime: '', status: 'occupied' },
  { id: 16, customerName: '心怡', customerGender: '女', roomCode: '108', bedLabel: 'B', bedCode: '108-B', checkInTime: '2024-02-28', checkOutTime: '', status: 'occupied' },
  { id: 17, customerName: '天宇', customerGender: '男', roomCode: '109', bedLabel: 'A', bedCode: '109-A', checkInTime: '2024-03-01', checkOutTime: '', status: 'occupied' },
  { id: 18, customerName: '雅静', customerGender: '女', roomCode: '109', bedLabel: 'B', bedCode: '109-B', checkInTime: '2024-02-14', checkOutTime: '', status: 'occupied' },
  { id: 19, customerName: '文博', customerGender: '男', roomCode: '110', bedLabel: 'A', bedCode: '110-A', checkInTime: '2024-01-30', checkOutTime: '', status: 'occupied' },
  { id: 20, customerName: '思雨', customerGender: '女', roomCode: '110', bedLabel: 'B', bedCode: '110-B', checkInTime: '2024-03-05', checkOutTime: '', status: 'occupied' },
  { id: 21, customerName: '俊逸', customerGender: '男', roomCode: '111', bedLabel: 'A', bedCode: '111-A', checkInTime: '2024-02-22', checkOutTime: '', status: 'occupied' },
  { id: 22, customerName: '雨婷', customerGender: '女', roomCode: '111', bedLabel: 'B', bedCode: '111-B', checkInTime: '2024-01-18', checkOutTime: '', status: 'occupied' },
  { id: 23, customerName: '浩然', customerGender: '男', roomCode: '112', bedLabel: 'A', bedCode: '112-A', checkInTime: '2024-03-10', checkOutTime: '', status: 'occupied' },
  { id: 24, customerName: '可馨', customerGender: '女', roomCode: '112', bedLabel: 'B', bedCode: '112-B', checkInTime: '2024-02-05', checkOutTime: '', status: 'occupied' },
  { id: 25, customerName: '一鸣', customerGender: '男', roomCode: '113', bedLabel: 'A', bedCode: '113-A', checkInTime: '2024-01-28', checkOutTime: '', status: 'occupied' },
  { id: 26, customerName: '诗琪', customerGender: '女', roomCode: '113', bedLabel: 'B', bedCode: '113-B', checkInTime: '2024-03-12', checkOutTime: '', status: 'occupied' },
{ id: 27, customerName: '晨熙', customerGender: '男', roomCode: '201', bedLabel: 'A', bedCode: '201-A', checkInTime: '2024-02-08', checkOutTime: '', status: 'occupied' },
  { id: 28, customerName: '雨萱', customerGender: '女', roomCode: '201', bedLabel: 'B', bedCode: '201-B', checkInTime: '2024-03-15', checkOutTime: '', status: 'occupied' },
  { id: 29, customerName: '俊杰', customerGender: '男', roomCode: '202', bedLabel: 'A', bedCode: '202-A', checkInTime: '2024-01-22', checkOutTime: '', status: 'occupied' },
  { id: 30, customerName: '梓萱', customerGender: '女', roomCode: '202', bedLabel: 'B', bedCode: '202-B', checkInTime: '2024-02-25', checkOutTime: '', status: 'occupied' },
  { id: 31, customerName: '子轩', customerGender: '男', roomCode: '203', bedLabel: 'A', bedCode: '203-A', checkInTime: '2024-03-02', checkOutTime: '', status: 'occupied' },
  { id: 32, customerName: '欣怡', customerGender: '女', roomCode: '203', bedLabel: 'B', bedCode: '203-B', checkInTime: '2024-02-12', checkOutTime: '', status: 'occupied' },
  { id: 33, customerName: '博文', customerGender: '男', roomCode: '204', bedLabel: 'A', bedCode: '204-A', checkInTime: '2024-01-15', checkOutTime: '', status: 'occupied' },
  { id: 34, customerName: '雨桐', customerGender: '女', roomCode: '204', bedLabel: 'B', bedCode: '204-B', checkInTime: '2024-03-08', checkOutTime: '', status: 'occupied' },
  { id: 35, customerName: '明哲', customerGender: '男', roomCode: '205', bedLabel: 'A', bedCode: '205-A', checkInTime: '2024-02-28', checkOutTime: '', status: 'occupied' },
  { id: 36, customerName: '静怡', customerGender: '女', roomCode: '205', bedLabel: 'B', bedCode: '205-B', checkInTime: '2024-01-10', checkOutTime: '', status: 'occupied' },
  { id: 37, customerName: '宇航', customerGender: '男', roomCode: '206', bedLabel: 'A', bedCode: '206-A', checkInTime: '2024-03-18', checkOutTime: '', status: 'occupied' },
  { id: 38, customerName: '梦瑶', customerGender: '女', roomCode: '206', bedLabel: 'B', bedCode: '206-B', checkInTime: '2024-02-02', checkOutTime: '', status: 'occupied' },
  { id: 39, customerName: '宇轩', customerGender: '男', roomCode: '207', bedLabel: 'A', bedCode: '207-A', checkInTime: '2024-01-05', checkOutTime: '', status: 'occupied' },
  { id: 40, customerName: '美琳', customerGender: '女', roomCode: '207', bedLabel: 'B', bedCode: '207-B', checkInTime: '2024-03-22', checkOutTime: '', status: 'occupied' },
  { id: 41, customerName: '俊熙', customerGender: '男', roomCode: '208', bedLabel: 'A', bedCode: '208-A', checkInTime: '2024-02-15', checkOutTime: '', status: 'occupied' },
  { id: 42, customerName: '诗韵', customerGender: '女', roomCode: '208', bedLabel: 'B', bedCode: '208-B', checkInTime: '2024-01-28', checkOutTime: '', status: 'occupied' },
  { id: 43, customerName: '子涵', customerGender: '男', roomCode: '209', bedLabel: 'A', bedCode: '209-A', checkInTime: '2024-03-05', checkOutTime: '', status: 'occupied' },
  { id: 44, customerName: '雨欣', customerGender: '女', roomCode: '209', bedLabel: 'B', bedCode: '209-B', checkInTime: '2024-02-18', checkOutTime: '', status: 'occupied' },
  { id: 45, customerName: '天佑', customerGender: '男', roomCode: '210', bedLabel: 'A', bedCode: '210-A', checkInTime: '2024-01-12', checkOutTime: '', status: 'occupied' },
  { id: 46, customerName: '婉婷', customerGender: '女', roomCode: '210', bedLabel: 'B', bedCode: '210-B', checkInTime: '2024-03-25', checkOutTime: '', status: 'occupied' },
  { id: 47, customerName: '文昊', customerGender: '男', roomCode: '211', bedLabel: 'A', bedCode: '211-A', checkInTime: '2024-02-08', checkOutTime: '', status: 'occupied' },
  { id: 48, customerName: '佳琪', customerGender: '女', roomCode: '211', bedLabel: 'B', bedCode: '211-B', checkInTime: '2024-01-20', checkOutTime: '', status: 'occupied' },
  { id: 49, customerName: '明轩', customerGender: '男', roomCode: '212', bedLabel: 'A', bedCode: '212-A', checkInTime: '2024-03-12', checkOutTime: '', status: 'occupied' },
  { id: 50, customerName: '雨菲', customerGender: '女', roomCode: '212', bedLabel: 'B', bedCode: '212-B', checkInTime: '2024-02-25', checkOutTime: '', status: 'occupied' },
  { id: 51, customerName: '博涛', customerGender: '男', roomCode: '213', bedLabel: 'A', bedCode: '213-A', checkInTime: '2024-01-18', checkOutTime: '', status: 'occupied' },
  { id: 52, customerName: '思颖', customerGender: '女', roomCode: '213', bedLabel: 'B', bedCode: '213-B', checkInTime: '2024-03-28', checkOutTime: '', status: 'occupied' },
  { id: 53, customerName: '宇辰', customerGender: '男', roomCode: '214', bedLabel: 'A', bedCode: '214-A', checkInTime: '2024-02-12', checkOutTime: '', status: 'occupied' },
  { id: 54, customerName: '雨涵', customerGender: '女', roomCode: '214', bedLabel: 'B', bedCode: '214-B', checkInTime: '2024-01-25', checkOutTime: '', status: 'occupied' },
  { id: 55, customerName: '俊宇', customerGender: '男', roomCode: '215', bedLabel: 'A', bedCode: '215-A', checkInTime: '2024-03-20', checkOutTime: '', status: 'occupied' },
  { id: 56, customerName: '雅雯', customerGender: '女', roomCode: '215', bedLabel: 'B', bedCode: '215-B', checkInTime: '2024-02-28', checkOutTime: '', status: 'occupied' },
  { id: 57, customerName: '梓晨', customerGender: '男', roomCode: '216', bedLabel: 'A', bedCode: '216-A', checkInTime: '2024-01-30', checkOutTime: '', status: 'occupied' },
  { id: 58, customerName: '梦洁', customerGender: '女', roomCode: '216', bedLabel: 'B', bedCode: '216-B', checkInTime: '2024-03-15', checkOutTime: '', status: 'occupied' },
  { id: 59, customerName: '天翔', customerGender: '男', roomCode: '217', bedLabel: 'A', bedCode: '217-A', checkInTime: '2024-02-05', checkOutTime: '', status: 'occupied' },
  { id: 60, customerName: '雪薇', customerGender: '女', roomCode: '217', bedLabel: 'B', bedCode: '217-B', checkInTime: '2024-01-15', checkOutTime: '', status: 'occupied' },
  { id: 61, customerName: '文轩', customerGender: '男', roomCode: '218', bedLabel: 'A', bedCode: '218-A', checkInTime: '2024-03-10', checkOutTime: '', status: 'occupied' },
  { id: 62, customerName: '雨欣', customerGender: '女', roomCode: '218', bedLabel: 'B', bedCode: '218-B', checkInTime: '2024-02-20', checkOutTime: '', status: 'occupied' },
  { id: 63, customerName: '子睿', customerGender: '男', roomCode: '301', bedLabel: 'A', bedCode: '301-A', checkInTime: '2024-01-08', checkOutTime: '', status: 'occupied' },
  { id: 64, customerName: '诗诗', customerGender: '女', roomCode: '301', bedLabel: 'B', bedCode: '301-B', checkInTime: '2024-03-18', checkOutTime: '', status: 'occupied' },
  { id: 65, customerName: '浩然', customerGender: '男', roomCode: '302', bedLabel: 'A', bedCode: '302-A', checkInTime: '2024-02-22', checkOutTime: '', status: 'occupied' },
  { id: 66, customerName: '佳怡', customerGender: '女', roomCode: '302', bedLabel: 'B', bedCode: '302-B', checkInTime: '2024-01-12', checkOutTime: '', status: 'occupied' },
  { id: 67, customerName: '一航', customerGender: '男', roomCode: '303', bedLabel: 'A', bedCode: '303-A', checkInTime: '2024-03-25', checkOutTime: '', status: 'occupied' },
  { id: 68, customerName: '婉清', customerGender: '女', roomCode: '303', bedLabel: 'B', bedCode: '303-B', checkInTime: '2024-02-28', checkOutTime: '', status: 'occupied' },
  { id: 69, customerName: '晨阳', customerGender: '男', roomCode: '304', bedLabel: 'A', bedCode: '304-A', checkInTime: '2024-01-20', checkOutTime: '', status: 'occupied' },
  { id: 70, customerName: '诗雅', customerGender: '女', roomCode: '304', bedLabel: 'B', bedCode: '304-B', checkInTime: '2024-03-30', checkOutTime: '', status: 'occupied' },
// 空闲床位列表 (ID 71-110) - 纯净可分配状态
{ id: 71, customerName: '', customerGender: '', roomCode: '305', bedLabel: 'A', bedCode: '305-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 72, customerName: '', customerGender: '', roomCode: '305', bedLabel: 'B', bedCode: '305-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 73, customerName: '', customerGender: '', roomCode: '306', bedLabel: 'A', bedCode: '306-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 74, customerName: '', customerGender: '', roomCode: '306', bedLabel: 'B', bedCode: '306-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 75, customerName: '', customerGender: '', roomCode: '307', bedLabel: 'A', bedCode: '307-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 76, customerName: '', customerGender: '', roomCode: '307', bedLabel: 'B', bedCode: '307-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 77, customerName: '', customerGender: '', roomCode: '308', bedLabel: 'A', bedCode: '308-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 78, customerName: '', customerGender: '', roomCode: '308', bedLabel: 'B', bedCode: '308-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 79, customerName: '', customerGender: '', roomCode: '309', bedLabel: 'A', bedCode: '309-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 80, customerName: '', customerGender: '', roomCode: '309', bedLabel: 'B', bedCode: '309-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 81, customerName: '', customerGender: '', roomCode: '310', bedLabel: 'A', bedCode: '310-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 82, customerName: '', customerGender: '', roomCode: '310', bedLabel: 'B', bedCode: '310-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 83, customerName: '', customerGender: '', roomCode: '311', bedLabel: 'A', bedCode: '311-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 84, customerName: '', customerGender: '', roomCode: '311', bedLabel: 'B', bedCode: '311-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 85, customerName: '', customerGender: '', roomCode: '312', bedLabel: 'A', bedCode: '312-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 86, customerName: '', customerGender: '', roomCode: '312', bedLabel: 'B', bedCode: '312-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 87, customerName: '', customerGender: '', roomCode: '313', bedLabel: 'A', bedCode: '313-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 88, customerName: '', customerGender: '', roomCode: '313', bedLabel: 'B', bedCode: '313-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 89, customerName: '', customerGender: '', roomCode: '314', bedLabel: 'A', bedCode: '314-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 90, customerName: '', customerGender: '', roomCode: '314', bedLabel: 'B', bedCode: '314-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 91, customerName: '', customerGender: '', roomCode: '315', bedLabel: 'A', bedCode: '315-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 92, customerName: '', customerGender: '', roomCode: '315', bedLabel: 'B', bedCode: '315-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 93, customerName: '', customerGender: '', roomCode: '316', bedLabel: 'A', bedCode: '316-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 94, customerName: '', customerGender: '', roomCode: '316', bedLabel: 'B', bedCode: '316-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 95, customerName: '', customerGender: '', roomCode: '317', bedLabel: 'A', bedCode: '317-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 96, customerName: '', customerGender: '', roomCode: '317', bedLabel: 'B', bedCode: '317-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 97, customerName: '', customerGender: '', roomCode: '318', bedLabel: 'A', bedCode: '318-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 98, customerName: '', customerGender: '', roomCode: '318', bedLabel: 'B', bedCode: '318-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 99, customerName: '', customerGender: '', roomCode: '401', bedLabel: 'A', bedCode: '401-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 100, customerName: '', customerGender: '', roomCode: '401', bedLabel: 'B', bedCode: '401-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 101, customerName: '', customerGender: '', roomCode: '402', bedLabel: 'A', bedCode: '402-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 102, customerName: '', customerGender: '', roomCode: '402', bedLabel: 'B', bedCode: '402-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 103, customerName: '', customerGender: '', roomCode: '403', bedLabel: 'A', bedCode: '403-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 104, customerName: '', customerGender: '', roomCode: '403', bedLabel: 'B', bedCode: '403-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 105, customerName: '', customerGender: '', roomCode: '404', bedLabel: 'A', bedCode: '404-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 106, customerName: '', customerGender: '', roomCode: '404', bedLabel: 'B', bedCode: '404-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 107, customerName: '', customerGender: '', roomCode: '405', bedLabel: 'A', bedCode: '405-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 108, customerName: '', customerGender: '', roomCode: '405', bedLabel: 'B', bedCode: '405-B', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 109, customerName: '', customerGender: '', roomCode: '406', bedLabel: 'A', bedCode: '406-A', checkInTime: '', checkOutTime: '', status: 'available' },
{ id: 110, customerName: '', customerGender: '', roomCode: '406', bedLabel: 'B', bedCode: '406-B', checkInTime: '', checkOutTime: '', status: 'available' },
  { id: 111, customerName: '外出客户甲', customerGender: '男', roomCode: '418', bedLabel: 'A', bedCode: '418-A', checkInTime: '2024-02-01', checkOutTime: '', status: 'out' },
  { id: 112, customerName: '外出客户乙', customerGender: '女', roomCode: '418', bedLabel: 'B', bedCode: '418-B', checkInTime: '2024-03-03', checkOutTime: '', status: 'out' },
  { id: 113, customerName: '外出客户丙', customerGender: '男', roomCode: '417', bedLabel: 'A', bedCode: '417-A', checkInTime: '2024-01-15', checkOutTime: '', status: 'out' },
  { id: 114, customerName: '外出客户丁', customerGender: '女', roomCode: '417', bedLabel: 'B', bedCode: '417-B', checkInTime: '2024-02-28', checkOutTime: '', status: 'out' },
  { id: 115, customerName: '外出客户戊', customerGender: '男', roomCode: '416', bedLabel: 'A', bedCode: '416-A', checkInTime: '2024-03-15', checkOutTime: '', status: 'out' },
  { id: 116, customerName: '外出客户己', customerGender: '女', roomCode: '416', bedLabel: 'B', bedCode: '416-B', checkInTime: '2024-02-05', checkOutTime: '', status: 'out' },
  { id: 117, customerName: '外出客户庚', customerGender: '男', roomCode: '415', bedLabel: 'A', bedCode: '415-A', checkInTime: '2024-01-10', checkOutTime: '', status: 'out' },
  { id: 118, customerName: '外出客户辛', customerGender: '女', roomCode: '415', bedLabel: 'B', bedCode: '415-B', checkInTime: '2024-03-01', checkOutTime: '', status: 'out' },
{ id: 119, customerName: '王芳', customerGender: '女', roomCode: '415', bedLabel: 'A', bedCode: '415-A', checkInTime: '2024-02-28', checkOutTime: '', status: 'out' },
{ id: 120, customerName: '张强', customerGender: '男', roomCode: '416', bedLabel: 'B', bedCode: '416-B', checkInTime: '2024-03-05', checkOutTime: '', status: 'out' },
{ id: 121, customerName: '李娜', customerGender: '女', roomCode: '416', bedLabel: 'A', bedCode: '416-A', checkInTime: '2024-02-25', checkOutTime: '', status: 'out' },
{ id: 122, customerName: '刘洋', customerGender: '男', roomCode: '417', bedLabel: 'B', bedCode: '417-B', checkInTime: '2024-03-10', checkOutTime: '', status: 'out' },
{ id: 123, customerName: '赵敏', customerGender: '女', roomCode: '417', bedLabel: 'A', bedCode: '417-A', checkInTime: '2024-02-20', checkOutTime: '', status: 'out' },
{ id: 124, customerName: '孙伟', customerGender: '男', roomCode: '418', bedLabel: 'B', bedCode: '418-B', checkInTime: '2024-03-03', checkOutTime: '', status: 'out' },
{ id: 125, customerName: '周婷', customerGender: '女', roomCode: '418', bedLabel: 'A', bedCode: '418-A', checkInTime: '2024-02-15', checkOutTime: '', status: 'out' },
{ id: 126, customerName: '吴勇', customerGender: '男', roomCode: '419', bedLabel: 'B', bedCode: '419-B', checkInTime: '2024-03-08', checkOutTime: '', status: 'out' },
{ id: 127, customerName: '郑丽', customerGender: '女', roomCode: '419', bedLabel: 'A', bedCode: '419-A', checkInTime: '2024-02-18', checkOutTime: '', status: 'out' },
{ id: 128, customerName: '冯军', customerGender: '男', roomCode: '420', bedLabel: 'B', bedCode: '420-B', checkInTime: '2024-03-12', checkOutTime: '', status: 'out' },
{ id: 129, customerName: '陈静', customerGender: '女', roomCode: '420', bedLabel: 'A', bedCode: '420-A', checkInTime: '2024-02-22', checkOutTime: '', status: 'out' },
{ id: 130, customerName: '卫华', customerGender: '男', roomCode: '421', bedLabel: 'B', bedCode: '421-B', checkInTime: '2024-03-15', checkOutTime: '', status: 'out' },
{ id: 131, customerName: '蒋芳', customerGender: '女', roomCode: '421', bedLabel: 'A', bedCode: '421-A', checkInTime: '2024-02-28', checkOutTime: '', status: 'out' },
{ id: 132, customerName: '沈明', customerGender: '男', roomCode: '422', bedLabel: 'B', bedCode: '422-B', checkInTime: '2024-03-18', checkOutTime: '', status: 'out' },
{ id: 133, customerName: '韩梅', customerGender: '女', roomCode: '422', bedLabel: 'A', bedCode: '422-A', checkInTime: '2024-03-01', checkOutTime: '', status: 'out' },
{ id: 134, customerName: '杨帆', customerGender: '男', roomCode: '423', bedLabel: 'B', bedCode: '423-B', checkInTime: '2024-03-20', checkOutTime: '', status: 'out' }

])
const searchKeyword = ref('')//搜索关键词
const effectiveBedList = computed(() => {//从完整数据中过滤掉“空闲”床位，得到“有效客户列表”
  return customerBedList.value.filter(bed => bed.status !== 'available')
})
const filteredBedList = computed(() => { //根据搜索关键词进行筛选
  if (!searchKeyword.value.trim()) {
    return effectiveBedList.value // 没有搜索词，返回全部有效客户
  }
  const keyword = searchKeyword.value.trim().toLowerCase()
  return effectiveBedList.value.filter(bed => 
    bed.customerName && bed.customerName.toLowerCase().includes(keyword)
  )
})
const filteredAndSortedList = computed(() => {
  return [...filteredBedList.value].sort((a, b) => {
    return new Date(b.checkInTime) - new Date(a.checkInTime)
  })
})
const paginatedBedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAndSortedList.value.slice(start, end)
})
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedList.value.length / pageSize.value)
})
const handleSearch = () => {
  // 搜索关键词变化时，重置到第一页，体验更好
  currentPage.value = 1
}

const addFormRef = ref(null)// 表单引用
const showAddDialog = ref(false)// 是否显示添加弹窗

const newCustomerForm = ref({
  customerName: '',
  customerGender: '男',
  checkInTime: '',
  roomCode: '',
  bedLabel: ''
})

// 表单验证规则
const formRules = {
  customerName: [
    { required: true, message: '请输入客户姓名', trigger: 'blur' }
  ],
  customerGender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  checkInTime: [
    { required: true, message: '请选择入住时间', trigger: 'change' }
  ],
  roomCode: [
    { required: true, message: '请选择房间号', trigger: 'change' }
  ],
  bedLabel: [
    { required: true, message: '请选择床铺', trigger: 'change' }
  ]
}

// 计算属性：获取所有空闲床位的房间
const availableRooms = computed(() => {
  const rooms = []
  const roomSet = new Set()
  
  // 过滤出所有空闲床位
  customerBedList.value.forEach(bed => {
    if (bed.status === 'available') {
      if (!roomSet.has(bed.roomCode)) {
        roomSet.add(bed.roomCode)
        rooms.push({
          roomCode: bed.roomCode,
          roomName: `${bed.roomCode}室`
        })
      }
    }
  })
  
  return rooms
})

// 计算属性：获取选中房间的空闲床铺
const availableBedsInRoom = computed(() => {
  if (!newCustomerForm.value.roomCode) {
    return []
  }
  
  return customerBedList.value
    .filter(bed => 
      bed.roomCode === newCustomerForm.value.roomCode && 
      bed.status === 'available'
    )
    .map(bed => ({
      bedLabel: bed.bedLabel,
      bedCode: bed.bedCode
    }))
})

// 房间变更时的处理
const handleRoomChange = () => {
  // 清空已选的床铺
  newCustomerForm.value.bedLabel = ''
  
  // 如果该房间只有一个空闲床位，自动选中
  if (availableBedsInRoom.value.length === 1) {
    newCustomerForm.value.bedLabel = availableBedsInRoom.value[0].bedLabel
  }
}

// 添加客户的处理函数
const handleAddCustomer = () => {
  if (!addFormRef.value) return
  
  addFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请填写完整信息')
      return
    }
    
    try {
      // 找到对应的空闲床位记录
      const targetBedIndex = customerBedList.value.findIndex(bed => 
        bed.roomCode === newCustomerForm.value.roomCode && 
        bed.bedLabel === newCustomerForm.value.bedLabel && 
        bed.status === 'available'
      )
      
      if (targetBedIndex === -1) {
        ElMessage.error('所选床位已被占用，请重新选择')
        return
      }
      
      // 更新床位状态为客户信息
      const bedId = customerBedList.value[targetBedIndex].id
      customerBedList.value[targetBedIndex] = {
        ...customerBedList.value[targetBedIndex],
        customerName: newCustomerForm.value.customerName,
        customerGender: newCustomerForm.value.customerGender,
        checkInTime: newCustomerForm.value.checkInTime,
        checkOutTime: '', // 清空结束时间
        status: 'occupied' // 更新为占用状态
      }
      localStorage.setItem('customerBedList', JSON.stringify(customerBedList.value))
      
      // 触发自定义事件，告诉其他页面数据更新了
      window.dispatchEvent(new CustomEvent('bed-data-updated'))
      // 重置表单
      newCustomerForm.value = {
        customerName: '',
        customerGender: '男',
        checkInTime: '',
        roomCode: '',
        bedLabel: ''
      }
      
      // 关闭弹窗
      showAddDialog.value = false
      
      // 显示成功消息
      ElMessage.success('客户添加成功')
      
    } catch (error) {
      console.error('添加客户失败:', error)
      ElMessage.error('添加客户失败，请重试')
    }
  })
}
// 2. 分页相关状态
const currentPage = ref(1) // 当前页码
const pageSize = ref(10)   // 每页显示条数

// 3. 计算属性：按入住时间倒序排列（最新的在前）
const sortedBedList = computed(() => {
    const nonEmptyBeds = customerBedList.value.filter(bed => bed.status !== 'available');
  return [...nonEmptyBeds].sort((a, b) => {
    // 将日期字符串转换为时间戳进行比较
    return new Date(b.checkInTime) - new Date(a.checkInTime)
  })
})
// 6. 翻页方法
const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber
  }
}
onMounted(() => {
  const savedData = localStorage.getItem('customerBedList')
  if (savedData) {
    try {
      customerBedList.value = JSON.parse(savedData)
      console.log(`从 localStorage 恢复 ${customerBedList.value.length} 条床位数据`)
    } catch (error) {
      console.error('恢复数据失败:', error)
    }
  }
})

</script>

<style scoped>
</style>