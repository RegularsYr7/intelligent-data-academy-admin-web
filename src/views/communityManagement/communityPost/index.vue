<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="发帖学生ID" prop="studentId">
            <el-input v-model="queryParams.studentId" placeholder="请输入发帖学生ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学生姓名" prop="studentName">
            <el-input v-model="queryParams.studentName" placeholder="请输入学生姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标题" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="位置" prop="location">
            <el-input v-model="queryParams.location" placeholder="请输入位置" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="帖子类型" prop="postType">
            <el-select v-model="queryParams.postType" placeholder="请选择帖子类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_community_post_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否推荐" prop="isRecommended">
            <el-input v-model="queryParams.isRecommended" placeholder="请输入是否推荐" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in edu_community_status" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间">
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
          v-hasPermi="['edu:communityPost:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:communityPost:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:communityPost:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:communityPost:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="communityPostList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="标题" align="center" prop="title" min-width="150" show-overflow-tooltip />
      <el-table-column label="发帖学生" align="center" prop="studentName" min-width="100" show-overflow-tooltip />
      <el-table-column label="帖子类型" align="center" prop="postType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_community_post_type" :value="scope.row.postType" />
        </template>
      </el-table-column>
      <el-table-column label="互动数" align="center" prop="likeCount" width="120">
        <template #default="scope">
          <span>👍{{ scope.row.likeCount }} 💬{{ scope.row.commentCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="edu_community_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommended" width="90">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.isRecommended" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="帖子信息" align="center" width="200" fixed="right">
        <template #default="scope">
          <el-button link type="success" @click="showCommentDetail(scope.row.postId)">评论</el-button>
          <el-button link type="success" @click="showLikeDetail(scope.row.postId)">点赞</el-button>
          <el-button link type="success" @click="showCollectDetail(scope.row.postId)">收藏</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:communityPost:edit']">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:communityPost:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改社区帖子对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="communityPostRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发帖学生ID" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入发帖学生ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置" prop="location">
              <el-input v-model="form.location" placeholder="请输入位置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帖子类型" prop="postType">
              <el-select v-model="form.postType" placeholder="请选择帖子类型" style="width: 100%">
                <el-option v-for="dict in edu_community_post_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否推荐" prop="isRecommended">
              <el-input v-model="form.isRecommended" placeholder="请输入是否推荐" />
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
            <el-form-item label="学生头像" prop="studentAvatar">
              <image-upload v-model="form.studentAvatar" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <editor v-model="form.content" :min-height="192" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="展示图片" prop="images">
              <el-input v-model="form.images" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标签" prop="tags">
              <el-input v-model="form.tags" type="textarea" placeholder="请输入内容" />
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

    <!-- 评论/回复详情对话框 -->
    <el-dialog title="评论/回复详情" v-model="commentDialogVisible" width="1200px" append-to-body>
      <el-table v-loading="commentLoading" :data="commentList" max-height="500">
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
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="danger" icon="Delete" @click="handleDeleteComment(scope.row)"
              v-hasPermi="['edu:communityComment:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="commentTotal > 0" :total="commentTotal" v-model:page="commentQueryParams.pageNum"
        v-model:limit="commentQueryParams.pageSize" @pagination="getCommentList" />
    </el-dialog>

    <!-- 点赞详情对话框 -->
    <el-dialog title="点赞详情" v-model="likeDialogVisible" width="1000px" append-to-body>
      <el-table v-loading="likeLoading" :data="likeList" max-height="500">
        <el-table-column label="点赞ID" align="center" prop="likeId" width="90" />
        <el-table-column label="目标类型" align="center" prop="targetType" width="100">
          <template #default="scope">
            <dict-tag :options="edu_community_target_type" :value="scope.row.targetType" />
          </template>
        </el-table-column>
        <el-table-column label="点赞人ID" align="center" prop="studentId" width="90" />
        <el-table-column label="点赞人姓名" align="center" prop="studentName" min-width="120" show-overflow-tooltip />
        <el-table-column label="点赞时间" align="center" prop="createTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="danger" icon="Delete" @click="handleDeleteLike(scope.row)"
              v-hasPermi="['edu:communityLike:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="likeTotal > 0" :total="likeTotal" v-model:page="likeQueryParams.pageNum"
        v-model:limit="likeQueryParams.pageSize" @pagination="getLikeList" />
    </el-dialog>

    <!-- 收藏详情对话框 -->
    <el-dialog title="收藏详情" v-model="collectDialogVisible" width="1000px" append-to-body>
      <el-table v-loading="collectLoading" :data="collectList" max-height="500">
        <el-table-column label="收藏ID" align="center" prop="collectId" width="90" />
        <el-table-column label="帖子ID" align="center" prop="postId" width="90" />
        <el-table-column label="收藏人ID" align="center" prop="studentId" width="100" />
        <el-table-column label="收藏人姓名" align="center" prop="studentName" min-width="120" show-overflow-tooltip />
        <el-table-column label="收藏时间" align="center" prop="createTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="danger" icon="Delete" @click="handleDeleteCollect(scope.row)"
              v-hasPermi="['edu:communityCollect:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="collectTotal > 0" :total="collectTotal" v-model:page="collectQueryParams.pageNum"
        v-model:limit="collectQueryParams.pageSize" @pagination="getCollectList" />
    </el-dialog>
  </div>
</template>

<script setup name="CommunityPost">
import { listCommunityPost, getCommunityPost, delCommunityPost, addCommunityPost, updateCommunityPost } from "@/api/edu/communityPost"
import { listCommunityComment, delCommunityComment } from "@/api/edu/communityComment"
import { listCommunityLike, delCommunityLike } from "@/api/edu/communityLike"
import { listCommunityCollect, delCommunityCollect } from "@/api/edu/communityCollect"

const { proxy } = getCurrentInstance()
const { edu_community_status, edu_community_post_type, edu_community_target_type } = proxy.useDict('edu_community_status', 'edu_community_post_type', 'edu_community_target_type')

const communityPostList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeCreateTime = ref([])

// 评论详情相关
const commentDialogVisible = ref(false)
const commentLoading = ref(false)
const commentList = ref([])
const commentTotal = ref(0)
const currentPostId = ref(null)
const commentQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  postId: null
})

// 点赞详情相关
const likeDialogVisible = ref(false)
const likeLoading = ref(false)
const likeList = ref([])
const likeTotal = ref(0)
const likeQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  targetType: '1', // 1-帖子
  targetId: null
})

// 收藏详情相关
const collectDialogVisible = ref(false)
const collectLoading = ref(false)
const collectList = ref([])
const collectTotal = ref(0)
const collectQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  postId: null
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    studentId: null,
    studentName: null,
    title: null,
    tags: null,
    location: null,
    postType: null,
    isRecommended: null,
    status: null,
    createTime: null,
  },
  rules: {
    studentId: [
      { required: true, message: "发帖学生ID不能为空", trigger: "blur" }
    ],
    studentName: [
      { required: true, message: "学生姓名不能为空", trigger: "blur" }
    ],
    content: [
      { required: true, message: "内容不能为空", trigger: "blur" }
    ],
    postType: [
      { required: true, message: "帖子类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询社区帖子列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
  }
  listCommunityPost(queryParams.value).then(response => {
    communityPostList.value = response.rows
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
    postId: null,
    studentId: null,
    studentName: null,
    studentAvatar: null,
    title: null,
    content: null,
    images: null,
    tags: null,
    location: null,
    postType: null,
    isRecommended: null,
    status: null,
    likeCount: null,
    commentCount: null,
    collectCount: null,
    viewCount: null,
    hotScore: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("communityPostRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeCreateTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.postId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加社区帖子"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _postId = row.postId || ids.value
  getCommunityPost(_postId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改社区帖子"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["communityPostRef"].validate(valid => {
    if (valid) {
      if (form.value.postId != null) {
        updateCommunityPost(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCommunityPost(form.value).then(response => {
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
  const _postIds = row.postId || ids.value
  proxy.$modal.confirm('是否确认删除社区帖子编号为"' + _postIds + '"的数据项？').then(function () {
    return delCommunityPost(_postIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/communityPost/export', {
    ...queryParams.value
  }, `communityPost_${new Date().getTime()}.xlsx`)
}

/** 查看评论详情 */
function showCommentDetail(postId) {
  commentQueryParams.value.postId = postId
  commentQueryParams.value.pageNum = 1
  commentDialogVisible.value = true
  getCommentList()
}

/** 获取评论列表 */
function getCommentList() {
  commentLoading.value = true
  listCommunityComment(commentQueryParams.value).then(response => {
    commentList.value = response.rows
    commentTotal.value = response.total
    commentLoading.value = false
  })
}

/** 删除评论 */
function handleDeleteComment(row) {
  proxy.$modal.confirm('是否确认删除该评论？').then(function () {
    return delCommunityComment(row.commentId)
  }).then(() => {
    getCommentList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 查看点赞详情 */
function showLikeDetail(postId) {
  likeQueryParams.value.targetId = postId
  likeQueryParams.value.targetType = '1' // 1-帖子
  likeQueryParams.value.pageNum = 1
  likeDialogVisible.value = true
  getLikeList()
}

/** 获取点赞列表 */
function getLikeList() {
  likeLoading.value = true
  listCommunityLike(likeQueryParams.value).then(response => {
    likeList.value = response.rows
    likeTotal.value = response.total
    likeLoading.value = false
  })
}

/** 删除点赞 */
function handleDeleteLike(row) {
  proxy.$modal.confirm('是否确认删除该点赞记录？').then(function () {
    return delCommunityLike(row.likeId)
  }).then(() => {
    getLikeList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 查看收藏详情 */
function showCollectDetail(postId) {
  collectQueryParams.value.postId = postId
  collectQueryParams.value.pageNum = 1
  collectDialogVisible.value = true
  getCollectList()
}

/** 获取收藏列表 */
function getCollectList() {
  collectLoading.value = true
  listCommunityCollect(collectQueryParams.value).then(response => {
    collectList.value = response.rows
    collectTotal.value = response.total
    collectLoading.value = false
  })
}

/** 删除收藏 */
function handleDeleteCollect(row) {
  proxy.$modal.confirm('是否确认删除该收藏记录？').then(function () {
    return delCommunityCollect(row.collectId)
  }).then(() => {
    getCollectList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

getList()
</script>
