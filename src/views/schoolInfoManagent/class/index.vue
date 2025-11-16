<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="班级代码" prop="classCode">
            <el-input v-model="queryParams.classCode" placeholder="请输入班级代码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班级名称" prop="className">
            <el-input v-model="queryParams.className" placeholder="请输入班级名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年级" prop="grade">
            <el-input v-model="queryParams.grade" placeholder="请输入年级" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入学年份" prop="enrollmentYear">
            <el-input v-model="queryParams.enrollmentYear" placeholder="请输入入学年份" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="辅导员姓名" prop="counselorName">
            <el-input v-model="queryParams.counselorName" placeholder="请输入辅导员姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in edu_class_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: right;">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:class:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:class:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:class:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:class:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班级代码" align="center" prop="classCode" />
      <el-table-column label="班级名称" align="center" prop="className" />
      <el-table-column label="班级类型" align="center" prop="classType">
        <template #default="scope">
          <dict-tag :options="edu_class_type" :value="scope.row.classType" />
        </template>
      </el-table-column>
      <el-table-column label="年级" align="center" prop="grade" />
      <el-table-column label="辅导员姓名" align="center" prop="counselorName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="edu_class_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:class:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:class:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改班级信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="classRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" clearable filterable @change="handleSchoolChange"
                style="width: 100%;">
                <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                  :value="school.schoolId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学院" prop="collegeId">
              <el-select v-model="form.collegeId" placeholder="请选择所属学院" clearable filterable
                @change="handleCollegeChange" style="width: 100%;">
                <el-option v-for="college in collegeList" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="所属专业" prop="majorId">
              <el-select v-model="form.majorId" placeholder="请选择所属专业" clearable filterable style="width: 100%;">
                <el-option v-for="major in majorList" :key="major.majorId" :label="major.majorName"
                  :value="major.majorId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级代码" prop="classCode">
              <el-input v-model="form.classCode" placeholder="请输入班级代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="班级名称" prop="className">
              <el-input v-model="form.className" placeholder="请输入班级名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级类型" prop="classType">
              <el-select v-model="form.classType" placeholder="请选择班级类型" style="width: 100%;">
                <el-option v-for="dict in edu_class_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="form.grade" placeholder="请输入年级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入学年份" prop="enrollmentYear">
              <el-input v-model="form.enrollmentYear" placeholder="请输入入学年份" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="毕业年份" prop="graduationYear">
              <el-input v-model="form.graduationYear" placeholder="请输入毕业年份" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅导员姓名" prop="counselorName">
              <el-input v-model="form.counselorName" placeholder="请输入辅导员姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="班长姓名" prop="monitorName">
              <el-input v-model="form.monitorName" placeholder="请输入班长姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生人数" prop="studentCount">
              <el-input v-model="form.studentCount" placeholder="请输入学生人数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="男生人数" prop="maleCount">
              <el-input v-model="form.maleCount" placeholder="请输入男生人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="女生人数" prop="femaleCount">
              <el-input v-model="form.femaleCount" placeholder="请输入女生人数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="QQ群号" prop="qqGroup">
              <el-input v-model="form.qqGroup" placeholder="请输入QQ群号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信群" prop="wechatGroup">
              <el-input v-model="form.wechatGroup" placeholder="请输入微信群" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入显示顺序" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in edu_class_status" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="24">
            <el-form-item label="班级描述" prop="description">
              <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
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

<script setup name="Class">
import { listClass, getClass, delClass, addClass, updateClass } from "@/api/edu/class"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"
import { listMajor } from "@/api/edu/major"

const { proxy } = getCurrentInstance()
const { edu_class_status, edu_class_type } = proxy.useDict('edu_class_status', 'edu_class_type')

const classList = ref([])
const schoolList = ref([])
const collegeList = ref([])
const majorList = ref([])
const allCollegeList = ref([])
const allMajorList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    schoolId: null,
    collegeId: null,
    majorId: null,
    classCode: null,
    className: null,
    grade: null,
    enrollmentYear: null,
    counselorName: null,
    status: null,
    createTime: null,
  },
  rules: {
    schoolId: [
      { required: true, message: "所属学校ID不能为空", trigger: "change" }
    ],
    collegeId: [
      { required: true, message: "所属学院ID不能为空", trigger: "change" }
    ],
    classCode: [
      { required: true, message: "班级代码不能为空", trigger: "blur" }
    ],
    className: [
      { required: true, message: "班级名称不能为空", trigger: "blur" }
    ],
    grade: [
      { required: true, message: "年级不能为空", trigger: "blur" }
    ],
    enrollmentYear: [
      { required: true, message: "入学年份不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询班级信息列表 */
function getList() {
  loading.value = true
  listClass(queryParams.value).then(response => {
    classList.value = response.rows
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
    classId: null,
    schoolId: null,
    collegeId: null,
    majorId: null,
    classCode: null,
    className: null,
    classType: null,
    grade: null,
    enrollmentYear: null,
    graduationYear: null,
    classTeacherId: null,
    classTeacherName: null,
    counselorId: null,
    counselorName: null,
    monitorId: null,
    monitorName: null,
    studentCount: null,
    maleCount: null,
    femaleCount: null,
    classroomLocation: null,
    qqGroup: null,
    wechatGroup: null,
    description: null,
    sortOrder: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("classRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.classId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 获取学校列表 */
function getSchoolList() {
  listSchool().then(response => {
    schoolList.value = response.rows
  })
}

/** 获取学院列表 */
function getCollegeList() {
  listCollege().then(response => {
    allCollegeList.value = response.rows
    collegeList.value = response.rows
  })
}

/** 获取专业列表 */
function getMajorList() {
  listMajor().then(response => {
    allMajorList.value = response.rows
    majorList.value = response.rows
  })
}

/** 学校改变时筛选学院 */
function handleSchoolChange(schoolId) {
  form.value.collegeId = null
  form.value.majorId = null
  if (schoolId) {
    collegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
    majorList.value = []
  } else {
    collegeList.value = allCollegeList.value
    majorList.value = allMajorList.value
  }
}

/** 学院改变时筛选专业 */
function handleCollegeChange(collegeId) {
  form.value.majorId = null
  if (collegeId) {
    majorList.value = allMajorList.value.filter(major => major.collegeId === collegeId)
  } else if (form.value.schoolId) {
    // 如果已选择学校但清空了学院，则显示该学校所有学院的专业
    const schoolCollegeIds = collegeList.value.map(c => c.collegeId)
    majorList.value = allMajorList.value.filter(major => schoolCollegeIds.includes(major.collegeId))
  } else {
    majorList.value = allMajorList.value
  }
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getSchoolList()
  getCollegeList()
  getMajorList()
  open.value = true
  title.value = "添加班级信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getSchoolList()
  getCollegeList()
  getMajorList()
  const _classId = row.classId || ids.value
  getClass(_classId).then(response => {
    form.value = response.data
    // 根据已选择的学校和学院筛选列表
    if (form.value.schoolId) {
      collegeList.value = allCollegeList.value.filter(college => college.schoolId === form.value.schoolId)
    }
    if (form.value.collegeId) {
      majorList.value = allMajorList.value.filter(major => major.collegeId === form.value.collegeId)
    }
    open.value = true
    title.value = "修改班级信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classRef"].validate(valid => {
    if (valid) {
      if (form.value.classId != null) {
        updateClass(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addClass(form.value).then(response => {
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
  const _classIds = row.classId || ids.value
  proxy.$modal.confirm('是否确认删除班级信息编号为"' + _classIds + '"的数据项？').then(function () {
    return delClass(_classIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/class/export', {
    ...queryParams.value
  }, `class_${new Date().getTime()}.xlsx`)
}

getList()
</script>
