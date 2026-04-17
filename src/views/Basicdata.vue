<template>
  <div class="a">
    <h3>用户管理</h3>

    <div class="b">
      <!-- 搜索框，绑定sousuo变量 -->
      <el-input
        v-model="sousuo"
        placeholder="搜索姓名"
        style="width: 200px"
        clearable
      />
      
      <!-- 点击新增按钮，调用add方法 -->
      <el-button type="primary" @click="add()">新增用户</el-button>
    </div>

    <!-- 表格展示数据，数据源是newList -->
    <el-table :data="newList" border style="width: 100%; margin-top: 15px">
      <el-table-column prop="id" label="序号" width="60" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="sex" label="性别" width="80" />
      <el-table-column prop="type" label="员工类型" width="100" />

      <!-- 操作列 -->
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <!-- 点击编辑，传入当前行数据 -->
          <el-button link type="primary" @click="edit(row)">编辑</el-button>
          <!-- 点击删除，传入当前行id -->
          <el-button link type="danger" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗，根据bianji判断标题是编辑还是新增 -->
    <el-dialog v-model="show" :title="bianji ? '编辑用户' : '新增用户'" width="400px">
      <el-form :model="form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.tel" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" style="width: 100%">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工类型">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="护工" value="护工" />
            <el-option label="医生" value="医生" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="show = false">取消</el-button>
        <!-- 点击保存，调用save方法 -->
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 引入vue需要的函数
import { ref, reactive, computed } from 'vue'
// 引入提示消息组件
import { ElMessage } from 'element-plus'

// 定义初始数据列表
let list = ref([
  { id: 1, username: 'wuwei', name: '吴伟', tel: '13517178987', sex: '女', type: '护工' },
  { id: 2, username: 'chenxm', name: '陈小明', tel: '18767890987', sex: '男', type: '医生' }
])

// 搜索关键词
let sousuo = ref('')
// 控制弹窗显示隐藏
let show = ref(false)
// 判断是编辑还是新增，true是编辑，false是新增
let bianji = ref(false)

// 表单数据对象
let form = reactive({
  id: null,
  username: '',
  name: '',
  tel: '',
  sex: '男',
  type: '护工'
})

// 计算属性：根据搜索词过滤列表
let newList = computed(() => {
  // 如果没输入搜索词，返回全部
  if(!sousuo.value){
    return list.value
  }
  // 否则返回名字包含搜索词的项
  return list.value.filter(item => item.name.includes(sousuo.value))
})

// 新增用户功能
function add(){
  bianji.value = false // 标记为新增模式
  // 清空表单数据
  form.id = null
  form.username = ''
  form.name = ''
  form.tel = ''
  form.sex = '男'
  form.type = '护工'
  show.value = true // 打开弹窗
}

// 编辑用户功能
function edit(row){
  bianji.value = true // 标记为编辑模式
  // 把当前行的数据赋值给表单
  form.id = row.id
  form.username = row.username
  form.name = row.name
  form.tel = row.tel
  form.sex = row.sex
  form.type = row.type
  show.value = true // 打开弹窗
}

// 保存功能（新增或修改）
function save(){
  // 简单校验：姓名和电话不能为空
  if(!form.name || !form.tel){
    ElMessage.warning('请填写姓名和电话')
    return
  }

  if(bianji.value){
    // 如果是编辑模式
    // 找到列表中对应id的那一项
    let index = list.value.findIndex(item => item.id == form.id)
    if(index != -1){
      // 更新该项的数据
      list.value[index] = {...form}
      ElMessage.success('修改成功')
    }
  }else{
    // 如果是新增模式
    // 计算新的id，取最大id+1，如果没有数据则从1开始
    let newId = 1
    if(list.value.length > 0){
      newId = Math.max(...list.value.map(i=>i.id)) + 1
    }
    // 添加到列表末尾
    list.value.push({...form, id:newId})
    ElMessage.success('新增成功')
  }
  show.value = false // 关闭弹窗
}

// 删除功能
function del(id){
  // 过滤掉id相等的那一项，实现删除
  list.value = list.value.filter(item => item.id != id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
/* 最外层容器样式 */
.a {
  padding: 20px;
  background: #e1a0a0;
}

/* 搜索栏和按钮的布局 */
.b {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>