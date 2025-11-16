<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学院代码" prop="collegeCode">
            <el-input v-model="queryParams.collegeCode" placeholder="请输入学院代码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学院名称" prop="collegeName">
            <el-input v-model="queryParams.collegeName" placeholder="请输入学院名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学院类型" prop="collegeType">
            <el-select v-model="queryParams.collegeType" placeholder="请选择学院类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_school_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;">
            </el-date-picker>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:college:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:college:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:college:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:college:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="collegeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学院代码" align="center" prop="collegeCode" />
      <el-table-column label="学院名称" align="center" prop="collegeName" />
      <el-table-column label="学院类型" align="center" prop="collegeType">
        <template #default="scope">
          <dict-tag :options="edu_school_type" :value="scope.row.collegeType" />
        </template>
      </el-table-column>
      <el-table-column label="院长姓名" align="center" prop="deanName" />
      <el-table-column label="联系电话" align="center" prop="contactPhone" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:college:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:college:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改学院信息对话框 -->
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
      <el-form ref="collegeRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" clearable filterable style="width: 100%;">
                <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                  :value="school.schoolId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院代码" prop="collegeCode">
              <el-input v-model="form.collegeCode" placeholder="请输入学院代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="学院名称" prop="collegeName">
              <el-input v-model="form.collegeName" placeholder="请输入学院名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院英文名称" prop="collegeNameEn">
              <el-input v-model="form.collegeNameEn" placeholder="请输入学院英文名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="学院类型" prop="collegeType">
              <el-select v-model="form.collegeType" placeholder="请选择学院类型" style="width: 100%;">
                <el-option v-for="dict in edu_school_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父学院ID" prop="parentId">
              <el-input v-model="form.parentId" placeholder="请输入父学院ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="院长姓名" prop="deanName">
              <el-input v-model="form.deanName" placeholder="请输入院长姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="书记姓名" prop="secretaryName">
              <el-input v-model="form.secretaryName" placeholder="请输入书记姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
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
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="办公地点" prop="officeLocation">
              <el-input v-model="form.officeLocation" placeholder="请输入办公地点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成立日期" prop="establishedDate">
              <el-date-picker clearable v-model="form.establishedDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择成立日期" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="学生数量" prop="studentCount">
              <el-input v-model="form.studentCount" placeholder="请输入学生数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师数量" prop="teacherCount">
              <el-input v-model="form.teacherCount" placeholder="请输入教师数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入显示顺序" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
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

<script setup name="College">
import { listCollege, getCollege, delCollege, addCollege, updateCollege } from "@/api/edu/college"
import { listSchool } from "@/api/edu/school"

const { proxy } = getCurrentInstance()
const { edu_school_type } = proxy.useDict('edu_school_type')

const collegeList = ref([])
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
    collegeCode: null,
    collegeName: null,
    collegeType: null,
    status: null,
    createTime: null,
  },
  rules: {
    schoolId: [
      { required: true, message: "所属学校ID不能为空", trigger: "change" }
    ],
    collegeCode: [
      { required: true, message: "学院代码不能为空", trigger: "blur" }
    ],
    collegeName: [
      { required: true, message: "学院名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询学院信息列表 */
function getList() {
  loading.value = true
  listCollege(queryParams.value).then(response => {
    collegeList.value = response.rows
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
    collegeId: null,
    schoolId: null,
    collegeCode: null,
    collegeName: null,
    collegeNameEn: null,
    collegeType: null,
    parentId: null,
    ancestors: null,
    deanId: null,
    deanName: null,
    viceDeanNames: null,
    secretaryId: null,
    secretaryName: null,
    contactPhone: null,
    contactEmail: null,
    officeLocation: null,
    establishedDate: null,
    studentCount: null,
    teacherCount: null,
    majorCount: null,
    introduction: null,
    sortOrder: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("collegeRef")
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
  ids.value = selection.map(item => item.collegeId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 获取学校列表 */
function getSchoolList() {
  listSchool().then(response => {
    schoolList.value = response.rows
  })
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getSchoolList()
  open.value = true
  title.value = "添加学院信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getSchoolList()
  const _collegeId = row.collegeId || ids.value
  getCollege(_collegeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改学院信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["collegeRef"].validate(valid => {
    if (valid) {
      if (form.value.collegeId != null) {
        updateCollege(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCollege(form.value).then(response => {
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
  const _collegeIds = row.collegeId || ids.value
  proxy.$modal.confirm('是否确认删除学院信息编号为"' + _collegeIds + '"的数据项？').then(function () {
    return delCollege(_collegeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/college/export', {
    ...queryParams.value
  }, `college_${new Date().getTime()}.xlsx`)
}

getList()
</script>
