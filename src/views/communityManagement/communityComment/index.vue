<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="帖子ID" prop="postId">
            <el-input v-model="queryParams.postId" placeholder="请输入帖子ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="评论人ID" prop="studentId">
            <el-input v-model="queryParams.studentId" placeholder="请输入评论人ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="评论人姓名" prop="studentName">
            <el-input v-model="queryParams.studentName" placeholder="请输入评论人姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="父评论ID" prop="parentId">
            <el-input v-model="queryParams.parentId" placeholder="请输入父评论ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="回复目标用户ID" prop="replyToId">
            <el-input v-model="queryParams.replyToId" placeholder="请输入回复目标用户ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回复目标用户名" prop="replyToName">
            <el-input v-model="queryParams.replyToName" placeholder="请输入回复目标用户名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;">
            </el-date-picker>
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
          v-hasPermi="['edu:communityComment:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:communityComment:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:communityComment:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:communityComment:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="communityCommentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="评论人" align="center" prop="studentName" min-width="100" show-overflow-tooltip />
      <el-table-column label="评论内容" align="center" prop="content" min-width="200" show-overflow-tooltip />
      <el-table-column label="回复对象" align="center" prop="replyToName" min-width="100" show-overflow-tooltip />
      <el-table-column label="点赞数" align="center" prop="likeCount" width="80" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="edu_community_status" :value="scope.row.status" />
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
            v-hasPermi="['edu:communityComment:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:communityComment:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改社区评论/回复对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="communityCommentRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="帖子ID" prop="postId">
              <el-input v-model="form.postId" placeholder="请输入帖子ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评论人ID" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入评论人ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评论人姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入评论人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父评论ID" prop="parentId">
              <el-input v-model="form.parentId" placeholder="请输入父评论ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回复目标用户ID" prop="replyToId">
              <el-input v-model="form.replyToId" placeholder="请输入回复目标用户ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回复目标用户名" prop="replyToName">
              <el-input v-model="form.replyToName" placeholder="请输入回复目标用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="dict in edu_community_status" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评论人头像" prop="studentAvatar">
              <image-upload v-model="form.studentAvatar" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评论内容">
              <editor v-model="form.content" :min-height="192" />
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
  </div>
</template>

<script setup name="CommunityComment">
import { listCommunityComment, getCommunityComment, delCommunityComment, addCommunityComment, updateCommunityComment } from "@/api/edu/communityComment"

const { proxy } = getCurrentInstance()
const { edu_community_status } = proxy.useDict('edu_community_status')

const communityCommentList = ref([])
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
    postId: null,
    studentId: null,
    studentName: null,
    parentId: null,
    replyToId: null,
    replyToName: null,
    content: null,
    createTime: null,
  },
  rules: {
    postId: [
      { required: true, message: "帖子ID不能为空", trigger: "blur" }
    ],
    studentId: [
      { required: true, message: "评论人ID不能为空", trigger: "blur" }
    ],
    studentName: [
      { required: true, message: "评论人姓名不能为空", trigger: "blur" }
    ],
    content: [
      { required: true, message: "评论内容不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询社区评论/回复列表 */
function getList() {
  loading.value = true
  listCommunityComment(queryParams.value).then(response => {
    communityCommentList.value = response.rows
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
    commentId: null,
    postId: null,
    studentId: null,
    studentName: null,
    studentAvatar: null,
    parentId: null,
    replyToId: null,
    replyToName: null,
    content: null,
    likeCount: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("communityCommentRef")
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
  ids.value = selection.map(item => item.commentId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加社区评论/回复"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _commentId = row.commentId || ids.value
  getCommunityComment(_commentId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改社区评论/回复"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["communityCommentRef"].validate(valid => {
    if (valid) {
      if (form.value.commentId != null) {
        updateCommunityComment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCommunityComment(form.value).then(response => {
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
  const _commentIds = row.commentId || ids.value
  proxy.$modal.confirm('是否确认删除社区评论/回复编号为"' + _commentIds + '"的数据项？').then(function () {
    return delCommunityComment(_commentIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/communityComment/export', {
    ...queryParams.value
  }, `communityComment_${new Date().getTime()}.xlsx`)
}

getList()
</script>
