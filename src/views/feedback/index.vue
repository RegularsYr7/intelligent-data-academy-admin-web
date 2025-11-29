<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择所属学校" clearable filterable
              @change="handleQuerySchoolChange" style="width: 100%;">
              <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName"
                :value="item.schoolId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属学院" prop="collegeId">
            <el-select v-model="queryParams.collegeId" :placeholder="queryParams.schoolId ? '请选择学院' : '请先选择学校'"
              :disabled="!queryParams.schoolId" clearable filterable style="width: 100%;">
              <el-option v-for="college in queryFilteredCollegeList" :key="college.collegeId"
                :label="college.collegeName" :value="college.collegeId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="反馈类型" prop="feedbackType">
            <el-select v-model="queryParams.feedbackType" placeholder="请选择反馈类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_feedback_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提交人姓名" prop="studentName">
            <el-input v-model="queryParams.studentName" placeholder="请输入提交人姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="处理人姓名" prop="currentHandlerName">
            <el-input v-model="queryParams.currentHandlerName" placeholder="请输入处理人姓名" clearable
              @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="处理人类型" prop="handlerType">
            <el-select v-model="queryParams.handlerType" placeholder="请选择处理人类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_handler_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="反馈状态" prop="feedbackStatus">
            <el-select v-model="queryParams.feedbackStatus" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in edu_feedback_status" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提交时间">
            <el-date-picker v-model="daterangeSubmitTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:feedback:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:feedback:remove']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="feedbackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="标题" align="center" prop="title" min-width="150" show-overflow-tooltip />
      <el-table-column label="反馈类型" align="center" prop="feedbackType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_feedback_type" :value="scope.row.feedbackType" />
        </template>
      </el-table-column>
      <el-table-column label="反馈状态" align="center" prop="feedbackStatus" width="100">
        <template #default="scope">
          <dict-tag :options="edu_feedback_status" :value="scope.row.feedbackStatus" />
        </template>
      </el-table-column>
      <el-table-column label="提交学生" align="center" prop="studentName" min-width="100" show-overflow-tooltip />
      <el-table-column label="处理人" align="center" prop="currentHandlerName" min-width="100" show-overflow-tooltip />
      <el-table-column label="提交时间" align="center" prop="submitTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.submitTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:feedback:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:feedback:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 查看/修改反馈信息对话框 -->
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
      <el-form ref="feedbackRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" clearable filterable disabled
                style="width: 100%;">
                <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName"
                  :value="item.schoolId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在班级" prop="className">
              <el-input v-model="form.className" placeholder="所在班级" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" :readonly="!isEditing" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="反馈类型" prop="feedbackType">
              <el-select v-model="form.feedbackType" placeholder="请选择反馈类型" :disabled="!isEditing" style="width: 100%">
                <el-option v-for="dict in edu_feedback_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contactInfo">
              <el-input v-model="form.contactInfo" placeholder="请输入联系方式" :readonly="!isEditing" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="提交学生" prop="studentName">
              <el-input v-model="form.studentName" placeholder="提交学生" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="studentNo">
              <el-input v-model="form.studentNo" placeholder="学号" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="详细描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入详细描述"
                :readonly="!isEditing" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="反馈图片" prop="imageUrl">
              <image-upload v-model="form.imageUrl" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="form.imageUrls">
          <el-col :span="24">
            <el-form-item label="图片列表">
              <div class="image-list">
                <el-image v-for="(url, index) in imageUrlList" :key="index" :src="url" fit="cover"
                  style="width: 100px; height: 100px; margin-right: 10px; border-radius: 4px;"
                  :preview-src-list="imageUrlList" :initial-index="index" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" v-if="isEditing">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Feedback">
import { listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback } from "@/api/edu/feedback"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"

const { proxy } = getCurrentInstance()
const { edu_feedback_type, edu_feedback_status, edu_handler_type, edu_feedback_priority } = proxy.useDict('edu_feedback_type', 'edu_feedback_status', 'edu_handler_type', 'edu_feedback_priority')

const feedbackList = ref([])
const schoolList = ref([])
const allCollegeList = ref([])
const queryFilteredCollegeList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const isEditing = ref(false)
const daterangeSubmitTime = ref([])
const daterangeFirstReplyTime = ref([])
const daterangeResolveTime = ref([])

// 计算图片列表
const imageUrlList = computed(() => {
  if (!form.value.imageUrls) return []
  return form.value.imageUrls.split(',').filter(url => url.trim())
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    schoolId: null,
    collegeId: null,
    feedbackType: null,
    feedbackStatus: null,
    studentName: null,
    currentHandlerName: null,
    handlerType: null,
    submitTime: null,
  },
  rules: {
    title: [
      { required: true, message: "标题不能为空", trigger: "blur" }
    ],
    feedbackType: [
      { required: true, message: "反馈类型不能为空", trigger: "change" }
    ],
    description: [
      { required: true, message: "详细描述不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 获取学校列表 */
function getSchoolList() {
  listSchool({ pageNum: 1, pageSize: 1000 }).then(response => {
    schoolList.value = response.rows
  })
}

/** 获取学院列表 */
function getCollegeList() {
  listCollege({ pageNum: 1, pageSize: 1000 }).then(response => {
    allCollegeList.value = response.rows
    queryFilteredCollegeList.value = response.rows
  })
}

/** 搜索栏-学校变化时处理 */
function handleQuerySchoolChange(schoolId) {
  queryParams.value.collegeId = null
  if (schoolId) {
    queryFilteredCollegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
  } else {
    queryFilteredCollegeList.value = allCollegeList.value
  }
}

/** 查询反馈建议信息列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeSubmitTime && '' != daterangeSubmitTime) {
    queryParams.value.params["beginSubmitTime"] = daterangeSubmitTime.value[0]
    queryParams.value.params["endSubmitTime"] = daterangeSubmitTime.value[1]
  }
  if (null != daterangeFirstReplyTime && '' != daterangeFirstReplyTime) {
    queryParams.value.params["beginFirstReplyTime"] = daterangeFirstReplyTime.value[0]
    queryParams.value.params["endFirstReplyTime"] = daterangeFirstReplyTime.value[1]
  }
  if (null != daterangeResolveTime && '' != daterangeResolveTime) {
    queryParams.value.params["beginResolveTime"] = daterangeResolveTime.value[0]
    queryParams.value.params["endResolveTime"] = daterangeResolveTime.value[1]
  }
  listFeedback(queryParams.value).then(response => {
    feedbackList.value = response.rows
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
    feedbackId: null,
    title: null,
    feedbackType: null,
    description: null,
    imageUrl: null,
    imageUrls: null,
    contactInfo: null,
    feedbackStatus: null,
    studentId: null,
    studentName: null,
    studentNo: null,
    classId: null,
    className: null,
    currentHandlerId: null,
    currentHandlerName: null,
    handlerType: null,
    replyRecords: null,
    transferHistory: null,
    submitTime: null,
    firstReplyTime: null,
    resolveTime: null,
    schoolId: null,
    priority: null,
    isAnonymous: null,
    satisfaction: null,
    viewCount: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("feedbackRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.schoolId = null
  queryParams.value.collegeId = null
  queryFilteredCollegeList.value = allCollegeList.value
  daterangeSubmitTime.value = []
  daterangeFirstReplyTime.value = []
  daterangeResolveTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.feedbackId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 查看/修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _feedbackId = row.feedbackId || ids.value
  getFeedback(_feedbackId).then(response => {
    form.value = response.data
    isEditing.value = true
    open.value = true
    title.value = "查看反馈信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["feedbackRef"].validate(valid => {
    if (valid) {
      if (form.value.feedbackId != null) {
        updateFeedback(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFeedback(form.value).then(response => {
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
  const _feedbackIds = row.feedbackId || ids.value
  proxy.$modal.confirm('是否确认删除反馈建议信息编号为"' + _feedbackIds + '"的数据项？').then(function () {
    return delFeedback(_feedbackIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

// 初始化
getSchoolList()
getCollegeList()
getList()
</script>

<style scoped lang="scss">
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.el-descriptions) {
  margin-bottom: 20px;
}
</style>
