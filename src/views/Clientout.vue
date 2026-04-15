<template>
  <div>
    <!-- 按钮：触发弹窗 -->
    <el-button type="primary" @click="openModal('add')">新增入住</el-button>
    <el-button type="primary" @click="openModal('edit', rowData)">修改</el-button>

    <!-- 入住登记模态框 -->
    <el-dialog
      title="入住登记/信息修改-使用一个模态框"
      v-model="visible"
      width="800px"
      :before-close="handleBeforeClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-width="100px"
        class="modal-form"
      >
        <el-row :gutter="20">
          <!-- 左侧 -->
          <el-col :span="12">
            <el-form-item label="客户姓名:" prop="name">
              <el-input v-model="form.name" placeholder="请输入客户姓名" />
            </el-form-item>

            <el-form-item label="年龄:" prop="age">
              <el-input v-model.number="form.age" type="number" placeholder="请输入年龄" />
            </el-form-item>

            <el-form-item label="性别:" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>

            <el-form-item label="出生日期:" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="请选择出生日期"
                style="width:100%"
              />
            </el-form-item>

            <el-form-item label="身份证号:" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>

            <el-form-item label="血型:" prop="bloodType">
              <el-select v-model="form.bloodType" placeholder="请选择血型">
                <el-option label="A" value="A" />
                <el-option label="B" value="B" />
                <el-option label="O" value="O" />
                <el-option label="AB" value="AB" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 右侧 -->
          <el-col :span="12">
            <el-form-item label="楼栋:" prop="building">
              <el-input v-model="form.building" placeholder="例如：606" />
            </el-form-item>

            <el-form-item label="房间号:" prop="room">
              <el-select v-model="form.room" placeholder="请选择房间号">
                <!-- 实际项目从接口获取 -->
                <el-option label="101" value="101" />
                <el-option label="102" value="102" />
              </el-select>
            </el-form-item>

            <el-form-item label="床位号:" prop="bed">
              <el-select v-model="form.bed" placeholder="请选择床位号">
                <el-option label="1" value="1" />
                <el-option label="2" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item label="入住时间:" prop="checkInTime">
              <el-date-picker
                v-model="form.checkInTime"
                type="datetime"
                placeholder="请选择入住时间"
                style="width:100%"
              />
            </el-form-item>

            <el-form-item label="合同到期时间:" prop="contractEnd">
              <el-date-picker
                v-model="form.contractEnd"
                type="date"
                placeholder="请选择合同到期时间"
                style="width:100%"
              />
            </el-form-item>

            <el-form-item label="联系电话:" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>

            <el-form-item label="家属:" prop="family">
              <el-input v-model="form.family" placeholder="请输入家属姓名" />
            </el-form-item>

            <el-form-item label="身心状况:" prop="status">
              <el-input v-model="form.status" placeholder="请输入身心状况" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="saveForm">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 弹窗显示控制
const visible = ref(false)

// 表单绑定
const formRef = ref(null)
const form = reactive({
  name: '',
  age: '',
  gender: '',
  birthday: '',
  idCard: '',
  bloodType: '',
  building: '',
  room: '',
  bed: '',
  checkInTime: '',
  contractEnd: '',
  phone: '',
  family: '',
  status: ''
})

// 当前操作类型 add / edit
let modalType = ''

// 用于编辑时的原始数据
let rowData = null

// 打开弹窗
const openModal = (type, row = null) => {
  visible.value = true
  modalType = type
  rowData = row

  // 重置表单
  formRef.value?.clearValidate()

  // 如果是编辑，回填数据
  if (type === 'edit' && row) {
    Object.assign(form, row)
  } else {
    // 新增时重置表单
    Object.assign(form, {
      name: '',
      age: '',
      gender: '',
      birthday: '',
      idCard: '',
      bloodType: '',
      building: '',
      room: '',
      bed: '',
      checkInTime: '',
      contractEnd: '',
      phone: '',
      family: '',
      status: ''
    })
  }
}

// 关闭前确认
const handleBeforeClose = (done) => {
  ElMessageBox.confirm('确认关闭？')
    .then(() => {
      done()
    })
    .catch(() => {})
}

// 保存表单
const saveForm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return

    console.log('提交表单：', form)
    // 这里写接口请求逻辑

    ElMessage.success(`${modalType === 'add' ? '新增' : '修改'}成功`)
    visible.value = false
  })
}
</script>

<style scoped>
.modal-form {
  margin-top: 10px;
}
.el-col {
  margin-bottom: 10px;
}
</style>