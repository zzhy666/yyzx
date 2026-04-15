<template>
  <div class="container">
    <!-- 页面标题 -->
    <h3>用户管理</h3>
    
    <!-- 顶部操作栏：包含搜索框和新增按钮 -->
    <div class="header">
      <!-- 
        v-model: 双向绑定搜索关键字 keyword 
        clearable: 提供一键清空搜索内容的功能
      -->
      <el-input 
        v-model="keyword" 
        placeholder="搜索姓名" 
        style="width: 200px" 
        clearable 
      />
      <!-- 点击触发 openDialog 且不传参，表示新增模式 -->
      <el-button type="primary" @click="openDialog()">新增用户</el-button>
    </div>

    <!-- 数据表格区域 -->
    <!-- :data 绑定计算属性 filteredList，实现实时搜索过滤效果 -->
    <el-table :data="filteredList" border style="width: 100%; margin-top: 15px">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="realName" label="姓名" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="gender" label="性别" width="80" />
      <el-table-column prop="userType" label="类型" width="100" />
      
      <!-- 操作列：使用作用域插槽获取当前行数据 row -->
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <!-- 编辑：传入当前行对象 row -->
          <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
          <!-- 删除：传入当前行 ID -->
          <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑共用对话框 -->
    <!-- v-model: 控制对话框显示/隐藏 -->
    <!-- :title: 根据 isEdit 状态动态显示标题 -->
    <el-dialog v-model="visible" :title="isEdit ? '编辑用户' : '新增用户'" width="400px">
      <el-form :model="form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" style="width: 100%">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.userType" style="width: 100%">
            <el-option label="护工" value="护工" />
            <el-option label="医生" value="医生" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <!-- 对话框底部按钮 -->
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

// ================= 数据状态定义 =================

// 模拟的用户列表数据源
const userList = ref([
  { id: 1, username: 'wuwei', realName: '吴伟', phone: '13517178987', gender: '女', userType: '护工' },
  { id: 2, username: 'chenxm', realName: '陈小明', phone: '18767890987', gender: '男', userType: '医生' }
])

// 搜索关键字，用于前端过滤
const keyword = ref('')

// ================= 对话框与表单状态 =================

// 控制对话框可见性
const visible = ref(false)
// 标记当前是编辑模式还是新增模式
const isEdit = ref(false)

// 表单数据模型，使用 reactive 使其具有响应性
const form = reactive({
  id: null,       // 编辑时存储 ID，新增时为 null
  username: '',   // 登录用户名
  realName: '',   // 真实姓名
  phone: '',      // 联系电话
  gender: '男',   // 默认性别
  userType: '护工' // 默认员工类型
})

// ================= 计算属性 =================

/**
 * 实时搜索过滤列表
 * 当 keyword 变化时，自动重新计算并返回过滤后的数组
 */
const filteredList = computed(() => {
  // 如果搜索框为空，返回完整列表
  if (!keyword.value) return userList.value
  // 否则返回姓名包含关键字的用户列表
  return userList.value.filter(item => item.realName.includes(keyword.value))
})

// ================= 业务方法 =================

/**
 * 打开对话框
 * @param {Object|null} row - 如果是编辑模式，传入当前行数据；如果是新增模式，传 null 或不传
 */
const openDialog = (row = null) => {
  // 根据是否传入 row 判断模式
  isEdit.value = !!row
  
  if (row) {
    // 【编辑模式】：将当前行数据复制到表单中
    // Object.assign 目标对象是响应式的 form，源对象是 row
    Object.assign(form, row)
  } else {
    // 【新增模式】：重置表单为初始空值
    Object.assign(form, { 
      id: null, 
      username: '', 
      realName: '', 
      phone: '', 
      gender: '男', 
      userType: '护工' 
    })
  }
  // 显示对话框
  visible.value = true
}

/**
 * 保存数据（新增或更新）
 */
const save = () => {
  // 简单校验：姓名和电话不能为空
  if (!form.realName || !form.phone) {
    return ElMessage.warning('请填写姓名和电话')
  }

  if (isEdit.value) {
    // --- 编辑逻辑 ---
    // 在原始列表中找到对应 ID 的索引
    const index = userList.value.findIndex(item => item.id === form.id)
    if (index !== -1) {
      // 替换该位置的数据（使用展开运算符创建新对象，确保响应式更新）
      userList.value[index] = { ...form }
      ElMessage.success('修改成功')
    }
  } else {
    // --- 新增逻辑 ---
    // 生成新 ID：取现有最大 ID + 1，若列表为空则为 1
    const newId = userList.value.length ? Math.max(...userList.value.map(i => i.id)) + 1 : 1
    // 将表单数据加上 ID 后推入列表
    userList.value.push({ ...form, id: newId })
    ElMessage.success('新增成功')
  }
  
  // 关闭对话框
  visible.value = false
}

/**
 * 删除用户
 * @param {Number} id - 要删除的用户 ID
 */
const handleDelete = (id) => {
  // 使用 filter 过滤掉指定 ID 的项，生成新数组并赋值
  // 这种方式比 splice 更简洁且符合函数式编程风格
  userList.value = userList.value.filter(item => item.id !== id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
/* 容器样式：内边距和背景色 */
.container {
  padding: 20px;
  background: #fff;
}

/* 头部样式：Flex 布局，两端对齐 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>