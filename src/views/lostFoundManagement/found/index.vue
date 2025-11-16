<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="标题" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" prop="itemTag">
            <el-select v-model="queryParams.itemTag" placeholder="请选择标签" clearable style="width: 100%;">
              <el-option v-for="dict in edu_lost_found_tag" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="itemStatus">
            <el-select v-model="queryParams.itemStatus" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in edu_lost_found_status" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="失物时间/拾得时间">
            <el-date-picker v-model="daterangeLostTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="queryParams.contactPhone" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否置顶" prop="isTop">
            <el-input v-model="queryParams.isTop" placeholder="请输入是否置顶" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否已解决" prop="isResolved">
            <el-input v-model="queryParams.isResolved" placeholder="请输入是否已解决" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="解决时间">
            <el-date-picker v-model="daterangeResolveTime" value-format="YYYY-MM-DD" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:found:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:found:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:found:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:found:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="foundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="标题" align="center" prop="title" min-width="150" show-overflow-tooltip />
      <el-table-column label="标签" align="center" prop="itemTag" width="100">
        <template #default="scope">
          <dict-tag :options="edu_lost_found_tag" :value="scope.row.itemTag" />
        </template>
      </el-table-column>
      <el-table-column label="物品类型" align="center" prop="itemType" min-width="100" show-overflow-tooltip />
      <el-table-column label="状态" align="center" prop="itemStatus" width="100">
        <template #default="scope">
          <dict-tag :options="edu_lost_found_status" :value="scope.row.itemStatus" />
        </template>
      </el-table-column>
      <el-table-column label="地点" align="center" prop="location" min-width="120" show-overflow-tooltip />
      <el-table-column label="联系电话" align="center" prop="contactPhone" width="120" show-overflow-tooltip />
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:found:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:found:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改失物招领信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="foundRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签" prop="itemTag">
              <el-radio-group v-model="form.itemTag">
                <el-radio v-for="dict in edu_lost_found_tag" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="失物时间/拾得时间" prop="lostTime">
              <el-date-picker clearable v-model="form.lostTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择失物时间/拾得时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人姓名" prop="contactName">
              <el-input v-model="form.contactName" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信号" prop="contactWechat">
              <el-input v-model="form.contactWechat" placeholder="请输入微信号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否置顶" prop="isTop">
              <el-input v-model="form.isTop" placeholder="请输入是否置顶" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否已解决" prop="isResolved">
              <el-input v-model="form.isResolved" placeholder="请输入是否已解决" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="地点" prop="location">
              <el-input v-model="form.location" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="详情描述" prop="description">
              <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="图片URL" prop="imageUrl">
              <image-upload v-model="form.imageUrl" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="图片列表" prop="imageUrls">
              <el-input v-model="form.imageUrls" type="textarea" placeholder="请输入内容" />
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

<script setup name="Found">
import { listFound, getFound, delFound, addFound, updateFound } from "@/api/edu/found"

const { proxy } = getCurrentInstance()
const { edu_lost_found_status, edu_lost_found_tag } = proxy.useDict('edu_lost_found_status', 'edu_lost_found_tag')

const foundList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeLostTime = ref([])
const daterangeResolveTime = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    itemTag: null,
    itemType: null,
    itemStatus: null,
    lostTime: null,
    location: null,
    contactPhone: null,
    isTop: null,
    isResolved: null,
    resolveTime: null,
    status: null,
    createTime: null,
  },
  rules: {
    title: [
      { required: true, message: "标题不能为空", trigger: "blur" }
    ],
    itemTag: [
      { required: true, message: "标签不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询失物招领信息列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeLostTime && '' != daterangeLostTime) {
    queryParams.value.params["beginLostTime"] = daterangeLostTime.value[0]
    queryParams.value.params["endLostTime"] = daterangeLostTime.value[1]
  }
  if (null != daterangeResolveTime && '' != daterangeResolveTime) {
    queryParams.value.params["beginResolveTime"] = daterangeResolveTime.value[0]
    queryParams.value.params["endResolveTime"] = daterangeResolveTime.value[1]
  }
  listFound(queryParams.value).then(response => {
    foundList.value = response.rows
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
    itemId: null,
    title: null,
    itemTag: null,
    itemType: null,
    itemStatus: null,
    lostTime: null,
    location: null,
    description: null,
    imageUrl: null,
    imageUrls: null,
    contactName: null,
    contactPhone: null,
    contactWechat: null,
    isTop: null,
    isResolved: null,
    resolveTime: null,
    resolveRemark: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("foundRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeLostTime.value = []
  daterangeResolveTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.itemId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加失物招领信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _itemId = row.itemId || ids.value
  getFound(_itemId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改失物招领信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["foundRef"].validate(valid => {
    if (valid) {
      if (form.value.itemId != null) {
        updateFound(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFound(form.value).then(response => {
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
  const _itemIds = row.itemId || ids.value
  proxy.$modal.confirm('是否确认删除失物招领信息编号为"' + _itemIds + '"的数据项？').then(function () {
    return delFound(_itemIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/found/export', {
    ...queryParams.value
  }, `found_${new Date().getTime()}.xlsx`)
}

getList()
</script>
