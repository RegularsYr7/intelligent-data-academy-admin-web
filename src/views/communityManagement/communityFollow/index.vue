<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="关注者ID" prop="followerId">
            <el-input v-model="queryParams.followerId" placeholder="请输入关注者ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关注者姓名" prop="followerName">
            <el-input v-model="queryParams.followerName" placeholder="请输入关注者姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="被关注者ID" prop="followeeId">
            <el-input v-model="queryParams.followeeId" placeholder="请输入被关注者ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="被关注者姓名" prop="followeeName">
            <el-input v-model="queryParams.followeeName" placeholder="请输入被关注者姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="关注时间">
            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="18" style="text-align: right;">
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
          v-hasPermi="['edu:communityFollow:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:communityFollow:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:communityFollow:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:communityFollow:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="communityFollowList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="关注ID" align="center" prop="followId" width="90" />
      <el-table-column label="关注者ID" align="center" prop="followerId" width="90" />
      <el-table-column label="关注者姓名" align="center" prop="followerName" min-width="120" show-overflow-tooltip />
      <el-table-column label="被关注者ID" align="center" prop="followeeId" width="110" />
      <el-table-column label="被关注者姓名" align="center" prop="followeeName" min-width="120" show-overflow-tooltip />
      <el-table-column label="关注时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:communityFollow:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:communityFollow:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改社区关注对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="communityFollowRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="关注者ID" prop="followerId">
              <el-input v-model="form.followerId" placeholder="请输入关注者ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关注者姓名" prop="followerName">
              <el-input v-model="form.followerName" placeholder="请输入关注者姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被关注者ID" prop="followeeId">
              <el-input v-model="form.followeeId" placeholder="请输入被关注者ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被关注者姓名" prop="followeeName">
              <el-input v-model="form.followeeName" placeholder="请输入被关注者姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关注者头像" prop="followerAvatar">
              <el-input v-model="form.followerAvatar" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="被关注者头像" prop="followeeAvatar">
              <image-upload v-model="form.followeeAvatar" />
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

<script setup name="CommunityFollow">
import { listCommunityFollow, getCommunityFollow, delCommunityFollow, addCommunityFollow, updateCommunityFollow } from "@/api/edu/communityFollow"

const { proxy } = getCurrentInstance()

const communityFollowList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeCreateTime = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    followerId: null,
    followerName: null,
    followeeId: null,
    followeeName: null,
    createTime: null
  },
  rules: {
    followerId: [
      { required: true, message: "关注者ID不能为空", trigger: "blur" }
    ],
    followeeId: [
      { required: true, message: "被关注者ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询社区关注列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
  }
  listCommunityFollow(queryParams.value).then(response => {
    communityFollowList.value = response.rows
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
    followId: null,
    followerId: null,
    followerName: null,
    followerAvatar: null,
    followeeId: null,
    followeeName: null,
    followeeAvatar: null,
    createTime: null
  }
  proxy.resetForm("communityFollowRef")
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
  ids.value = selection.map(item => item.followId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加社区关注"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _followId = row.followId || ids.value
  getCommunityFollow(_followId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改社区关注"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["communityFollowRef"].validate(valid => {
    if (valid) {
      if (form.value.followId != null) {
        updateCommunityFollow(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCommunityFollow(form.value).then(response => {
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
  const _followIds = row.followId || ids.value
  proxy.$modal.confirm('是否确认删除社区关注编号为"' + _followIds + '"的数据项？').then(function () {
    return delCommunityFollow(_followIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/communityFollow/export', {
    ...queryParams.value
  }, `communityFollow_${new Date().getTime()}.xlsx`)
}

getList()
</script>
