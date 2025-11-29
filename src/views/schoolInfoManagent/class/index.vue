<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属学院" prop="collegeId">
            <el-select v-model="queryParams.collegeId" placeholder="请选择所属学院" clearable filterable style="width: 100%;">
              <el-option v-for="college in allCollegeList" :key="college.collegeId" :label="college.collegeName"
                :value="college.collegeId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属年级" prop="grade">
            <el-input v-model="queryParams.grade" placeholder="请输入年级，如2021级" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="辅导员姓名" prop="counselorName">
            <el-input v-model="queryParams.counselorName" placeholder="请输入辅导员姓名" clearable @keyup.enter="handleQuery" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:class:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:class:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:class:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:class:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="classId" width="80" />
      <el-table-column label="所属学院" align="center" prop="collegeName" min-width="120" />
      <el-table-column label="所属专业" align="center" prop="majorName" min-width="150" show-overflow-tooltip />
      <el-table-column label="班级名称" align="center" prop="className" min-width="120" />
      <el-table-column label="入学年份" align="center" prop="enrollmentYear" width="100" />
      <el-table-column label="辅导员姓名" align="center" width="120">
        <template #default="scope">
          <span v-if="scope.row.counselors && scope.row.counselors.length > 0">
            {{scope.row.counselors.map(c => c.nickName).join(', ')}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:class:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:class:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改班级信息对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="classRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="所属学院" prop="collegeId">
              <el-select v-model="form.collegeId" placeholder="请选择所属学院" clearable filterable style="width: 100%;"
                @change="handleCollegeChange">
                <el-option v-for="college in allCollegeList" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="所属专业" prop="majorId">
              <el-select v-model="form.majorId" placeholder="请先选择学院" clearable filterable style="width: 100%;"
                :disabled="!form.collegeId">
                <el-option v-for="major in majorList" :key="major.majorId" :label="major.majorName"
                  :value="major.majorId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="班级名称" prop="className">
              <el-input v-model="form.className" placeholder="请输入班级名称，如：软件工程1班" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="班级年级" prop="grade">
              <el-input v-model="form.grade" placeholder="请输入班级年级，如：2021级" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="入学年份" prop="grade">
              <el-date-picker v-model="form.grade" type="year" value-format="YYYY" placeholder="请选择入学年份"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="班级简介" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入班级简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
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

<script setup name="Class">
import { listClass, getClass, delClass, addClass, updateClass } from "@/api/edu/class"
import { listCollege } from "@/api/edu/college"
import { listMajor } from "@/api/edu/major"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const classList = ref([])
const allCollegeList = ref([])
const majorList = ref([])
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
    collegeId: null,
    grade: null,
    counselorName: null,
  },
  rules: {
    collegeId: [
      { required: true, message: "所属学院不能为空", trigger: "change" }
    ],
    majorId: [
      { required: true, message: "所属专业不能为空", trigger: "change" }
    ],
    className: [
      { required: true, message: "班级名称不能为空", trigger: "blur" }
    ],
    grade: [
      { required: true, message: "班级年级不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询班级信息列表 */
function getList() {
  loading.value = true
  listClass(queryParams.value).then(response => {
    classList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 获取学院列表 */
function getCollegeList() {
  listCollege({ pageNum: 1, pageSize: 1000 }).then(response => {
    allCollegeList.value = response.rows
  })
}

/** 获取专业列表 */
function getMajorList(collegeId) {
  if (!collegeId) {
    majorList.value = []
    return
  }
  listMajor({ pageNum: 1, pageSize: 1000, collegeId: collegeId }).then(response => {
    majorList.value = response.rows
  })
}

/** 学院变更时 */
function handleCollegeChange(collegeId) {
  form.value.majorId = null
  getMajorList(collegeId)
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    classId: null,
    collegeId: null,
    majorId: null,
    className: null,
    grade: null,
    enrollmentYear: null,
    classTeacherId: null,
    classTeacherName: null,
    description: null,
    sortOrder: 0,
    status: "0"
  }
  majorList.value = []
  proxy.resetForm("classRef")
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
  ids.value = selection.map(item => item.classId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getCollegeList()
  open.value = true
  title.value = "添加班级信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getCollegeList()
  const _classId = row.classId || ids.value
  getClass(_classId).then(response => {
    form.value = response.data
    // 如果有学院ID,加载对应的专业列表
    if (form.value.collegeId) {
      getMajorList(form.value.collegeId)
    }
    open.value = true
    title.value = "修改班级信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classRef"].validate(valid => {
    if (valid) {
      if (form.value.classId != null) {
        updateClass(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addClass(form.value).then(response => {
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
  const _classIds = row.classId || ids.value
  proxy.$modal.confirm('是否确认删除班级信息编号为"' + _classIds + '"的数据项？').then(function () {
    return delClass(_classIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/class/export', {
    ...queryParams.value
  }, `class_${new Date().getTime()}.xlsx`)
}

getList()
getCollegeList()
</script>
