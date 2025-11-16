<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学校代码" prop="schoolCode">
            <el-input v-model="queryParams.schoolCode" placeholder="请输入学校代码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学校名称" prop="schoolName">
            <el-input v-model="queryParams.schoolName" placeholder="请输入学校名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学校类型" prop="schoolType">
            <el-select v-model="queryParams.schoolType" placeholder="请选择学校类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_school_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所在省份" prop="province">
            <el-input v-model="queryParams.province" placeholder="请输入所在省份" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所在城市" prop="city">
            <el-input v-model="queryParams.city" placeholder="请输入所在城市" clearable @keyup.enter="handleQuery" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:school:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:school:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:school:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:school:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="schoolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学校代码" align="center" prop="schoolCode" />
      <el-table-column label="学校名称" align="center" prop="schoolName" />
      <el-table-column label="学校类型" align="center" prop="schoolType">
        <template #default="scope">
          <dict-tag :options="edu_school_type" :value="scope.row.schoolType" />
        </template>
      </el-table-column>
      <el-table-column label="所在省份" align="center" prop="province" />
      <el-table-column label="所在城市" align="center" prop="city" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:school:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:school:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改学校信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="schoolRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学校代码" prop="schoolCode">
              <el-input v-model="form.schoolCode" placeholder="请输入学校代码（唯一标识）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校名称" prop="schoolName">
              <el-input v-model="form.schoolName" placeholder="请输入学校名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="学校英文名称" prop="schoolNameEn">
              <el-input v-model="form.schoolNameEn" placeholder="请输入学校英文名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校类型" prop="schoolType">
              <el-select v-model="form.schoolType" placeholder="请选择学校类型" style="width: 100%;">
                <el-option v-for="dict in edu_school_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="学校层次" prop="schoolLevel">
              <el-select v-model="form.schoolLevel" placeholder="请选择学校层次" style="width: 100%;">
                <el-option v-for="dict in edu_school_level" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办学性质" prop="schoolNature">
              <el-select v-model="form.schoolNature" placeholder="请选择办学性质" style="width: 100%;">
                <el-option v-for="dict in edu_school_nature" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="8">
            <el-form-item label="所在省份" prop="province">
              <el-input v-model="form.province" placeholder="请输入所在省份" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在城市" prop="city">
              <el-input v-model="form.city" placeholder="请输入所在城市" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在区县" prop="district">
              <el-input v-model="form.district" placeholder="请输入所在区县" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="16">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="form.postalCode" placeholder="请输入邮政编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude" placeholder="请输入经度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude" placeholder="请输入纬度" />
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
          <el-col :span="24">
            <el-form-item label="官方网站" prop="website">
              <el-input v-model="form.website" placeholder="请输入官方网站" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="8">
            <el-form-item label="建校日期" prop="establishedDate">
              <el-date-picker clearable v-model="form.establishedDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择建校日期" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="校长姓名" prop="principal">
              <el-input v-model="form.principal" placeholder="请输入校长姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="党委书记" prop="partySecretary">
              <el-input v-model="form.partySecretary" placeholder="请输入党委书记" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="在校学生数" prop="studentCount">
              <el-input v-model="form.studentCount" placeholder="请输入在校学生数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教职工数" prop="teacherCount">
              <el-input v-model="form.teacherCount" placeholder="请输入教职工数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="校徽图片URL" prop="logoUrl">
              <el-input v-model="form.logoUrl" placeholder="请输入校徽图片URL" />
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
            <el-form-item label="学校简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入学校简介" />
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

<script setup name="School">
import { listSchool, getSchool, delSchool, addSchool, updateSchool } from "@/api/edu/school"

const { proxy } = getCurrentInstance()
const { edu_school_type, edu_school_level, edu_school_nature, sys_normal_disable } = proxy.useDict('edu_school_type', 'edu_school_level', 'edu_school_nature', 'sys_normal_disable')

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
    schoolCode: null,
    schoolName: null,
    schoolType: null,
    province: null,
    city: null,
    status: null,
  },
  rules: {
    schoolCode: [
      { required: true, message: "学校代码不能为空", trigger: "blur" }
    ],
    schoolName: [
      { required: true, message: "学校名称不能为空", trigger: "blur" }
    ],
    schoolType: [
      { required: true, message: "学校类型不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询学校信息列表 */
function getList() {
  loading.value = true
  listSchool(queryParams.value).then(response => {
    schoolList.value = response.rows
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
    schoolId: null,
    schoolCode: null,
    schoolName: null,
    schoolNameEn: null,
    schoolType: null,
    schoolLevel: null,
    schoolNature: null,
    province: null,
    city: null,
    district: null,
    address: null,
    postalCode: null,
    longitude: null,
    latitude: null,
    contactPhone: null,
    contactEmail: null,
    website: null,
    establishedDate: null,
    principal: null,
    partySecretary: null,
    studentCount: null,
    teacherCount: null,
    logoUrl: null,
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
  proxy.resetForm("schoolRef")
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
  ids.value = selection.map(item => item.schoolId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加学校信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _schoolId = row.schoolId || ids.value
  getSchool(_schoolId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改学校信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["schoolRef"].validate(valid => {
    if (valid) {
      if (form.value.schoolId != null) {
        updateSchool(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSchool(form.value).then(response => {
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
  const _schoolIds = row.schoolId || ids.value
  proxy.$modal.confirm('是否确认删除学校信息编号为"' + _schoolIds + '"的数据项？').then(function () {
    return delSchool(_schoolIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/school/export', {
    ...queryParams.value
  }, `school_${new Date().getTime()}.xlsx`)
}

getList()
</script>
