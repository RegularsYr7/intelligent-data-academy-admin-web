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
      <el-table-column label="所属学院" align="center" prop="collegeName" min-width="120" show-overflow-tooltip />
      <el-table-column label="所属学校" align="center" prop="schoolName" min-width="120" show-overflow-tooltip />
      <el-table-column label="处理人" align="center" prop="currentHandlerName" min-width="100" show-overflow-tooltip />
      <el-table-column label="提交时间" align="center" prop="submitTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.submitTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewReplies(scope.row)"
            v-hasPermi="['edu:feedback:query']">查看回复</el-button>
          <el-button link type="success" icon="ChatDotRound" @click="handleReplyDialog(scope.row)"
            v-hasPermi="['edu:feedback:reply']">回复</el-button>
          <el-button link type="primary" icon="View" @click="handleView(scope.row)"
            v-hasPermi="['edu:feedback:query']">查看</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:feedback:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 查看反馈信息对话框 -->
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
      <el-form ref="feedbackRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" disabled style="width: 100%;">
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
              <el-input v-model="form.title" placeholder="标题" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="反馈类型" prop="feedbackType">
              <el-select v-model="form.feedbackType" placeholder="反馈类型" disabled style="width: 100%">
                <el-option v-for="dict in edu_feedback_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contactInfo">
              <el-input v-model="form.contactInfo" placeholder="联系方式" readonly />
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
          <el-col :span="12">
            <el-form-item label="所属学院" prop="collegeName">
              <el-input v-model="form.collegeName" placeholder="所属学院" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolName">
              <el-input v-model="form.schoolName" placeholder="所属学校" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="详细描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="详细描述" readonly />
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
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="备注" readonly />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看回复列表对话框 -->
    <el-dialog title="回复列表" v-model="replyListDialogVisible" width="700px" append-to-body>
      <div v-if="replyHistoryList.length === 0" style="text-align: center; padding: 40px 0; color: #909399;">
        <el-icon size="48" style="margin-bottom: 16px;">
          <ChatLineSquare />
        </el-icon>
        <div>暂无回复记录</div>
      </div>
      <el-timeline v-else>
        <el-timeline-item v-for="(reply, index) in replyHistoryList" :key="index" :timestamp="reply.replyTime"
          placement="top" :color="reply.type === 'reply' ? '#409EFF' : '#67C23A'">
          <el-card shadow="hover">
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold;">{{ reply.replyBy || '管理员' }}</span>
                <el-tag :type="reply.type === 'reply' ? 'primary' : 'success'" size="small">
                  {{ reply.type === 'reply' ? '回复' : '补充' }}
                </el-tag>
              </div>
            </template>
            <div style="white-space: pre-wrap; line-height: 1.8; color: #606266;">{{ reply.content }}</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="replyListDialogVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加回复对话框 -->
    <el-dialog title="添加回复" v-model="replyDialogVisible" width="600px" append-to-body>
      <div style="margin-bottom: 16px;">
        <div style="font-weight: 500; margin-bottom: 8px; color: #606266;">反馈标题</div>
        <div style="padding: 12px; background-color: #f5f7fa; border-radius: 4px; color: #303133;">
          {{ currentFeedback.title }}
        </div>
      </div>
      <div style="margin-bottom: 16px;">
        <div style="font-weight: 500; margin-bottom: 8px; color: #606266;">反馈内容</div>
        <div
          style="padding: 12px; background-color: #f5f7fa; border-radius: 4px; color: #606266; max-height: 200px; overflow-y: auto;">
          {{ currentFeedback.description }}
        </div>
      </div>
      <el-divider />
      <el-form :model="replyForm" ref="replyFormRef" label-width="80px">
        <el-form-item label="回复内容" prop="content" :rules="[{ required: true, message: '请输入回复内容', trigger: 'blur' }]">
          <el-input v-model="replyForm.content" type="textarea" :rows="6" placeholder="请输入对学生反馈的回复内容..." maxlength="500"
            show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="replyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitReply" :disabled="!replyForm.content || !replyForm.content.trim()">
            提交回复
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Feedback">
import { listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback, replyFeedback } from "@/api/edu/feedback"
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

// 回复相关
const replyListDialogVisible = ref(false)
const replyDialogVisible = ref(false)
const replyHistoryList = ref([])
const currentFeedback = ref({})
const replyForm = reactive({
  content: ''
})

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

/** 查看按钮操作 */
function handleView(row) {
  reset()
  const _feedbackId = row.feedbackId || ids.value
  getFeedback(_feedbackId).then(response => {
    form.value = response.data
    isEditing.value = false
    open.value = true
    title.value = "查看反馈详情"
  })
}

/** 查看回复列表 */
function handleViewReplies(row) {
  currentFeedback.value = { ...row }
  replyListDialogVisible.value = true

  // 加载回复历史
  getFeedback(row.feedbackId).then(response => {
    loadReplyHistory(response.data.replyRecords)
  })
}

/** 打开回复对话框 */
function handleReplyDialog(row) {
  currentFeedback.value = { ...row }
  replyForm.content = ''

  // 加载完整的反馈信息（包括description）
  getFeedback(row.feedbackId).then(response => {
    currentFeedback.value = response.data
    replyDialogVisible.value = true
  })
}

/** 加载回复历史记录 */
function loadReplyHistory(replyRecords) {
  replyHistoryList.value = []
  if (replyRecords) {
    try {
      const records = JSON.parse(replyRecords)
      replyHistoryList.value = records.map(record => {
        // 兼容处理：管理员回复用 replyTime/replyBy，学生追加用 time/userName
        const time = record.replyTime || record.time
        const name = record.replyBy || record.userName || (record.type === 'reply' ? '管理员' : '学生')

        return {
          ...record,
          replyTime: proxy.parseTime(time, '{y}-{m}-{d} {h}:{i}'),
          replyBy: name
        }
      })
    } catch (e) {
      console.error('解析回复记录失败', e)
    }
  }
}

/** 提交回复 */
function submitReply() {
  if (!replyForm.content || !replyForm.content.trim()) {
    proxy.$modal.msgWarning("请输入回复内容")
    return
  }

  proxy.$modal.confirm('确认要提交回复吗？').then(() => {
    return replyFeedback({
      feedbackId: currentFeedback.value.feedbackId,
      replyContent: replyForm.content.trim()
    })
  }).then(() => {
    proxy.$modal.msgSuccess("回复成功")
    replyDialogVisible.value = false
    replyForm.content = ''
    // 刷新列表
    getList()
  }).catch(() => { })
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

:deep(.el-timeline) {
  padding-left: 0;

  .el-timeline-item__wrapper {
    padding-left: 35px;
  }

  .el-timeline-item__timestamp {
    color: #909399;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .el-card {
    margin-bottom: 10px;

    .el-card__header {
      padding: 12px 15px;
      background-color: #f5f7fa;
    }

    .el-card__body {
      padding: 15px;
      color: #606266;
    }
  }
}
</style>
