<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学期名称" prop="semesterName">
            <el-input v-model="queryParams.semesterName" placeholder="请输入学期名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择学校" clearable filterable
              @change="handleSchoolQueryChange">
              <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName"
                :value="item.schoolId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学院" prop="collegeId">
            <el-select v-model="queryParams.collegeId" :placeholder="queryParams.schoolId ? '请选择学院' : '请先选择学校'"
              :disabled="!queryParams.schoolId" clearable filterable @change="handleQuery">
              <el-option v-for="item in queryFilteredCollegeList" :key="item.collegeId" :label="item.collegeName"
                :value="item.collegeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班级名称" prop="className">
            <el-input v-model="queryParams.className" placeholder="请输入班级名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:semester:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:semester:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:semester:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:semester:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="semesterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="semesterId" width="80" />
      <el-table-column label="学期名称" align="center" prop="semesterName" min-width="120" />
      <el-table-column label="学校" align="center" prop="schoolName" width="150" />
      <el-table-column label="学院" align="center" prop="collegeName" width="180" />
      <el-table-column label="所属班级" align="center" prop="classNameList" min-width="200">
        <template #default="scope">
          <div v-if="scope.row.classNameList">
            <div v-for="(className, index) in scope.row.classNameList.split(', ')" :key="index">
              {{ className }}
            </div>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="当前周次" align="center" prop="currentWeek" width="100">
        <template #default="scope">
          <span v-if="scope.row.currentWeek">第{{ scope.row.currentWeek }}周</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="总周次" align="center" prop="totalWeeks" width="100">
        <template #default="scope">
          <span v-if="scope.row.totalWeeks">第{{ scope.row.totalWeeks }}周</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="学期类型" align="center" prop="semesterType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_semester_type" :value="scope.row.semesterType" />
        </template>
      </el-table-column>
      <el-table-column label="学年" align="center" prop="academicYear" width="110" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:semester:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:semester:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改学期管理对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="semesterRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="学期名称" prop="semesterName">
              <el-input v-model="form.semesterName" placeholder="请输入学期名称，如：2024-2025学年第一学期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择学校" filterable clearable @change="handleSchoolChange"
                style="width: 100%;">
                <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName"
                  :value="item.schoolId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院" prop="collegeId">
              <el-select v-model="form.collegeId" :placeholder="form.schoolId ? '请选择学院' : '请先选择学校'"
                :disabled="!form.schoolId" filterable clearable @change="handleCollegeChange" style="width: 100%;">
                <el-option v-for="item in filteredCollegeList" :key="item.collegeId" :label="item.collegeName"
                  :value="item.collegeId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="所属班级" prop="classIds">
              <el-select v-model="form.classIds" :placeholder="form.collegeId ? '请选择班级（可多选）' : '请先选择学院'"
                :disabled="!form.collegeId" multiple filterable collapse-tags style="width: 100%;">
                <el-option v-for="item in filteredClassList" :key="item.classId" :label="item.className"
                  :value="item.classId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择学期开始日期（第1周第1天）" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学期类型" prop="semesterType">
              <el-select v-model="form.semesterType" placeholder="请选择学期类型" style="width: 100%;">
                <el-option v-for="dict in edu_semester_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学期周次" prop="totalWeeks">
              <el-input-number v-model="form.totalWeeks" :min="1" :max="52" placeholder="请输入学期周次"
                style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学年" prop="academicYear">
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-date-picker v-model="form.startYear" type="year" value-format="YYYY" placeholder="开始年份"
                  style="flex: 1;">
                </el-date-picker>
                <span>-</span>
                <el-date-picker v-model="form.endYear" type="year" value-format="YYYY" placeholder="结束年份"
                  style="flex: 1;">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否当前学期" prop="isCurrent">
              <el-radio-group v-model="form.isCurrent">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
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

<script setup name="Semester">
import { listSemester, getSemester, delSemester, addSemester, updateSemester } from "@/api/edu/semester"
import { listClass } from "@/api/edu/class"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"

const { proxy } = getCurrentInstance()
const { edu_semester_type, sys_normal_disable, sys_yes_no } = proxy.useDict('edu_semester_type', 'sys_normal_disable', 'sys_yes_no')

const semesterList = ref([])
const classList = ref([])
const schoolList = ref([])
const collegeList = ref([])
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
    semesterName: null,
    className: null,
    schoolId: null,
    collegeId: null,
  },
  rules: {
    semesterName: [
      { required: true, message: "学期名称不能为空", trigger: "blur" }
    ],
    classIds: [
      { required: true, message: "所属班级不能为空", trigger: "change" }
    ],
    classId: [
      { required: true, message: "所属班级不能为空", trigger: "change" }
    ],
    startDate: [
      { required: true, message: "开始日期不能为空", trigger: "blur" }
    ],
    totalWeeks: [
      { required: true, message: "学期周次不能为空", trigger: "blur" }
    ],
    semesterType: [
      { required: true, message: "学期类型不能为空", trigger: "change" }
    ],
    startYear: [
      { required: true, message: "开始年份不能为空", trigger: "change" }
    ],
    endYear: [
      { required: true, message: "结束年份不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询表单：根据选择的学校过滤学院列表 */
const queryFilteredCollegeList = computed(() => {
  if (!queryParams.value.schoolId) {
    return [] // 没有选择学校时返回空数组
  }
  return collegeList.value.filter(item => item.schoolId === queryParams.value.schoolId)
})

/** 对话框表单：根据选择的学校过滤学院列表 */
const filteredCollegeList = computed(() => {
  if (!form.value.schoolId) {
    return [] // 没有选择学校时返回空数组
  }
  return collegeList.value.filter(item => item.schoolId === form.value.schoolId)
})

/** 根据选择的学院过滤班级列表 */
const filteredClassList = computed(() => {
  if (!form.value.collegeId) {
    return [] // 没有选择学院时返回空数组
  }
  return classList.value.filter(item => item.collegeId === form.value.collegeId)
})

/** 查询表单：学校选择变化处理 */
function handleSchoolQueryChange(val) {
  // 清空学院选择
  queryParams.value.collegeId = null
  handleQuery()
}

/** 对话框表单：学校选择变化处理 */
function handleSchoolChange(val) {
  // 清空学院和班级选择
  form.value.collegeId = null
  form.value.classIds = []
}

/** 对话框表单：学院选择变化处理 */
function handleCollegeChange(val) {
  // 清空班级选择
  form.value.classIds = []
}

/** 查询学期管理列表 */
function getList() {
  loading.value = true
  listSemester(queryParams.value).then(response => {
    semesterList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 查询班级列表 */
function getClassList() {
  listClass({ pageNum: 1, pageSize: 1000 }).then(response => {
    classList.value = response.rows
  })
}

/** 查询学校列表 */
function getSchoolList() {
  listSchool({ pageNum: 1, pageSize: 100, status: '0' }).then(response => {
    schoolList.value = response.rows
  })
}

/** 查询学院列表 */
function getCollegeList() {
  listCollege({ pageNum: 1, pageSize: 500, status: '0' }).then(response => {
    collegeList.value = response.rows
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
    semesterId: null,
    semesterName: null,
    schoolId: null,
    collegeId: null,
    classIds: [],
    classId: null,
    startDate: null,
    totalWeeks: null,
    startYear: null,
    endYear: null,
    semesterType: null,
    isCurrent: 'N',
    status: '0'
  }
  proxy.resetForm("semesterRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")

  // 手动重置级联相关状态
  queryParams.value.schoolId = null
  queryParams.value.collegeId = null
  queryParams.value.pageNum = 1

  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.semesterId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getClassList()
  open.value = true
  title.value = "添加学期管理"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getClassList()
  const _semesterId = row.semesterId || ids.value
  getSemester(_semesterId).then(response => {
    form.value = response.data

    // 设置学校和学院ID（从行数据中获取）
    if (row.schoolId) {
      form.value.schoolId = row.schoolId
    }
    if (row.collegeId) {
      form.value.collegeId = row.collegeId
    }

    // 解析学年字段为两个年份
    if (form.value.academicYear) {
      const years = form.value.academicYear.split('-')
      if (years.length === 2) {
        form.value.startYear = years[0]
        form.value.endYear = years[1]
      }
    }
    open.value = true
    title.value = "修改学期管理"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["semesterRef"].validate(valid => {
    if (valid) {
      // 拼接学年字段
      if (form.value.startYear && form.value.endYear) {
        form.value.academicYear = `${form.value.startYear}-${form.value.endYear}`
      }

      // 构建提交数据,不包含endDate
      const submitData = {
        semesterId: form.value.semesterId,
        semesterName: form.value.semesterName,
        classId: form.value.classId,
        classIds: form.value.classIds,
        startDate: form.value.startDate,
        totalWeeks: form.value.totalWeeks,
        academicYear: form.value.academicYear,
        semesterType: form.value.semesterType,
        isCurrent: form.value.isCurrent,
        status: form.value.status,
        remark: form.value.remark
      }

      if (form.value.semesterId != null) {
        updateSemester(submitData).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSemester(submitData).then(response => {
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
  const _semesterIds = row.semesterId || ids.value
  proxy.$modal.confirm('是否确认删除学期管理编号为"' + _semesterIds + '"的数据项？').then(function () {
    return delSemester(_semesterIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/semester/export', {
    ...queryParams.value
  }, `semester_${new Date().getTime()}.xlsx`)
}

getList()
getClassList()
getSchoolList()
getCollegeList()
</script>
