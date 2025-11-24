<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="竞赛名称" prop="competitionName">
            <el-input v-model="queryParams.competitionName" placeholder="请输入竞赛名称" clearable
              @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="竞赛分类" prop="competitionCategory">
            <el-select v-model="queryParams.competitionCategory" placeholder="请选择竞赛分类" clearable style="width: 100%;">
              <el-option v-for="(dict, index) in edu_competition_category" :key="'category_' + index"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="竞赛级别" prop="competitionLevel">
            <el-select v-model="queryParams.competitionLevel" placeholder="请选择竞赛级别" clearable style="width: 100%;">
              <el-option v-for="(dict, index) in edu_competition_level" :key="'level_' + index" :label="dict.label"
                :value="dict.value" />
            </el-select>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['edu:competition:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:competition:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:competition:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:competition:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="competitionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="竞赛名称" align="center" prop="competitionName" min-width="150" show-overflow-tooltip />
      <el-table-column label="竞赛分类" align="center" prop="competitionCategory" width="120">
        <template #default="scope">
          <dict-tag :options="edu_competition_category" :value="scope.row.competitionCategory" />
        </template>
      </el-table-column>
      <el-table-column label="竞赛级别" align="center" prop="competitionLevel" width="120">
        <template #default="scope">
          <dict-tag :options="edu_competition_level" :value="scope.row.competitionLevel" />
        </template>
      </el-table-column>
      <el-table-column label="主办单位" align="center" prop="organizer" min-width="150" show-overflow-tooltip />
      <el-table-column label="报名时间" align="center" width="200">
        <template #default="scope">
          <div>{{ parseTime(scope.row.registrationStartTime, '{y}-{m}-{d}') }}</div>
          <div>至</div>
          <div>{{ parseTime(scope.row.registrationEndTime, '{y}-{m}-{d}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="竞赛时间" align="center" width="200">
        <template #default="scope">
          <div>{{ parseTime(scope.row.competitionStartTime, '{y}-{m}-{d}') }}</div>
          <div>至</div>
          <div>{{ parseTime(scope.row.competitionEndTime, '{y}-{m}-{d}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="竞赛地点" align="center" prop="competitionLocation" min-width="120" show-overflow-tooltip />
      <el-table-column label="最大人数" align="center" prop="maxParticipants" width="100" />
      <el-table-column label="报名费用" align="center" prop="registrationFee" width="100" />
      <el-table-column label="竞赛状态" align="center" prop="competitionStatus" width="100">
        <template #default="scope">
          <dict-tag :options="edu_competition_status" :value="scope.row.competitionStatus" />
        </template>
      </el-table-column>
      <el-table-column label="是否发布" align="center" prop="isPublished" width="100">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.isPublished" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:competition:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:competition:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改竞赛信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="competitionRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="竞赛名称" prop="competitionName">
              <el-input v-model="form.competitionName" placeholder="请输入竞赛名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="竞赛分类" prop="competitionCategory">
              <el-select v-model="form.competitionCategory" placeholder="请选择竞赛分类" style="width: 100%;">
                <el-option v-for="(dict, index) in edu_competition_category" :key="'form_category_' + index"
                  :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="竞赛级别" prop="competitionLevel">
              <el-select v-model="form.competitionLevel" placeholder="请选择竞赛级别" style="width: 100%;">
                <el-option v-for="(dict, index) in edu_competition_level" :key="'form_level_' + index"
                  :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主办单位" prop="organizer">
              <el-input v-model="form.organizer" placeholder="请输入主办单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="协办单位" prop="coOrganizer">
              <el-input v-model="form.coOrganizer" placeholder="请输入协办单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名开始时间" prop="registrationStartTime">
              <el-date-picker clearable v-model="form.registrationStartTime" type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择报名开始时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="报名结束时间" prop="registrationEndTime">
              <el-date-picker clearable v-model="form.registrationEndTime" type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择报名结束时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="竞赛开始时间" prop="competitionStartTime">
              <el-date-picker clearable v-model="form.competitionStartTime" type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择竞赛开始时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="竞赛结束时间" prop="competitionEndTime">
              <el-date-picker clearable v-model="form.competitionEndTime" type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择竞赛结束时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="竞赛地点" prop="competitionLocation">
              <el-input v-model="form.competitionLocation" placeholder="请输入竞赛地点" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="最大参赛人数" prop="maxParticipants">
              <el-input v-model="form.maxParticipants" placeholder="请输入最大参赛人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名费用" prop="registrationFee">
              <el-input v-model="form.registrationFee" placeholder="请输入报名费用" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="竞赛状态" prop="competitionStatus">
              <el-select v-model="form.competitionStatus" placeholder="请选择竞赛状态" style="width: 100%;">
                <el-option v-for="(dict, index) in edu_competition_status" :key="'status_' + index" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面图片" prop="coverImage">
              <image-upload v-model="form.coverImage" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="线上地址" prop="onlineLocation">
              <el-input v-model="form.onlineLocation" placeholder="请输入线上地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="竞赛规则" prop="competitionRules">
              <el-input v-model="form.competitionRules" type="textarea" :rows="3" placeholder="请输入竞赛规则" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="奖项设置" prop="awardInfo">
              <el-input v-model="form.awardInfo" type="textarea" :rows="3" placeholder="请输入奖项设置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否发布" prop="isPublished">
              <el-radio-group v-model="form.isPublished">
                <el-radio v-for="(dict, index) in sys_yes_no" :key="'published_' + index" :label="dict.value">{{
                  dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="status" style="margin-top: 18px;">
              <el-radio-group v-model="form.status">
                <el-radio v-for="(dict, index) in sys_normal_disable" :key="'form_status_' + index"
                  :label="dict.value">{{
                    dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="24">
            <el-form-item label="竞赛内容">
              <editor v-model="form.competitionContent" :min-height="192" />
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

<script setup name="Competition">
import { listCompetition, getCompetition, delCompetition, addCompetition, updateCompetition } from "@/api/edu/competition"

const { proxy } = getCurrentInstance()
const dictData = proxy.useDict('edu_competition_status', 'edu_competition_category', 'sys_yes_no', 'edu_competition_level', 'sys_normal_disable')

// 字典数据去重处理
const uniqueDict = (dictArray) => {
  if (!dictArray || !dictArray.value) return []
  const seen = new Set()
  return dictArray.value.filter(item => {
    const key = item.value
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

// 去重后的字典数据
const edu_competition_status = computed(() => uniqueDict(dictData.edu_competition_status))
const edu_competition_category = computed(() => uniqueDict(dictData.edu_competition_category))
const sys_yes_no = computed(() => uniqueDict(dictData.sys_yes_no))
const edu_competition_level = computed(() => uniqueDict(dictData.edu_competition_level))
const sys_normal_disable = computed(() => uniqueDict(dictData.sys_normal_disable))

const competitionList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeRegistrationStartTime = ref([])
const daterangeRegistrationEndTime = ref([])
const daterangeCompetitionStartTime = ref([])
const daterangeCompetitionEndTime = ref([])
const daterangePublishTime = ref([])
const daterangeCreateTime = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    competitionCode: null,
    competitionName: null,
    competitionCategory: null,
    competitionLevel: null,
    organizer: null,
    registrationStartTime: null,
    registrationEndTime: null,
    competitionStartTime: null,
    competitionLocation: null,
    competitionStatus: null,
    isPublished: null,
    status: null,
    createTime: null,
  },
  rules: {
    competitionName: [
      { required: true, message: "竞赛名称不能为空", trigger: "blur" }
    ],
    competitionCategory: [
      { required: true, message: "竞赛分类不能为空", trigger: "change" }
    ],
    registrationStartTime: [
      { required: true, message: "报名开始时间不能为空", trigger: "blur" }
    ],
    registrationEndTime: [
      { required: true, message: "报名结束时间不能为空", trigger: "blur" }
    ],
    competitionStartTime: [
      { required: true, message: "竞赛开始时间不能为空", trigger: "blur" }
    ],
    competitionLocation: [
      { required: true, message: "竞赛地点不能为空", trigger: "blur" }
    ],
    currentParticipants: [
      { required: true, message: "当前报名人数不能为空", trigger: "blur" }
    ],
    competitionStatus: [
      { required: true, message: "竞赛状态不能为空", trigger: "change" }
    ],
    isPublished: [
      { required: true, message: "是否发布不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询竞赛信息列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeRegistrationStartTime && '' != daterangeRegistrationStartTime) {
    queryParams.value.params["beginRegistrationStartTime"] = daterangeRegistrationStartTime.value[0]
    queryParams.value.params["endRegistrationStartTime"] = daterangeRegistrationStartTime.value[1]
  }
  if (null != daterangeRegistrationEndTime && '' != daterangeRegistrationEndTime) {
    queryParams.value.params["beginRegistrationEndTime"] = daterangeRegistrationEndTime.value[0]
    queryParams.value.params["endRegistrationEndTime"] = daterangeRegistrationEndTime.value[1]
  }
  if (null != daterangeCompetitionStartTime && '' != daterangeCompetitionStartTime) {
    queryParams.value.params["beginCompetitionStartTime"] = daterangeCompetitionStartTime.value[0]
    queryParams.value.params["endCompetitionStartTime"] = daterangeCompetitionStartTime.value[1]
  }
  if (null != daterangeCompetitionEndTime && '' != daterangeCompetitionEndTime) {
    queryParams.value.params["beginCompetitionEndTime"] = daterangeCompetitionEndTime.value[0]
    queryParams.value.params["endCompetitionEndTime"] = daterangeCompetitionEndTime.value[1]
  }
  if (null != daterangePublishTime && '' != daterangePublishTime) {
    queryParams.value.params["beginPublishTime"] = daterangePublishTime.value[0]
    queryParams.value.params["endPublishTime"] = daterangePublishTime.value[1]
  }
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
  }
  listCompetition(queryParams.value).then(response => {
    competitionList.value = response.rows
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
    competitionId: null,
    competitionCode: null,
    competitionName: null,
    competitionNameEn: null,
    competitionCategory: null,
    competitionLevel: null,
    organizer: null,
    coOrganizer: null,
    registrationStartTime: null,
    registrationEndTime: null,
    competitionStartTime: null,
    competitionEndTime: null,
    competitionLocation: null,
    onlineLocation: null,
    competitionContent: null,
    competitionRules: null,
    awardInfo: null,
    maxParticipants: null,
    currentParticipants: null,
    registrationFee: null,
    contactPerson: null,
    contactPhone: null,
    contactEmail: null,
    coverImage: null,
    attachmentUrls: null,
    viewCount: null,
    competitionStatus: null,
    isPublished: null,
    publishTime: null,
    sortOrder: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("competitionRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeRegistrationStartTime.value = []
  daterangeRegistrationEndTime.value = []
  daterangeCompetitionStartTime.value = []
  daterangeCompetitionEndTime.value = []
  daterangePublishTime.value = []
  daterangeCreateTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.competitionId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加竞赛信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _competitionId = row.competitionId || ids.value
  getCompetition(_competitionId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改竞赛信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["competitionRef"].validate(valid => {
    if (valid) {
      if (form.value.competitionId != null) {
        updateCompetition(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCompetition(form.value).then(response => {
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
  const _competitionIds = row.competitionId || ids.value
  proxy.$modal.confirm('是否确认删除竞赛信息编号为"' + _competitionIds + '"的数据项？').then(function () {
    return delCompetition(_competitionIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/competition/export', {
    ...queryParams.value
  }, `competition_${new Date().getTime()}.xlsx`)
}

getList()
</script>
