<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="活动ID" prop="activityId">
            <el-input v-model="queryParams.activityId" placeholder="请输入活动ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="活动名称" prop="activityName">
            <el-input v-model="queryParams.activityName" placeholder="请输入活动名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="活动类型" prop="activityType">
            <el-select v-model="queryParams.activityType" placeholder="请选择活动类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_activity_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="activityStatus">
            <el-select v-model="queryParams.activityStatus" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in edu_activity_status" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="活动级别" prop="activityLevel">
            <el-select v-model="queryParams.activityLevel" placeholder="请选择活动级别" clearable style="width: 100%;">
              <el-option v-for="dict in edu_activity_level" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="活动开始时间">
            <el-date-picker v-model="daterangeActivityStartTime" value-format="YYYY-MM-DD" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属学校ID" prop="schoolId">
            <el-input v-model="queryParams.schoolId" placeholder="请输入所属学校ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否精选" prop="isFeatured">
            <el-select v-model="queryParams.isFeatured" placeholder="请选择是否精选" clearable style="width: 100%;">
              <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="是否置顶" prop="isTop">
            <el-select v-model="queryParams.isTop" placeholder="请选择是否置顶" clearable style="width: 100%;">
              <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          <el-form-item label="创建时间">
            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:activity:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:activity:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:activity:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:activity:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="活动名称" align="center" prop="activityName" min-width="150" show-overflow-tooltip />
      <el-table-column label="活动类型" align="center" prop="activityType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_activity_type" :value="scope.row.activityType" />
        </template>
      </el-table-column>
      <el-table-column label="活动状态" align="center" prop="activityStatus" width="100">
        <template #default="scope">
          <dict-tag :options="edu_activity_status" :value="scope.row.activityStatus" />
        </template>
      </el-table-column>
      <el-table-column label="活动开始时间" align="center" prop="activityStartTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.activityStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名人数" align="center" prop="currentParticipants" width="100">
        <template #default="scope">
          <span>{{ scope.row.currentParticipants }} / {{ scope.row.maxParticipants }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="参与记录" align="center" width="100" fixed="right">
        <template #default="scope">
          <el-button link type="success" @click="showParticipantDetail(scope.row.activityId)">查看记录</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:activity:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:activity:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改活动信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="activityRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动名称" prop="activityName">
              <el-input v-model="form.activityName" placeholder="请输入活动名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动类型" prop="activityType">
              <el-select v-model="form.activityType" placeholder="请选择活动类型" style="width: 100%">
                <el-option v-for="dict in edu_activity_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动状态" prop="activityStatus">
              <el-select v-model="form.activityStatus" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="dict in edu_activity_status" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动级别" prop="activityLevel">
              <el-select v-model="form.activityLevel" placeholder="请选择活动级别" style="width: 100%">
                <el-option v-for="dict in edu_activity_level" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名开始时间" prop="registerStartTime">
              <el-date-picker clearable v-model="form.registerStartTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择报名开始时间" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名结束时间" prop="registerEndTime">
              <el-date-picker clearable v-model="form.registerEndTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择报名结束时间" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动开始时间" prop="activityStartTime">
              <el-date-picker clearable v-model="form.activityStartTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择活动开始时间" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动结束时间" prop="activityEndTime">
              <el-date-picker clearable v-model="form.activityEndTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择活动结束时间" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与范围" prop="participateScope">
              <el-input v-model="form.participateScope" placeholder="请输入参与范围" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否支持活动请假" prop="allowLeave">
              <el-radio-group v-model="form.allowLeave">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最多报名人数" prop="maxParticipants">
              <el-input v-model="form.maxParticipants" placeholder="请输入最多报名人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学分设置" prop="creditValue">
              <el-input v-model="form.creditValue" placeholder="请输入学分设置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动积分" prop="scoreValue">
              <el-input v-model="form.scoreValue" placeholder="请输入活动积分" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学校ID" prop="schoolId">
              <el-input v-model="form.schoolId" placeholder="请输入所属学校ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input v-model="form.contactEmail" placeholder="请输入联系邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否精选" prop="isFeatured">
              <el-radio-group v-model="form.isFeatured">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否置顶" prop="isTop">
              <el-radio-group v-model="form.isTop">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间" prop="publishTime">
              <el-date-picker clearable v-model="form.publishTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择发布时间" style="width: 100%">
              </el-date-picker>
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
          <el-col :span="24">
            <el-form-item label="活动标签" prop="activityTags">
              <el-input v-model="form.activityTags" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动地点" prop="activityLocation">
              <el-input v-model="form.activityLocation" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动详情">
              <editor v-model="form.activityDetail" :min-height="192" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="封面图片" prop="coverImage">
              <image-upload v-model="form.coverImage" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动图片列表" prop="imageUrls">
              <image-upload v-model="form.imageUrls" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="负责人ID列表" prop="leaderIds">
              <el-input v-model="form.leaderIds" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="负责人姓名列表" prop="leaderNames">
              <el-input v-model="form.leaderNames" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="组织者ID列表" prop="organizerIds">
              <el-input v-model="form.organizerIds" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="组织者姓名列表" prop="organizerNames">
              <el-input v-model="form.organizerNames" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
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

    <!-- 参与记录详情对话框 -->
    <el-dialog title="参与记录详情" v-model="participantDialogVisible" width="1400px" append-to-body>
      <el-table v-loading="participantLoading" :data="participantList" max-height="500">
        <el-table-column label="参与记录ID" align="center" prop="participantId" width="110" />
        <el-table-column label="学生姓名" align="center" prop="studentName" min-width="100" show-overflow-tooltip />
        <el-table-column label="学号" align="center" prop="studentNo" min-width="120" show-overflow-tooltip />
        <el-table-column label="参与状态" align="center" prop="participateStatus" width="100">
          <template #default="scope">
            <dict-tag :options="edu_participate_status" :value="scope.row.participateStatus" />
          </template>
        </el-table-column>
        <el-table-column label="报名时间" align="center" prop="enrollTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.enrollTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="获得奖励" align="center" prop="creditsEarned" width="130">
          <template #default="scope">
            <span>学分: {{ scope.row.creditsEarned || 0 }} | 积分: {{ scope.row.pointsEarned || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评分" align="center" prop="rating" width="80" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="danger" icon="Delete" @click="handleDeleteParticipant(scope.row)"
              v-hasPermi="['edu:participant:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="participantTotal > 0" :total="participantTotal" v-model:page="participantQueryParams.pageNum"
        v-model:limit="participantQueryParams.pageSize" @pagination="getParticipantList" />
    </el-dialog>
  </div>
</template>

<script setup name="Activity">
import { listActivity, getActivity, delActivity, addActivity, updateActivity } from "@/api/edu/activity"
import { listParticipant, delParticipant } from "@/api/edu/participant"

const { proxy } = getCurrentInstance()
const { edu_activity_level, edu_activity_status, sys_yes_no, sys_normal_disable, edu_activity_type, edu_participate_status } = proxy.useDict('edu_activity_level', 'edu_activity_status', 'sys_yes_no', 'sys_normal_disable', 'edu_activity_type', 'edu_participate_status')

const activityList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeActivityStartTime = ref([])
const daterangeCreateTime = ref([])

// 参与记录相关
const participantDialogVisible = ref(false)
const participantLoading = ref(false)
const participantList = ref([])
const participantTotal = ref(0)
const currentActivityId = ref(null)
const participantQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  activityId: null
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    activityId: null,
    activityName: null,
    activityType: null,
    activityStatus: null,
    activityLevel: null,
    activityStartTime: null,
    schoolId: null,
    isFeatured: null,
    isTop: null,
    status: null,
    createTime: null,
  },
  rules: {
    activityName: [
      { required: true, message: "活动名称不能为空", trigger: "blur" }
    ],
    activityType: [
      { required: true, message: "活动类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询活动信息列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeActivityStartTime && '' != daterangeActivityStartTime) {
    queryParams.value.params["beginActivityStartTime"] = daterangeActivityStartTime.value[0]
    queryParams.value.params["endActivityStartTime"] = daterangeActivityStartTime.value[1]
  }
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
  }
  listActivity(queryParams.value).then(response => {
    activityList.value = response.rows
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
    activityId: null,
    activityName: null,
    activityType: null,
    activityStatus: null,
    activityLevel: null,
    activityTags: null,
    activityLocation: null,
    activityDetail: null,
    coverImage: null,
    imageUrls: null,
    registerStartTime: null,
    registerEndTime: null,
    activityStartTime: null,
    activityEndTime: null,
    participateScope: null,
    allowLeave: null,
    maxParticipants: null,
    currentParticipants: null,
    creditValue: null,
    scoreValue: null,
    leaderIds: null,
    leaderNames: null,
    organizerIds: null,
    organizerNames: null,
    participantIds: null,
    participantNames: null,
    favoriteCount: null,
    viewCount: null,
    schoolId: null,
    contactPhone: null,
    contactEmail: null,
    isFeatured: null,
    isTop: null,
    publishTime: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("activityRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeActivityStartTime.value = []
  daterangeCreateTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.activityId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加活动信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _activityId = row.activityId || ids.value
  getActivity(_activityId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改活动信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["activityRef"].validate(valid => {
    if (valid) {
      if (form.value.activityId != null) {
        updateActivity(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addActivity(form.value).then(response => {
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
  const _activityIds = row.activityId || ids.value
  proxy.$modal.confirm('是否确认删除活动信息编号为"' + _activityIds + '"的数据项？').then(function () {
    return delActivity(_activityIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/activity/export', {
    ...queryParams.value
  }, `activity_${new Date().getTime()}.xlsx`)
}

/** 查看参与记录详情 */
function showParticipantDetail(activityId) {
  currentActivityId.value = activityId
  participantQueryParams.value.activityId = activityId
  participantQueryParams.value.pageNum = 1
  participantDialogVisible.value = true
  getParticipantList()
}

/** 获取参与记录列表 */
function getParticipantList() {
  participantLoading.value = true
  listParticipant(participantQueryParams.value).then(response => {
    participantList.value = response.rows
    participantTotal.value = response.total
    participantLoading.value = false
  })
}

/** 删除参与记录 */
function handleDeleteParticipant(row) {
  proxy.$modal.confirm('是否确认删除该参与记录？').then(function () {
    return delParticipant(row.participantId)
  }).then(() => {
    getParticipantList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

getList()
</script>
