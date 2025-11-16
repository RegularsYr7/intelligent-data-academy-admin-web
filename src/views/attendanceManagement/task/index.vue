<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务类型" prop="taskType">
            <el-select v-model="queryParams.taskType" placeholder="请选择任务类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_checkin_task_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签到开始时间">
            <el-date-picker v-model="daterangeStartTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签到结束时间">
            <el-date-picker v-model="daterangeEndTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="是否需要自拍" prop="requirePhoto">
            <el-select v-model="queryParams.requirePhoto" placeholder="请选择是否需要自拍" clearable style="width: 100%;">
              <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否需要定位" prop="requireLocation">
            <el-select v-model="queryParams.requireLocation" placeholder="请选择是否需要定位" clearable style="width: 100%;">
              <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目标位置经度" prop="targetLongitude">
            <el-input v-model="queryParams.targetLongitude" placeholder="请输入目标位置经度" clearable
              @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目标位置纬度" prop="targetLatitude">
            <el-input v-model="queryParams.targetLatitude" placeholder="请输入目标位置纬度" clearable
              @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="创建者姓名" prop="creatorName">
            <el-input v-model="queryParams.creatorName" placeholder="请输入创建者姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in edu_checkin_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:task:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:task:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:task:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:task:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="任务名称" align="center" prop="taskName" min-width="150" show-overflow-tooltip />
      <el-table-column label="任务类型" align="center" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.taskType">{{ getDictLabel(edu_checkin_task_type, scope.row.taskType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="签到时间" align="center" prop="startTime" width="110" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签到情况" align="center" prop="checkinCount" width="100">
        <template #default="scope">
          <span>{{ scope.row.checkinCount }} / {{ scope.row.totalStudents }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status">{{ getDictLabel(edu_checkin_status, scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="creatorName" min-width="100" show-overflow-tooltip />
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签到记录" align="center" width="100">
        <template #default="scope">
          <el-button link type="primary" @click="handleViewRecords(scope.row)">查看记录</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:task:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:task:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改签到任务对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="taskRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="form.taskName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="form.taskType" placeholder="请选择任务类型" style="width: 100%;">
                <el-option v-for="dict in edu_checkin_task_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="签到开始时间" prop="startTime">
              <el-date-picker clearable v-model="form.startTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择签到开始时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签到结束时间" prop="endTime">
              <el-date-picker clearable v-model="form.endTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择签到结束时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否允许迟到" prop="allowLate">
              <el-radio-group v-model="form.allowLate">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="允许迟到的分钟数" prop="lateMinutes">
              <el-input v-model="form.lateMinutes" placeholder="请输入允许迟到的分钟数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否需要自拍" prop="requirePhoto">
              <el-radio-group v-model="form.requirePhoto">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要定位" prop="requireLocation">
              <el-radio-group v-model="form.requireLocation">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="签到范围" prop="locationRange">
              <el-input v-model="form.locationRange" placeholder="请输入签到范围" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应签到人数" prop="totalStudents">
              <el-input v-model="form.totalStudents" placeholder="请输入应签到人数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="目标位置经度" prop="targetLongitude">
              <el-input v-model="form.targetLongitude" placeholder="请输入目标位置经度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标位置纬度" prop="targetLatitude">
              <el-input v-model="form.targetLatitude" placeholder="请输入目标位置纬度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in edu_checkin_status" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="班级ID列表" prop="classIds">
              <el-input v-model="form.classIds" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="目标地点名称" prop="targetAddress">
              <el-input v-model="form.targetAddress" type="textarea" placeholder="请输入内容" />
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

    <!-- 签到记录对话框 -->
    <el-dialog title="签到记录" v-model="recordDialogVisible" width="1400px" append-to-body>
      <el-table v-loading="recordLoading" :data="recordList" max-height="500">
        <el-table-column label="学生姓名" align="center" prop="studentName" min-width="100" show-overflow-tooltip />
        <el-table-column label="学号" align="center" prop="studentNo" min-width="120" show-overflow-tooltip />
        <el-table-column label="班级名称" align="center" prop="className" min-width="120" show-overflow-tooltip />
        <el-table-column label="签到状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.checkinStatus">{{ getDictLabel(edu_checkin_status, scope.row.checkinStatus)
              }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="签到时间" align="center" prop="checkinTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.checkinTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签到地点" align="center" prop="address" min-width="150" show-overflow-tooltip />
        <el-table-column label="经度" align="center" prop="longitude" width="100" show-overflow-tooltip />
        <el-table-column label="纬度" align="center" prop="latitude" width="100" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Delete" @click="handleDeleteRecord(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="recordTotal > 0" :total="recordTotal" v-model:page="recordQueryParams.pageNum"
        v-model:limit="recordQueryParams.pageSize" @pagination="getRecordList" />
    </el-dialog>
  </div>
</template>

<script setup name="Task">
import { listTask, getTask, delTask, addTask, updateTask } from "@/api/edu/task"
import { listRecord, delRecord } from "@/api/edu/record"

const { proxy } = getCurrentInstance()
const { edu_checkin_status, sys_yes_no, edu_checkin_task_type } = proxy.useDict('edu_checkin_status', 'sys_yes_no', 'edu_checkin_task_type')

const taskList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeStartTime = ref([])
const daterangeEndTime = ref([])

// 签到记录相关
const recordDialogVisible = ref(false)
const recordList = ref([])
const recordLoading = ref(false)
const recordTotal = ref(0)
const currentTaskId = ref(null)
const recordQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  taskId: null
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskName: null,
    taskType: null,
    startTime: null,
    endTime: null,
    requirePhoto: null,
    requireLocation: null,
    targetLongitude: null,
    targetLatitude: null,
    targetAddress: null,
    creatorName: null,
    status: null,
    createTime: null,
  },
  rules: {
    taskName: [
      { required: true, message: "任务名称不能为空", trigger: "blur" }
    ],
    taskType: [
      { required: true, message: "任务类型不能为空", trigger: "change" }
    ],
    classIds: [
      { required: true, message: "班级ID列表不能为空", trigger: "blur" }
    ],
    startTime: [
      { required: true, message: "签到开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "签到结束时间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 获取字典标签 */
function getDictLabel(dicts, value) {
  const dict = dicts.find(d => d.value == value)
  return dict ? dict.label : value
}

/** 查询签到任务列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeStartTime && '' != daterangeStartTime) {
    queryParams.value.params["beginStartTime"] = daterangeStartTime.value[0]
    queryParams.value.params["endStartTime"] = daterangeStartTime.value[1]
  }
  if (null != daterangeEndTime && '' != daterangeEndTime) {
    queryParams.value.params["beginEndTime"] = daterangeEndTime.value[0]
    queryParams.value.params["endEndTime"] = daterangeEndTime.value[1]
  }
  listTask(queryParams.value).then(response => {
    taskList.value = response.rows
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
    taskId: null,
    taskName: null,
    taskType: null,
    classIds: null,
    startTime: null,
    endTime: null,
    allowLate: null,
    lateMinutes: null,
    requirePhoto: null,
    requireLocation: null,
    locationRange: null,
    targetLongitude: null,
    targetLatitude: null,
    targetAddress: null,
    totalStudents: null,
    checkinCount: null,
    lateCount: null,
    absentCount: null,
    creatorId: null,
    creatorName: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("taskRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeStartTime.value = []
  daterangeEndTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.taskId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加签到任务"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _taskId = row.taskId || ids.value
  getTask(_taskId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改签到任务"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskRef"].validate(valid => {
    if (valid) {
      if (form.value.taskId != null) {
        updateTask(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTask(form.value).then(response => {
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
  const _taskIds = row.taskId || ids.value
  proxy.$modal.confirm('是否确认删除签到任务编号为"' + _taskIds + '"的数据项？').then(function () {
    return delTask(_taskIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/task/export', {
    ...queryParams.value
  }, `task_${new Date().getTime()}.xlsx`)
}

/** 查看签到记录 */
function handleViewRecords(row) {
  currentTaskId.value = row.taskId
  recordQueryParams.value.taskId = row.taskId
  recordQueryParams.value.pageNum = 1
  recordDialogVisible.value = true
  getRecordList()
}

/** 查询签到记录列表 */
function getRecordList() {
  recordLoading.value = true
  listRecord(recordQueryParams.value).then(response => {
    recordList.value = response.rows
    recordTotal.value = response.total
    recordLoading.value = false
  })
}

/** 删除签到记录 */
function handleDeleteRecord(row) {
  proxy.$modal.confirm('是否确认删除该签到记录?').then(function () {
    return delRecord(row.recordId)
  }).then(() => {
    getRecordList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

getList()
</script>
