<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="所属学院" prop="collegeId">
            <el-select v-model="queryParams.collegeId" placeholder="请选择学院" clearable filterable style="width: 100%;">
              <el-option v-for="college in queryCollegeList" :key="college.collegeId" :label="college.collegeName"
                :value="college.collegeId"></el-option>
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
      <el-table-column label="所属学院" align="center" prop="collegeName" width="140" />
      <el-table-column label="专业名称" align="center" prop="majorName" min-width="120" />
      <el-table-column label="学制年限" align="center" prop="educationYears" width="100" />
      <el-table-column label="授予学位" align="center" prop="degreeName" width="120" />
      <el-table-column label="学费" align="center" prop="tuitionFee" width="100" />
      <el-table-column label="就业方向" align="center" prop="careerDirection" min-width="150" show-overflow-tooltip />
      <el-table-column label="专业简介" align="center" prop="introduction" min-width="200" show-overflow-tooltip />
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
          <el-col :span="24">
            <el-form-item label="所属学院" prop="collegeId">
              <el-select v-model="form.collegeId" placeholder="请选择所属学院" clearable filterable style="width: 100%;">
                <el-option v-for="college in collegeList" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId"></el-option>
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
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="就业方向" prop="careerDirection">
              <el-input v-model="form.careerDirection" type="textarea" :rows="3" placeholder="请输入就业方向" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="专业简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" :rows="4" placeholder="请输入专业简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
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
    collegeId: null,
  },
  rules: {
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
  // 自动添加学校ID到查询参数
  const params = {
    ...queryParams.value,
    schoolId: currentSchoolId.value
  }
  listMajor(params).then(response => {
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
  // 只获取当前学校的学院
  const params = {
    pageNum: 1,
    pageSize: 1000,
    schoolId: currentSchoolId.value
  }
  listCollege(params).then(response => {
    allCollegeList.value = response.rows
    collegeList.value = response.rows
    queryCollegeList.value = response.rows
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
    majorId: null,
    schoolId: currentSchoolId.value, // 自动填充当前用户的学校ID
    collegeId: null,
    majorName: null,
    educationYears: 4,
    degreeName: null,
    tuitionFee: null,
    careerDirection: null,
    introduction: null,
    status: "0"
  }
  proxy.resetForm("majorRef")
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
    // 确保学校ID是当前用户的学校ID
    form.value.schoolId = currentSchoolId.value
    open.value = true
    title.value = "修改专业信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["majorRef"].validate(valid => {
    if (valid) {
      // 确保提交时包含学校ID
      form.value.schoolId = currentSchoolId.value

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
getList()
getCollegeList()
</script>
