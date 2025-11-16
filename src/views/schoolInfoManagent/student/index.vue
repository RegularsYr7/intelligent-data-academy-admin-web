<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学号" prop="studentNo">
            <el-input v-model="queryParams.studentNo" placeholder="请输入学号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名" prop="studentName">
            <el-input v-model="queryParams.studentName" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号" prop="phoneCode">
            <el-input v-model="queryParams.phoneCode" placeholder="请输入手机号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="入学时间">
            <el-date-picker v-model="daterangeEnrollmentDate" value-format="YYYY-MM-DD" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="民族" prop="nation">
            <el-select v-model="queryParams.nation" placeholder="请选择民族" clearable style="width: 100%;">
              <el-option v-for="dict in edu_nation" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="政治面貌" prop="politicalStatus">
            <el-select v-model="queryParams.politicalStatus" placeholder="请选择政治面貌" clearable style="width: 100%;">
              <el-option v-for="dict in edu_political_status" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="血型" prop="bloodType">
            <el-select v-model="queryParams.bloodType" placeholder="请选择血型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_blood_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="学校ID" prop="schoolId">
            <el-input v-model="queryParams.schoolId" placeholder="请输入学校ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学院ID" prop="collegeId">
            <el-input v-model="queryParams.collegeId" placeholder="请输入学院ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专业ID" prop="majorId">
            <el-input v-model="queryParams.majorId" placeholder="请输入专业ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班级ID" prop="classId">
            <el-input v-model="queryParams.classId" placeholder="请输入班级ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="年级" prop="grade">
            <el-input v-model="queryParams.grade" placeholder="请输入年级" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="培养层次" prop="educationLevel">
            <el-select v-model="queryParams.educationLevel" placeholder="请选择培养层次" clearable style="width: 100%;">
              <el-option v-for="dict in edu_education_level" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:student:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:student:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:student:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:student:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="学号" align="center" prop="studentNo" min-width="120" show-overflow-tooltip />
      <el-table-column label="姓名" align="center" prop="studentName" min-width="100" show-overflow-tooltip />
      <el-table-column label="手机号" align="center" prop="phoneCode" min-width="120" show-overflow-tooltip />
      <el-table-column label="班级ID" align="center" prop="classId" min-width="100" show-overflow-tooltip />
      <el-table-column label="年级" align="center" prop="grade" width="80" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:student:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:student:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改学生信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="studentRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="studentNo">
              <el-input v-model="form.studentNo" placeholder="请输入学号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phoneCode">
              <el-input v-model="form.phoneCode" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker clearable v-model="form.birthday" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择生日" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-select v-model="form.nation" placeholder="请选择民族" style="width: 100%;">
                <el-option v-for="dict in edu_nation" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌" prop="politicalStatus">
              <el-select v-model="form.politicalStatus" placeholder="请选择政治面貌" style="width: 100%;">
                <el-option v-for="dict in edu_political_status" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="家乡" prop="hometown">
              <el-input v-model="form.hometown" placeholder="请输入家乡" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血型" prop="bloodType">
              <el-select v-model="form.bloodType" placeholder="请选择血型" style="width: 100%;">
                <el-option v-for="dict in edu_blood_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入学时间" prop="enrollmentDate">
              <el-date-picker clearable v-model="form.enrollmentDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择入学时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业时间" prop="graduationDate">
              <el-date-picker clearable v-model="form.graduationDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择毕业时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学校ID" prop="schoolId">
              <el-input v-model="form.schoolId" placeholder="请输入学校ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院ID" prop="collegeId">
              <el-input v-model="form.collegeId" placeholder="请输入学院ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="专业ID" prop="majorId">
              <el-input v-model="form.majorId" placeholder="请输入专业ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级ID" prop="classId">
              <el-input v-model="form.classId" placeholder="请输入班级ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="form.grade" placeholder="请输入年级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培养层次" prop="educationLevel">
              <el-select v-model="form.educationLevel" placeholder="请选择培养层次" style="width: 100%;">
                <el-option v-for="dict in edu_education_level" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学制" prop="schoolingLength">
              <el-input v-model="form.schoolingLength" placeholder="请输入学制" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="头像URL" prop="avatarUrl">
              <image-upload v-model="form.avatarUrl" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Student">
import { listStudent, getStudent, delStudent, addStudent, updateStudent } from "@/api/edu/student"

const { proxy } = getCurrentInstance()
const { edu_blood_type, edu_political_status, edu_nation, sys_normal_disable, edu_education_level } = proxy.useDict('edu_blood_type', 'edu_political_status', 'edu_nation', 'sys_normal_disable', 'edu_education_level')

const studentList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeEnrollmentDate = ref([])
const daterangeGraduationDate = ref([])
const daterangeBirthday = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    studentNo: null,
    studentName: null,
    idCard: null,
    phoneCode: null,
    enrollmentDate: null,
    nation: null,
    politicalStatus: null,
    bloodType: null,
    schoolId: null,
    collegeId: null,
    majorId: null,
    classId: null,
    grade: null,
    educationLevel: null,
    status: null,
    createTime: null,
  },
  rules: {
    studentNo: [
      { required: true, message: "学号不能为空", trigger: "blur" }
    ],
    studentName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "密码不能为空", trigger: "blur" }
    ],
    enrollmentDate: [
      { required: true, message: "入学时间不能为空", trigger: "blur" }
    ],
    schoolId: [
      { required: true, message: "学校ID不能为空", trigger: "blur" }
    ],
    collegeId: [
      { required: true, message: "学院ID不能为空", trigger: "blur" }
    ],
    majorId: [
      { required: true, message: "专业ID不能为空", trigger: "blur" }
    ],
    classId: [
      { required: true, message: "班级ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询学生信息列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeEnrollmentDate && '' != daterangeEnrollmentDate) {
    queryParams.value.params["beginEnrollmentDate"] = daterangeEnrollmentDate.value[0]
    queryParams.value.params["endEnrollmentDate"] = daterangeEnrollmentDate.value[1]
  }
  if (null != daterangeGraduationDate && '' != daterangeGraduationDate) {
    queryParams.value.params["beginGraduationDate"] = daterangeGraduationDate.value[0]
    queryParams.value.params["endGraduationDate"] = daterangeGraduationDate.value[1]
  }
  if (null != daterangeBirthday && '' != daterangeBirthday) {
    queryParams.value.params["beginBirthday"] = daterangeBirthday.value[0]
    queryParams.value.params["endBirthday"] = daterangeBirthday.value[1]
  }
  listStudent(queryParams.value).then(response => {
    studentList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    studentId: null,
    studentNo: null,
    studentName: null,
    idCard: null,
    password: null,
    phoneCode: null,
    avatarUrl: null,
    enrollmentDate: null,
    graduationDate: null,
    birthday: null,
    nation: null,
    politicalStatus: null,
    hometown: null,
    bloodType: null,
    schoolId: null,
    collegeId: null,
    majorId: null,
    classId: null,
    grade: null,
    educationLevel: null,
    schoolingLength: null,
    totalCredits: null,
    totalPoints: null,
    quantitativeScore: null,
    activityCount: null,
    organizationCount: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("studentRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeEnrollmentDate.value = []
  daterangeGraduationDate.value = []
  daterangeBirthday.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.studentId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加学生信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _studentId = row.studentId || ids.value
  getStudent(_studentId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改学生信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["studentRef"].validate(valid => {
    if (valid) {
      if (form.value.studentId != null) {
        updateStudent(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addStudent(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _studentIds = row.studentId || ids.value
  proxy.$modal.confirm('是否确认删除学生信息编号为"' + _studentIds + '"的数据项？').then(function () {
    return delStudent(_studentIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/student/export', {
    ...queryParams.value
  }, `student_${new Date().getTime()}.xlsx`)
}

getList()
</script>
