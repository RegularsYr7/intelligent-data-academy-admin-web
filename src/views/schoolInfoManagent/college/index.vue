<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择学校" clearable filterable
              @change="handleSchoolQueryChange">
              <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName"
                :value="item.schoolId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学院名称" prop="collegeId">
            <el-select v-model="queryParams.collegeId" :placeholder="queryParams.schoolId ? '请选择学院' : '请先选择学校'"
              :disabled="!queryParams.schoolId" clearable filterable @change="handleQuery">
              <el-option v-for="item in filteredCollegeListForQuery" :key="item.collegeId" :label="item.collegeName"
                :value="item.collegeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="院长名称" prop="deanName">
            <el-input v-model="queryParams.deanName" placeholder="请输入院长名称" clearable @keyup.enter="handleQuery" />
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
      <el-table-column label="ID" align="center" prop="collegeId" width="80" />
      <el-table-column label="所属学校" align="center" prop="schoolName" min-width="120" />
      <el-table-column label="学院名称" align="center" prop="collegeName" min-width="120" />
      <el-table-column label="院长名称" align="center" prop="deanName" width="120" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
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
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="collegeRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择学校" filterable clearable style="width: 100%;">
                <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName"
                  :value="item.schoolId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="学院名称" prop="collegeName">
              <el-input v-model="form.collegeName" placeholder="请输入学院名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="院长名称" prop="deanName">
              <el-input v-model="form.deanName" placeholder="请输入院长名称" clearable />
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

const collegeList = ref([])
const allCollegeList = ref([]) // 用于下拉框的完整学院列表
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
    collegeId: null,
    collegeName: null,
    deanName: null,
  },
  rules: {
    schoolId: [
      { required: true, message: "所属学校不能为空", trigger: "change" }
    ],
    collegeName: [
      { required: true, message: "学院名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询表单中根据学校筛选学院列表 */
const filteredCollegeListForQuery = computed(() => {
  if (!queryParams.value.schoolId) return []
  return allCollegeList.value.filter(item => item.schoolId === queryParams.value.schoolId)
})

/** 查询学院信息列表 */
function getList() {
  loading.value = true
  listCollege(queryParams.value).then(response => {
    collegeList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 获取全部学院列表（用于下拉框） */
function getAllCollegeList() {
  listCollege({ pageNum: 1, pageSize: 1000 }).then(response => {
    allCollegeList.value = response.rows
  })
}

/** 获取学校列表 */
function getSchoolList() {
  listSchool({ pageNum: 1, pageSize: 1000, status: '0' }).then(response => {
    schoolList.value = response.rows
  })
}

/** 查询表单学校变化时清空学院选择 */
function handleSchoolQueryChange() {
  queryParams.value.collegeId = null
  handleQuery()
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
    collegeName: null,
    deanName: null,
    introduction: null,
    sortOrder: 0
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

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加学院信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
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

// 初始化
getList()
getSchoolList()
getAllCollegeList()
</script>
