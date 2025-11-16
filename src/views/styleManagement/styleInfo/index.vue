<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="风采名称" prop="showcaseName">
            <el-input v-model="queryParams.showcaseName" placeholder="请输入风采名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="风采类型" prop="showcaseType">
            <el-select v-model="queryParams.showcaseType" placeholder="请选择风采类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_showcase_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="展示时间">
            <el-date-picker v-model="daterangeDisplayTime" value-format="YYYY-MM-DD" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="获奖时间" prop="awardTime">
            <el-date-picker clearable v-model="queryParams.awardTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择获奖时间" style="width: 100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="获奖级别" prop="awardLevel">
            <el-input v-model="queryParams.awardLevel" placeholder="请输入获奖级别" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属学校ID" prop="schoolId">
            <el-input v-model="queryParams.schoolId" placeholder="请输入所属学校ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否推荐" prop="isRecommended">
            <el-select v-model="queryParams.isRecommended" placeholder="请选择是否推荐" clearable style="width: 100%;">
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
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="创建时间">
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:showcase:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:showcase:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:showcase:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:showcase:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="showcaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="风采ID" align="center" prop="showcaseId" />
      <el-table-column label="风采名称" align="center" prop="showcaseName" />
      <el-table-column label="风采类型" align="center" prop="showcaseType">
        <template #default="scope">
          <dict-tag :options="edu_showcase_type" :value="scope.row.showcaseType" />
        </template>
      </el-table-column>
      <el-table-column label="展示时间" align="center" prop="displayTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.displayTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommended">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.isRecommended" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:showcase:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:showcase:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改风采展示信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="showcaseRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="风采名称" prop="showcaseName">
              <el-input v-model="form.showcaseName" placeholder="请输入风采名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风采类型" prop="showcaseType">
              <el-select v-model="form.showcaseType" placeholder="请选择风采类型" style="width: 100%;">
                <el-option v-for="dict in edu_showcase_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="展示时间" prop="displayTime">
              <el-date-picker clearable v-model="form.displayTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择展示时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖时间" prop="awardTime">
              <el-date-picker clearable v-model="form.awardTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择获奖时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="获奖级别" prop="awardLevel">
              <el-input v-model="form.awardLevel" placeholder="请输入获奖级别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颁发单位" prop="awardOrganization">
              <el-input v-model="form.awardOrganization" placeholder="请输入颁发单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="所属学校ID" prop="schoolId">
              <el-input v-model="form.schoolId" placeholder="请输入所属学校ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入显示顺序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="是否推荐" prop="isRecommended">
              <el-radio-group v-model="form.isRecommended">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
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
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="封面图片URL" prop="coverImageUrl">
              <image-upload v-model="form.coverImageUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="展示信息" prop="displayInfo">
              <el-input v-model="form.displayInfo" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="图片列表" prop="imageUrls">
              <el-input v-model="form.imageUrls" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频URL" prop="videoUrl">
              <el-input v-model="form.videoUrl" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="24">
            <el-form-item label="简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="24">
            <el-form-item label="详细介绍">
              <editor v-model="form.detailContent" :min-height="192" />
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

<script setup name="Showcase">
import { listShowcase, getShowcase, delShowcase, addShowcase, updateShowcase } from "@/api/edu/showcase"

const { proxy } = getCurrentInstance()
const { edu_showcase_type, sys_yes_no, sys_normal_disable } = proxy.useDict('edu_showcase_type', 'sys_yes_no', 'sys_normal_disable')

const showcaseList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeDisplayTime = ref([])
const daterangeCreateTime = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    showcaseName: null,
    showcaseType: null,
    displayTime: null,
    awardTime: null,
    awardLevel: null,
    schoolId: null,
    isRecommended: null,
    status: null,
    createTime: null,
  },
  rules: {
    showcaseName: [
      { required: true, message: "风采名称不能为空", trigger: "blur" }
    ],
    showcaseType: [
      { required: true, message: "风采类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询风采展示信息列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeDisplayTime && '' != daterangeDisplayTime) {
    queryParams.value.params["beginDisplayTime"] = daterangeDisplayTime.value[0]
    queryParams.value.params["endDisplayTime"] = daterangeDisplayTime.value[1]
  }
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
  }
  listShowcase(queryParams.value).then(response => {
    showcaseList.value = response.rows
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
    showcaseId: null,
    showcaseName: null,
    showcaseType: null,
    displayTime: null,
    viewCount: null,
    likeCount: null,
    displayInfo: null,
    introduction: null,
    detailContent: null,
    awardTime: null,
    awardLevel: null,
    awardOrganization: null,
    coverImageUrl: null,
    imageUrls: null,
    videoUrl: null,
    schoolId: null,
    isRecommended: null,
    sortOrder: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("showcaseRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeDisplayTime.value = []
  daterangeCreateTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.showcaseId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加风采展示信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _showcaseId = row.showcaseId || ids.value
  getShowcase(_showcaseId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改风采展示信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["showcaseRef"].validate(valid => {
    if (valid) {
      if (form.value.showcaseId != null) {
        updateShowcase(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addShowcase(form.value).then(response => {
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
  const _showcaseIds = row.showcaseId || ids.value
  proxy.$modal.confirm('是否确认删除风采展示信息编号为"' + _showcaseIds + '"的数据项？').then(function () {
    return delShowcase(_showcaseIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/showcase/export', {
    ...queryParams.value
  }, `showcase_${new Date().getTime()}.xlsx`)
}

getList()
</script>
