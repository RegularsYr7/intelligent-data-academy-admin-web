<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="专业代码" prop="majorCode">
            <el-input v-model="queryParams.majorCode" placeholder="请输入专业代码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专业名称" prop="majorName">
            <el-input v-model="queryParams.majorName" placeholder="请输入专业名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专业大类" prop="majorCategory">
            <el-input v-model="queryParams.majorCategory" placeholder="请输入专业大类" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专业类型" prop="majorType">
            <el-select v-model="queryParams.majorType" placeholder="请选择专业类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_major_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="就业率" prop="employmentRate">
            <el-input v-model="queryParams.employmentRate" placeholder="请输入就业率" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in edu_major_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="删除标志" prop="delFlag">
            <el-input v-model="queryParams.delFlag" placeholder="请输入删除标志" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" style="text-align: right;">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:major:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:major:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:major:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:major:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="majorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="专业代码" align="center" prop="majorCode" />
      <el-table-column label="专业名称" align="center" prop="majorName" />
      <el-table-column label="专业类型" align="center" prop="majorType">
        <template #default="scope">
          <dict-tag :options="edu_major_type" :value="scope.row.majorType" />
        </template>
      </el-table-column>
      <el-table-column label="学位类型" align="center" prop="degreeType">
        <template #default="scope">
          <dict-tag :options="edu_degree_type" :value="scope.row.degreeType" />
        </template>
      </el-table-column>
      <el-table-column label="专业负责人" align="center" prop="majorDirector" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="edu_major_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:major:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:major:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改专业信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="majorRef" :model="form" :rules="rules" label-width="120px">
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
              <el-select v-model="form.collegeId" placeholder="请选择所属学院" clearable filterable style="width: 100%;">
                <el-option v-for="college in collegeList" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="专业代码" prop="majorCode">
              <el-input v-model="form.majorCode" placeholder="请输入专业代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业名称" prop="majorName">
              <el-input v-model="form.majorName" placeholder="请输入专业名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="专业英文名称" prop="majorNameEn">
              <el-input v-model="form.majorNameEn" placeholder="请输入专业英文名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业大类" prop="majorCategory">
              <el-input v-model="form.majorCategory" placeholder="请输入专业大类" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="专业类型" prop="majorType">
              <el-select v-model="form.majorType" placeholder="请选择专业类型" style="width: 100%;">
                <el-option v-for="dict in edu_major_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学位类型" prop="degreeType">
              <el-select v-model="form.degreeType" placeholder="请选择学位类型" style="width: 100%;">
                <el-option v-for="dict in edu_degree_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="学制年限" prop="educationYears">
              <el-input v-model="form.educationYears" placeholder="请输入学制年限" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授予学位" prop="degreeName">
              <el-input v-model="form.degreeName" placeholder="请输入授予学位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="专业负责人" prop="majorDirector">
              <el-input v-model="form.majorDirector" placeholder="请输入专业负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人电话" prop="directorPhone">
              <el-input v-model="form.directorPhone" placeholder="请输入负责人电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="负责人邮箱" prop="directorEmail">
              <el-input v-model="form.directorEmail" placeholder="请输入负责人邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业设立日期" prop="establishedDate">
              <el-date-picker clearable v-model="form.establishedDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择专业设立日期" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="年度招生计划" prop="enrollmentPlan">
              <el-input v-model="form.enrollmentPlan" placeholder="请输入年度招生计划" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前在读学生数" prop="currentStudents">
              <el-input v-model="form.currentStudents" placeholder="请输入当前在读学生数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="累计毕业生数" prop="graduateCount">
              <el-input v-model="form.graduateCount" placeholder="请输入累计毕业生数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就业率" prop="employmentRate">
              <el-input v-model="form.employmentRate" placeholder="请输入就业率" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="学费" prop="tuitionFee">
              <el-input v-model="form.tuitionFee" placeholder="请输入学费" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程数量" prop="courseCount">
              <el-input v-model="form.courseCount" placeholder="请输入课程数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="实验室数量" prop="labCount">
              <el-input v-model="form.labCount" placeholder="请输入实验室数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入显示顺序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="实训基地" prop="trainingBase">
              <el-input v-model="form.trainingBase" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作单位" prop="cooperationUnits">
              <el-input v-model="form.cooperationUnits" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="专业特色" prop="majorFeatures">
              <el-input v-model="form.majorFeatures" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培养目标" prop="cultivationGoal">
              <el-input v-model="form.cultivationGoal" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="主要课程" prop="mainCourses">
              <el-input v-model="form.mainCourses" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就业方向" prop="careerDirection">
              <el-input v-model="form.careerDirection" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="专业简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in edu_major_status" :key="dict.value" :label="dict.value">{{ dict.label
                  }}</el-radio>
              </el-radio-group>
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

<script setup name="Major">
import { listMajor, getMajor, delMajor, addMajor, updateMajor } from "@/api/edu/major"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"

const { proxy } = getCurrentInstance()
const { edu_major_type, edu_degree_type, edu_major_status } = proxy.useDict('edu_major_type', 'edu_degree_type', 'edu_major_status')

const majorList = ref([])
const schoolList = ref([])
const collegeList = ref([])
const allCollegeList = ref([])
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
    majorCode: null,
    majorName: null,
    majorCategory: null,
    majorType: null,
    isKeyMajor: null,
    isFeaturedMajor: null,
    isNationalMajor: null,
    employmentRate: null,
    status: null,
    delFlag: null,
    createTime: null,
  },
  rules: {
    schoolId: [
      { required: true, message: "所属学校ID不能为空", trigger: "change" }
    ],
    collegeId: [
      { required: true, message: "所属学院ID不能为空", trigger: "change" }
    ],
    majorCode: [
      { required: true, message: "专业代码不能为空", trigger: "blur" }
    ],
    majorName: [
      { required: true, message: "专业名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询专业信息列表 */
function getList() {
  loading.value = true
  listMajor(queryParams.value).then(response => {
    majorList.value = response.rows
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
    majorId: null,
    schoolId: null,
    collegeId: null,
    majorCode: null,
    majorName: null,
    majorNameEn: null,
    majorCategory: null,
    majorType: null,
    degreeType: null,
    educationYears: null,
    degreeName: null,
    isKeyMajor: null,
    isFeaturedMajor: null,
    isNationalMajor: null,
    majorDirector: null,
    directorPhone: null,
    directorEmail: null,
    establishedDate: null,
    enrollmentPlan: null,
    currentStudents: null,
    graduateCount: null,
    employmentRate: null,
    tuitionFee: null,
    courseCount: null,
    labCount: null,
    trainingBase: null,
    cooperationUnits: null,
    majorFeatures: null,
    cultivationGoal: null,
    mainCourses: null,
    careerDirection: null,
    introduction: null,
    sortOrder: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("majorRef")
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
  ids.value = selection.map(item => item.majorId)
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

/** 学校改变时筛选学院 */
function handleSchoolChange(schoolId) {
  form.value.collegeId = null
  if (schoolId) {
    collegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
  } else {
    collegeList.value = allCollegeList.value
  }
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getSchoolList()
  getCollegeList()
  open.value = true
  title.value = "添加专业信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getSchoolList()
  getCollegeList()
  const _majorId = row.majorId || ids.value
  getMajor(_majorId).then(response => {
    form.value = response.data
    // 根据已选择的学校ID筛选学院列表
    if (form.value.schoolId) {
      collegeList.value = allCollegeList.value.filter(college => college.schoolId === form.value.schoolId)
    }
    open.value = true
    title.value = "修改专业信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["majorRef"].validate(valid => {
    if (valid) {
      if (form.value.majorId != null) {
        updateMajor(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMajor(form.value).then(response => {
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
  const _majorIds = row.majorId || ids.value
  proxy.$modal.confirm('是否确认删除专业信息编号为"' + _majorIds + '"的数据项？').then(function () {
    return delMajor(_majorIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/major/export', {
    ...queryParams.value
  }, `major_${new Date().getTime()}.xlsx`)
}

getList()
</script>
