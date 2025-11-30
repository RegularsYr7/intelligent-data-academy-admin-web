<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择所属学校" clearable filterable
              @change="handleQuerySchoolChange" style="width: 100%;">
              <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                :value="school.schoolId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属学院" prop="collegeId">
            <el-select v-model="queryParams.collegeId" placeholder="请先选择学校" clearable filterable
              :disabled="!queryParams.schoolId" style="width: 100%;">
              <el-option v-for="college in queryCollegeList" :key="college.collegeId" :label="college.collegeName"
                :value="college.collegeId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属年级" prop="grade">
            <el-input v-model="queryParams.grade" placeholder="请输入年级，如2021级" clearable @keyup.enter="handleQuery" />
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
      <el-table-column label="ID" align="center" prop="classId" width="80" />
      <el-table-column label="所属学校" align="center" prop="schoolName" min-width="120" show-overflow-tooltip />
      <el-table-column label="所属学院" align="center" prop="collegeName" min-width="120" show-overflow-tooltip />
      <el-table-column label="所属专业" align="center" prop="majorName" min-width="150" show-overflow-tooltip />
      <el-table-column label="班级名称" align="center" prop="className" min-width="120" />
      <el-table-column label="入学年份" align="center" prop="enrollmentYear" width="100" />
      <el-table-column label="辅导员姓名" align="center" width="120">
        <template #default="scope">
          <span v-if="scope.row.counselors && scope.row.counselors.length > 0">
            {{scope.row.counselors.map(c => c.nickName).join(', ')}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
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
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="classRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" clearable filterable
                @change="handleFormSchoolChange" style="width: 100%;">
                <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                  :value="school.schoolId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="所属学院" prop="collegeId">
              <el-select v-model="form.collegeId" placeholder="请先选择学校" clearable filterable
                @change="handleFormCollegeChange" :disabled="!form.schoolId" style="width: 100%;">
                <el-option v-for="college in formCollegeList" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="所属专业" prop="majorId">
              <el-select v-model="form.majorId" placeholder="请先选择学院" clearable filterable :disabled="!form.collegeId"
                style="width: 100%;">
                <el-option v-for="major in formMajorList" :key="major.majorId" :label="major.majorName"
                  :value="major.majorId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="班级名称" prop="className">
              <el-input v-model="form.className" placeholder="请输入班级名称，如：软件工程1班" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="班级年级" prop="grade">
              <el-input v-model="form.grade" placeholder="请输入班级年级，如：2021级" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="入学年份" prop="grade">
              <el-date-picker v-model="form.grade" type="year" value-format="YYYY" placeholder="请选择入学年份"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="班级简介" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入班级简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
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
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const classList = ref([])
const schoolList = ref([])
const allCollegeList = ref([])
const allMajorList = ref([])

// 查询条件的学院列表(根据学校筛选)
const queryCollegeList = ref([])

// 表单的学院和专业列表(根据学校和学院筛选)
const formCollegeList = ref([])
const formMajorList = ref([])

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
    grade: null,
  },
  rules: {
    schoolId: [
      { required: true, message: "所属学校不能为空", trigger: "change" }
    ],
    collegeId: [
      { required: true, message: "所属学院不能为空", trigger: "change" }
    ],
    majorId: [
      { required: true, message: "所属专业不能为空", trigger: "change" }
    ],
    className: [
      { required: true, message: "班级名称不能为空", trigger: "blur" }
    ],
    grade: [
      { required: true, message: "班级年级不能为空", trigger: "blur" }
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

/** 获取学校列表 */
function getSchoolList() {
  return listSchool({ pageNum: 1, pageSize: 1000 }).then(response => {
    schoolList.value = response.rows || []
    return response
  })
}

/** 获取学院列表 */
function getCollegeList() {
  return listCollege({ pageNum: 1, pageSize: 1000 }).then(response => {
    allCollegeList.value = response.rows || []
    queryCollegeList.value = [] // 查询框学院列表初始为空,需要先选择学校
    formCollegeList.value = response.rows || []
    return response
  })
}

/** 获取专业列表 */
function getAllMajorList() {
  return listMajor({ pageNum: 1, pageSize: 1000 }).then(response => {
    allMajorList.value = response.rows || []
    formMajorList.value = response.rows || []
    return response
  })
}

/** 查询条件学校改变 */
function handleQuerySchoolChange(schoolId) {
  queryParams.value.collegeId = null
  if (schoolId) {
    queryCollegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
  } else {
    queryCollegeList.value = []
  }
}

/** 表单学校改变 */
function handleFormSchoolChange(schoolId, keepValues = false) {
  const savedCollegeId = form.value.collegeId
  const savedMajorId = form.value.majorId

  if (!keepValues) {
    form.value.collegeId = null
    form.value.majorId = null
  }

  if (schoolId) {
    formCollegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)

    // 如果需要保留值,检查是否在筛选后的列表中
    if (keepValues) {
      if (savedCollegeId && !formCollegeList.value.find(college => college.collegeId === savedCollegeId)) {
        form.value.collegeId = null
        form.value.majorId = null
      }
    }
  } else {
    formCollegeList.value = allCollegeList.value
  }

  if (!keepValues) {
    formMajorList.value = []
  }
}

/** 表单学院改变 */
function handleFormCollegeChange(collegeId, keepValues = false) {
  const savedMajorId = form.value.majorId

  if (!keepValues) {
    form.value.majorId = null
  }

  if (collegeId) {
    formMajorList.value = allMajorList.value.filter(major => major.collegeId === collegeId)

    // 如果需要保留值,检查是否在筛选后的列表中
    if (keepValues && savedMajorId && !formMajorList.value.find(major => major.majorId === savedMajorId)) {
      form.value.majorId = null
    }
  } else if (form.value.schoolId) {
    const schoolCollegeIds = formCollegeList.value.map(c => c.collegeId)
    formMajorList.value = allMajorList.value.filter(major => schoolCollegeIds.includes(major.collegeId))
  } else {
    formMajorList.value = allMajorList.value
  }
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
    className: null,
    grade: null,
    enrollmentYear: null,
    classTeacherId: null,
    classTeacherName: null,
    description: null,
    sortOrder: 0,
    status: "0"
  }
  formCollegeList.value = []
  formMajorList.value = []
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

/** 新增按钮操作 */
function handleAdd() {
  reset()
  Promise.all([getSchoolList(), getCollegeList(), getAllMajorList()]).then(() => {
    open.value = true
    title.value = "添加班级信息"
  })
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _classId = row.classId || ids.value

  Promise.all([
    getSchoolList(),
    getCollegeList(),
    getAllMajorList(),
    getClass(_classId)
  ]).then(([, , , classResponse]) => {
    form.value = classResponse.data

    // 等待数据加载完成后,自动筛选表单的学院、专业列表(保留原有值)
    if (form.value.schoolId) {
      handleFormSchoolChange(form.value.schoolId, true)
    }
    if (form.value.collegeId) {
      handleFormCollegeChange(form.value.collegeId, true)
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

// 初始化加载
getList()
getSchoolList()
getCollegeList()
getAllMajorList()
</script>
