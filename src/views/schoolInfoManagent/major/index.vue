<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择所属学校" clearable filterable
              @change="handleQuerySchoolChange" style="width: 100%;">
              <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName"
                :value="item.schoolId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属学院" prop="collegeId">
            <el-select v-model="queryParams.collegeId" :placeholder="queryParams.schoolId ? '请选择学院' : '请先选择学校'"
              :disabled="!queryParams.schoolId" clearable filterable style="width: 100%;">
              <el-option v-for="college in queryFilteredCollegeList" :key="college.collegeId"
                :label="college.collegeName" :value="college.collegeId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:major:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:major:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:major:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:major:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="majorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="majorId" width="80" />
      <el-table-column label="所属学校" align="center" prop="schoolName" width="140" />
      <el-table-column label="所属学院" align="center" prop="collegeName" width="220" />
      <el-table-column label="专业名称" align="center" prop="majorName" min-width="120" />
      <el-table-column label="学制年限" align="center" prop="educationYears" width="100" />
      <el-table-column label="授予学位" align="center" prop="degreeName" width="120" />
      <el-table-column label="学费" align="center" prop="tuitionFee" width="100" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:major:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:major:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改专业信息对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="majorRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" clearable filterable
                @change="handleFormSchoolChange" style="width: 100%;">
                <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName"
                  :value="item.schoolId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学院" prop="collegeId">
              <el-select v-model="form.collegeId" :placeholder="form.schoolId ? '请选择所属学院' : '请先选择学校'"
                :disabled="!form.schoolId" clearable filterable style="width: 100%;">
                <el-option v-for="college in formFilteredCollegeList" :key="college.collegeId"
                  :label="college.collegeName" :value="college.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="专业名称" prop="majorName">
              <el-input v-model="form.majorName" placeholder="请输入专业名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学制年限" prop="educationYears">
              <el-input-number v-model="form.educationYears" :min="1" :max="8" controls-position="right"
                style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授予学位" prop="degreeName">
              <el-input v-model="form.degreeName" placeholder="请输入授予学位，如：工学学士" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="学费" prop="tuitionFee">
              <el-input v-model="form.tuitionFee" placeholder="请输入学费，如：5000元/年">
                <template #append>元/年</template>
              </el-input>
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

<script setup name="Major">
import { listMajor, getMajor, delMajor, addMajor, updateMajor } from "@/api/edu/major"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"
import useUserStore from '@/store/modules/user'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const userStore = useUserStore()

const majorList = ref([])
const schoolList = ref([])
const collegeList = ref([])
const allCollegeList = ref([])
const queryCollegeList = ref([])
const queryFilteredCollegeList = ref([])
const formFilteredCollegeList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 从用户信息中获取学校ID
const currentSchoolId = computed(() => userStore.schoolInfo?.schoolId || null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    schoolId: null,
    collegeId: null,
  },
  rules: {
    schoolId: [
      { required: true, message: "所属学校不能为空", trigger: "change" }
    ],
    collegeId: [
      { required: true, message: "所属学院不能为空", trigger: "change" }
    ],
    majorName: [
      { required: true, message: "专业名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询专业信息列表 */
function getList() {
  loading.value = true
  // 使用搜索栏的查询参数
  listMajor(queryParams.value).then(response => {
    majorList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 获取学校列表 */
function getSchoolList() {
  listSchool({ pageNum: 1, pageSize: 1000 }).then(response => {
    schoolList.value = response.rows
  })
}

/** 获取学院列表 */
function getCollegeList() {
  // 获取所有学院用于层级选择
  const params = {
    pageNum: 1,
    pageSize: 1000
  }
  listCollege(params).then(response => {
    allCollegeList.value = response.rows
    collegeList.value = response.rows
    queryCollegeList.value = response.rows
    // 初始化筛选列表
    queryFilteredCollegeList.value = response.rows
    formFilteredCollegeList.value = response.rows
  })
}

/** 搜索栏-学校变化时处理 */
function handleQuerySchoolChange(schoolId) {
  // 清空学院选择
  queryParams.value.collegeId = null
  // 根据学校ID筛选学院列表
  if (schoolId) {
    queryFilteredCollegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
  } else {
    queryFilteredCollegeList.value = allCollegeList.value
  }
}

/** 表单-学校变化时处理 */
function handleFormSchoolChange(schoolId) {
  // 清空学院选择
  form.value.collegeId = null
  // 根据学校ID筛选学院列表
  if (schoolId) {
    formFilteredCollegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
  } else {
    formFilteredCollegeList.value = allCollegeList.value
  }
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    majorId: null,
    schoolId: null,
    collegeId: null,
    majorName: null,
    educationYears: 4,
    degreeName: null,
    tuitionFee: null,
    careerDirection: null,
    introduction: null,
    status: "0"
  }
  // 重置筛选列表
  formFilteredCollegeList.value = allCollegeList.value
  proxy.resetForm("majorRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.schoolId = null
  queryParams.value.collegeId = null
  queryFilteredCollegeList.value = allCollegeList.value
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.majorId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加专业信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _majorId = row.majorId || ids.value
  getMajor(_majorId).then(response => {
    form.value = response.data
    // 根据学校ID筛选学院列表
    if (form.value.schoolId) {
      formFilteredCollegeList.value = allCollegeList.value.filter(college => college.schoolId === form.value.schoolId)
    }
    open.value = true
    title.value = "修改专业信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["majorRef"].validate(valid => {
    if (valid) {
      // schoolId已通过表单层级选择获得，无需额外处理

      if (form.value.majorId != null) {
        updateMajor(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMajor(form.value).then(response => {
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
  const _majorIds = row.majorId || ids.value
  proxy.$modal.confirm('是否确认删除专业信息编号为"' + _majorIds + '"的数据项？').then(function () {
    return delMajor(_majorIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/major/export', {
    ...queryParams.value
  }, `major_${new Date().getTime()}.xlsx`)
}

// 初始化
getSchoolList()
getCollegeList()
getList()
</script>
