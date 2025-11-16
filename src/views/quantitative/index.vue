<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学生ID" prop="studentId">
            <el-input v-model="queryParams.studentId" placeholder="请输入学生ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学生姓名" prop="studentName">
            <el-input v-model="queryParams.studentName" placeholder="请输入学生姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学号" prop="studentNo">
            <el-input v-model="queryParams.studentNo" placeholder="请输入学号" clearable @keyup.enter="handleQuery" />
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
          <el-form-item label="记录类型" prop="recordType">
            <el-select v-model="queryParams.recordType" placeholder="请选择记录类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_quantitative_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="来源ID" prop="sourceId">
            <el-input v-model="queryParams.sourceId" placeholder="请输入来源ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="来源名称" prop="sourceName">
            <el-input v-model="queryParams.sourceName" placeholder="请输入来源名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="记录时间">
            <el-date-picker v-model="daterangeRecordTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="年月" prop="recordYearMonth">
            <el-input v-model="queryParams.recordYearMonth" placeholder="请输入年月" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['edu:quantitative:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:quantitative:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:quantitative:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:quantitative:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="quantitativeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="学生姓名" align="center" prop="studentName" min-width="120" show-overflow-tooltip />
      <el-table-column label="学号" align="center" prop="studentNo" width="110" show-overflow-tooltip />
      <el-table-column label="记录类型" align="center" prop="recordType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_quantitative_type" :value="scope.row.recordType" />
        </template>
      </el-table-column>
      <el-table-column label="来源名称" align="center" prop="sourceName" min-width="150" show-overflow-tooltip />
      <el-table-column label="分数变化" align="center" prop="score" width="150">
        <template #default="scope">
          <span>{{ scope.row.score > 0 ? '+' : '' }}{{ scope.row.score }} ({{ scope.row.scoreBefore }} → {{
            scope.row.scoreAfter }})</span>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" align="center" prop="recordTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:quantitative:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:quantitative:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改量化分记录对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="quantitativeRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学生ID" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学生ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="studentNo">
              <el-input v-model="form.studentNo" placeholder="请输入学号" />
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
            <el-form-item label="记录类型" prop="recordType">
              <el-select v-model="form.recordType" placeholder="请选择记录类型" style="width: 100%">
                <el-option v-for="dict in edu_quantitative_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源ID" prop="sourceId">
              <el-input v-model="form.sourceId" placeholder="请输入来源ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="来源名称" prop="sourceName">
              <el-input v-model="form.sourceName" placeholder="请输入来源名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数" prop="score">
              <el-input v-model="form.score" placeholder="请输入分数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="记录时间" prop="recordTime">
              <el-date-picker clearable v-model="form.recordTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择记录时间" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="来源照片URL" prop="sourceImageUrl">
              <el-input v-model="form.sourceImageUrl" type="textarea" placeholder="请输入内容" />
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

<script setup name="Quantitative">
import { listQuantitative, getQuantitative, delQuantitative, addQuantitative, updateQuantitative } from "@/api/edu/quantitative"

const { proxy } = getCurrentInstance()
const { edu_quantitative_type } = proxy.useDict('edu_quantitative_type')

const quantitativeList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeRecordTime = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    studentId: null,
    studentName: null,
    studentNo: null,
    classId: null,
    recordType: null,
    sourceId: null,
    sourceName: null,
    recordTime: null,
    recordYearMonth: null,
    createTime: null,
  },
  rules: {
    studentId: [
      { required: true, message: "学生ID不能为空", trigger: "blur" }
    ],
    studentName: [
      { required: true, message: "学生姓名不能为空", trigger: "blur" }
    ],
    studentNo: [
      { required: true, message: "学号不能为空", trigger: "blur" }
    ],
    recordType: [
      { required: true, message: "记录类型不能为空", trigger: "change" }
    ],
    sourceName: [
      { required: true, message: "来源名称不能为空", trigger: "blur" }
    ],
    score: [
      { required: true, message: "分数不能为空", trigger: "blur" }
    ],
    recordTime: [
      { required: true, message: "记录时间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询量化分记录列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeRecordTime && '' != daterangeRecordTime) {
    queryParams.value.params["beginRecordTime"] = daterangeRecordTime.value[0]
    queryParams.value.params["endRecordTime"] = daterangeRecordTime.value[1]
  }
  listQuantitative(queryParams.value).then(response => {
    quantitativeList.value = response.rows
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
    recordId: null,
    studentId: null,
    studentName: null,
    studentNo: null,
    classId: null,
    recordType: null,
    sourceId: null,
    sourceName: null,
    sourceImageUrl: null,
    score: null,
    scoreBefore: null,
    scoreAfter: null,
    recordTime: null,
    recordYearMonth: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("quantitativeRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeRecordTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.recordId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加量化分记录"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _recordId = row.recordId || ids.value
  getQuantitative(_recordId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改量化分记录"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["quantitativeRef"].validate(valid => {
    if (valid) {
      if (form.value.recordId != null) {
        updateQuantitative(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addQuantitative(form.value).then(response => {
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
  const _recordIds = row.recordId || ids.value
  proxy.$modal.confirm('是否确认删除量化分记录编号为"' + _recordIds + '"的数据项？').then(function () {
    return delQuantitative(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/quantitative/export', {
    ...queryParams.value
  }, `quantitative_${new Date().getTime()}.xlsx`)
}

getList()
</script>
