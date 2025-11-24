<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择所属学校" clearable filterable style="width: 100%;">
              <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                :value="school.schoolId" />
            </el-select>
          </el-form-item>
        </el-col>
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
          <el-form-item label="获奖级别" prop="awardLevel">
            <el-input v-model="queryParams.awardLevel" placeholder="请输入获奖级别" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">

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
      <el-table-column label="风采名称" align="center" prop="showcaseName" min-width="150" show-overflow-tooltip />
      <el-table-column label="风采类型" align="center" prop="showcaseType" width="120">
        <template #default="scope">
          <dict-tag :options="edu_showcase_type" :value="scope.row.showcaseType" />
        </template>
      </el-table-column>
      <el-table-column label="所属学校" align="center" prop="schoolName" min-width="120" show-overflow-tooltip />
      <el-table-column label="展示时间" align="center" prop="displayTime" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.displayTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="获奖级别" align="center" prop="awardLevel" width="120" />
      <el-table-column label="浏览量" align="center" prop="viewCount" width="100" />

      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" filterable style="width: 100%;">
                <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                  :value="school.schoolId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="展示时间" prop="displayTime">
              <el-date-picker clearable v-model="form.displayTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择展示时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="封面图片" prop="coverImageUrl">
              <image-upload v-model="form.coverImageUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片轮播图" prop="imageUrls">
              <image-upload v-model="form.imageUrls" :limit="9" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" :rows="3" placeholder="请输入简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="详细介绍">
              <editor v-model="form.detailContent" :min-height="192" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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
import { listSchool } from "@/api/edu/school"

const { proxy } = getCurrentInstance()
const { edu_showcase_type, sys_yes_no, sys_normal_disable } = proxy.useDict('edu_showcase_type', 'sys_yes_no', 'sys_normal_disable')

const showcaseList = ref([])
const schoolList = ref([])
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
    schoolId: null,
    showcaseName: null,
    showcaseType: null,
    awardLevel: null,
    isRecommended: null,
  },
  rules: {
    showcaseName: [
      { required: true, message: "风采名称不能为空", trigger: "blur" }
    ],
    showcaseType: [
      { required: true, message: "风采类型不能为空", trigger: "change" }
    ],
    schoolId: [
      { required: true, message: "所属学校不能为空", trigger: "change" }
    ],
    displayTime: [
      { required: true, message: "展示时间不能为空", trigger: "blur" }
    ],
    isRecommended: [
      { required: true, message: "是否推荐不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询学校列表 */
function getSchoolList() {
  listSchool({ pageNum: 1, pageSize: 1000, status: '0' }).then(response => {
    schoolList.value = response.rows
  })
}

/** 查询风采展示信息列表 */
function getList() {
  loading.value = true
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
    schoolId: null,
    displayTime: null,
    introduction: null,
    detailContent: null,
    coverImageUrl: null,
    imageUrls: null,
    isRecommended: null,
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

getSchoolList()
getList()
</script>
