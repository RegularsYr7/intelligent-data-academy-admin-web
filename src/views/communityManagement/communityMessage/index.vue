<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="接收者ID" prop="receiverId">
            <el-input v-model="queryParams.receiverId" placeholder="请输入接收者ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发送者ID" prop="senderId">
            <el-input v-model="queryParams.senderId" placeholder="请输入发送者ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发送者姓名" prop="senderName">
            <el-input v-model="queryParams.senderName" placeholder="请输入发送者姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="消息类型" prop="messageType">
            <el-select v-model="queryParams.messageType" placeholder="请选择消息类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_community_message_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="关联类型" prop="relatedType">
            <el-select v-model="queryParams.relatedType" placeholder="请选择关联类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_community_target_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关联ID" prop="relatedId">
            <el-input v-model="queryParams.relatedId" placeholder="请输入关联ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否已读" prop="isRead">
            <el-input v-model="queryParams.isRead" placeholder="请输入是否已读" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="消息时间">
            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['edu:communityMessage:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:communityMessage:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:communityMessage:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:communityMessage:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="communityMessageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="发送者" align="center" prop="senderName" min-width="100" show-overflow-tooltip />
      <el-table-column label="消息类型" align="center" prop="messageType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_community_message_type" :value="scope.row.messageType" />
        </template>
      </el-table-column>
      <el-table-column label="消息内容" align="center" prop="content" min-width="200" show-overflow-tooltip />
      <el-table-column label="是否已读" align="center" prop="isRead" width="90" />
      <el-table-column label="阅读时间" align="center" prop="readTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.readTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:communityMessage:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:communityMessage:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改社区消息通知对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="communityMessageRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="接收者ID" prop="receiverId">
              <el-input v-model="form.receiverId" placeholder="请输入接收者ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发送者ID" prop="senderId">
              <el-input v-model="form.senderId" placeholder="请输入发送者ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发送者姓名" prop="senderName">
              <el-input v-model="form.senderName" placeholder="请输入发送者姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消息类型" prop="messageType">
              <el-select v-model="form.messageType" placeholder="请选择消息类型" style="width: 100%">
                <el-option v-for="dict in edu_community_message_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联类型" prop="relatedType">
              <el-select v-model="form.relatedType" placeholder="请选择关联类型" style="width: 100%">
                <el-option v-for="dict in edu_community_target_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联ID" prop="relatedId">
              <el-input v-model="form.relatedId" placeholder="请输入关联ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否已读" prop="isRead">
              <el-input v-model="form.isRead" placeholder="请输入是否已读" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发送者头像" prop="senderAvatar">
              <image-upload v-model="form.senderAvatar" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="消息内容">
              <editor v-model="form.content" :min-height="192" />
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

<script setup name="CommunityMessage">
import { listCommunityMessage, getCommunityMessage, delCommunityMessage, addCommunityMessage, updateCommunityMessage } from "@/api/edu/communityMessage"

const { proxy } = getCurrentInstance()
const { edu_community_target_type, edu_community_message_type } = proxy.useDict('edu_community_target_type', 'edu_community_message_type')

const communityMessageList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeReadTime = ref([])
const daterangeCreateTime = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    receiverId: null,
    senderId: null,
    senderName: null,
    messageType: null,
    relatedType: null,
    relatedId: null,
    isRead: null,
    createTime: null
  },
  rules: {
    receiverId: [
      { required: true, message: "接收者ID不能为空", trigger: "blur" }
    ],
    messageType: [
      { required: true, message: "消息类型不能为空", trigger: "change" }
    ],
    content: [
      { required: true, message: "消息内容不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询社区消息通知列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeReadTime && '' != daterangeReadTime) {
    queryParams.value.params["beginReadTime"] = daterangeReadTime.value[0]
    queryParams.value.params["endReadTime"] = daterangeReadTime.value[1]
  }
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
  }
  listCommunityMessage(queryParams.value).then(response => {
    communityMessageList.value = response.rows
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
    messageId: null,
    receiverId: null,
    senderId: null,
    senderName: null,
    senderAvatar: null,
    messageType: null,
    content: null,
    relatedType: null,
    relatedId: null,
    isRead: null,
    readTime: null,
    createTime: null
  }
  proxy.resetForm("communityMessageRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeReadTime.value = []
  daterangeCreateTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.messageId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加社区消息通知"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _messageId = row.messageId || ids.value
  getCommunityMessage(_messageId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改社区消息通知"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["communityMessageRef"].validate(valid => {
    if (valid) {
      if (form.value.messageId != null) {
        updateCommunityMessage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCommunityMessage(form.value).then(response => {
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
  const _messageIds = row.messageId || ids.value
  proxy.$modal.confirm('是否确认删除社区消息通知编号为"' + _messageIds + '"的数据项？').then(function () {
    return delCommunityMessage(_messageIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/communityMessage/export', {
    ...queryParams.value
  }, `communityMessage_${new Date().getTime()}.xlsx`)
}

getList()
</script>
