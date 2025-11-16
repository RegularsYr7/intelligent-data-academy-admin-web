<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="目标类型" prop="targetType">
            <el-select v-model="queryParams.targetType" placeholder="请选择目标类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_community_target_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目标ID" prop="targetId">
            <el-input v-model="queryParams.targetId" placeholder="请输入目标ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="点赞人ID" prop="studentId">
            <el-input v-model="queryParams.studentId" placeholder="请输入点赞人ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="点赞人姓名" prop="studentName">
            <el-input v-model="queryParams.studentName" placeholder="请输入点赞人姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="点赞时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择点赞时间" style="width: 100%;">
            </el-date-picker>
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
          v-hasPermi="['edu:communityLike:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:communityLike:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:communityLike:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:communityLike:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="communityLikeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="点赞ID" align="center" prop="likeId" width="90" />
      <el-table-column label="目标类型" align="center" prop="targetType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_community_target_type" :value="scope.row.targetType" />
        </template>
      </el-table-column>
      <el-table-column label="目标ID" align="center" prop="targetId" width="90" />
      <el-table-column label="点赞人ID" align="center" prop="studentId" width="90" />
      <el-table-column label="点赞人姓名" align="center" prop="studentName" min-width="120" show-overflow-tooltip />
      <el-table-column label="点赞时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:communityLike:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:communityLike:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改社区点赞对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="communityLikeRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="目标类型" prop="targetType">
              <el-select v-model="form.targetType" placeholder="请选择目标类型" style="width: 100%">
                <el-option v-for="dict in edu_community_target_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标ID" prop="targetId">
              <el-input v-model="form.targetId" placeholder="请输入目标ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点赞人ID" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入点赞人ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点赞人姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入点赞人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="点赞人头像" prop="studentAvatar">
              <image-upload v-model="form.studentAvatar" />
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

<script setup name="CommunityLike">
import { listCommunityLike, getCommunityLike, delCommunityLike, addCommunityLike, updateCommunityLike } from "@/api/edu/communityLike"

const { proxy } = getCurrentInstance()
const { edu_community_target_type } = proxy.useDict('edu_community_target_type')

const communityLikeList = ref([])
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
    targetType: null,
    targetId: null,
    studentId: null,
    studentName: null,
    createTime: null
  },
  rules: {
    targetType: [
      { required: true, message: "目标类型不能为空", trigger: "change" }
    ],
    targetId: [
      { required: true, message: "目标ID不能为空", trigger: "blur" }
    ],
    studentId: [
      { required: true, message: "点赞人ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询社区点赞列表 */
function getList() {
  loading.value = true
  listCommunityLike(queryParams.value).then(response => {
    communityLikeList.value = response.rows
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
    likeId: null,
    targetType: null,
    targetId: null,
    studentId: null,
    studentName: null,
    studentAvatar: null,
    createTime: null
  }
  proxy.resetForm("communityLikeRef")
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
  ids.value = selection.map(item => item.likeId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加社区点赞"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _likeId = row.likeId || ids.value
  getCommunityLike(_likeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改社区点赞"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["communityLikeRef"].validate(valid => {
    if (valid) {
      if (form.value.likeId != null) {
        updateCommunityLike(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCommunityLike(form.value).then(response => {
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
  const _likeIds = row.likeId || ids.value
  proxy.$modal.confirm('是否确认删除社区点赞编号为"' + _likeIds + '"的数据项？').then(function () {
    return delCommunityLike(_likeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/communityLike/export', {
    ...queryParams.value
  }, `communityLike_${new Date().getTime()}.xlsx`)
}

getList()
</script>
