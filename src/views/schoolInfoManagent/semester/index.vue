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
          <el-form-item label="班级名称" prop="className">
            <el-input v-model="queryParams.className" placeholder="请输入班级名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学期开始日期">
            <el-date-picker v-model="daterangeStartDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学期结束日期">
            <el-date-picker v-model="daterangeEndDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="学年" prop="academicYear">
            <el-input v-model="queryParams.academicYear" placeholder="请输入学年" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学期类型" prop="semesterType">
            <el-select v-model="queryParams.semesterType" placeholder="请选择学期类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_semester_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否当前学期" prop="isCurrent">
            <el-input v-model="queryParams.isCurrent" placeholder="请输入是否当前学期" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="18">
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
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="学期名称" align="center" prop="semesterName" min-width="120" show-overflow-tooltip />
      <el-table-column label="班级名称" align="center" prop="className" min-width="120" show-overflow-tooltip />
      <el-table-column label="学期时间" align="center" prop="startDate" width="200" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }} ~ {{ parseTime(scope.row.endDate, '{y}-{m}-{d}')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周数" align="center" prop="currentWeek" width="100">
        <template #default="scope">
          <span>{{ scope.row.currentWeek }} / {{ scope.row.totalWeeks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学期类型" align="center" prop="semesterType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_semester_type" :value="scope.row.semesterType" />
        </template>
      </el-table-column>
      <el-table-column label="是否当前" align="center" prop="isCurrent" width="90">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.isCurrent" />
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
            v-hasPermi="['edu:semester:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:semester:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改学期管理对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="semesterRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学期名称" prop="semesterName">
              <el-input v-model="form.semesterName" placeholder="请输入学期名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属班级" prop="classId">
              <el-select v-model="form.classId" placeholder="请选择班级" @change="handleClassChange" filterable
                style="width: 100%;">
                <el-option v-for="item in classList" :key="item.classId" :label="item.className"
                  :value="item.classId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学期开始日期" prop="startDate">
              <el-date-picker clearable v-model="form.startDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择学期开始日期" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学期结束日期" prop="endDate">
              <el-date-picker clearable v-model="form.endDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择学期结束日期" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="总周数" prop="totalWeeks">
              <el-input v-model="form.totalWeeks" placeholder="请输入总周数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前周数" prop="currentWeek">
              <el-input v-model="form.currentWeek" placeholder="请输入当前周数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="周数偏移量" prop="weekOffset">
              <el-input v-model="form.weekOffset" placeholder="请输入周数偏移量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学年" prop="academicYear">
              <el-input v-model="form.academicYear" placeholder="请输入学年" />
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
            <el-form-item label="是否当前学期" prop="isCurrent">
              <el-radio-group v-model="form.isCurrent">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
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
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="节假日日期列表" prop="holidayDates">
              <el-input v-model="form.holidayDates" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="调整说明" prop="adjustInfo">
              <el-input v-model="form.adjustInfo" type="textarea" placeholder="请输入内容" />
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

<script setup name="Semester">
import { listSemester, getSemester, delSemester, addSemester, updateSemester } from "@/api/edu/semester"
import { listClass } from "@/api/edu/class"

const { proxy } = getCurrentInstance()
const { edu_semester_type, sys_normal_disable } = proxy.useDict('edu_semester_type', 'sys_normal_disable')

const semesterList = ref([])
const classList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeStartDate = ref([])
const daterangeEndDate = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    semesterName: null,
    classId: null,
    className: null,
    startDate: null,
    endDate: null,
    academicYear: null,
    semesterType: null,
    isCurrent: null,
    status: null,
    createTime: null,
  },
  rules: {
    semesterName: [
      { required: true, message: "学期名称不能为空", trigger: "blur" }
    ],
    classId: [
      { required: true, message: "班级ID不能为空", trigger: "change" }
    ],
    startDate: [
      { required: true, message: "学期开始日期不能为空", trigger: "blur" }
    ],
    endDate: [
      { required: true, message: "学期结束日期不能为空", trigger: "blur" }
    ],
    totalWeeks: [
      { required: true, message: "总周数不能为空", trigger: "blur" }
    ],
    academicYear: [
      { required: true, message: "学年不能为空", trigger: "blur" }
    ],
    semesterType: [
      { required: true, message: "学期类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询学期管理列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeStartDate && '' != daterangeStartDate) {
    queryParams.value.params["beginStartDate"] = daterangeStartDate.value[0]
    queryParams.value.params["endStartDate"] = daterangeStartDate.value[1]
  }
  if (null != daterangeEndDate && '' != daterangeEndDate) {
    queryParams.value.params["beginEndDate"] = daterangeEndDate.value[0]
    queryParams.value.params["endEndDate"] = daterangeEndDate.value[1]
  }
  listSemester(queryParams.value).then(response => {
    semesterList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 查询班级列表 */
function getClassList() {
  listClass().then(response => {
    classList.value = response.rows
  })
}

/** 班级选择改变时 */
function handleClassChange(classId) {
  const selectedClass = classList.value.find(c => c.classId === classId)
  if (selectedClass) {
    form.value.className = selectedClass.className
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
    semesterId: null,
    semesterName: null,
    classId: null,
    className: null,
    startDate: null,
    endDate: null,
    totalWeeks: 20,
    currentWeek: null,
    weekOffset: 0,
    academicYear: null,
    semesterType: null,
    isCurrent: 'N',
    holidayDates: null,
    adjustInfo: null,
    status: '0',
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
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
  daterangeStartDate.value = []
  daterangeEndDate.value = []
  proxy.resetForm("queryRef")
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
    open.value = true
    title.value = "修改学期管理"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["semesterRef"].validate(valid => {
    if (valid) {
      if (form.value.semesterId != null) {
        updateSemester(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSemester(form.value).then(response => {
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
</script>
