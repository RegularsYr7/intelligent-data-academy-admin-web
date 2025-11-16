<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属班级ID" prop="classId">
            <el-input v-model="queryParams.classId" placeholder="请输入所属班级ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程代码" prop="courseCode">
            <el-input v-model="queryParams.courseCode" placeholder="请输入课程代码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="queryParams.courseName" placeholder="请输入课程名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程类型" prop="courseType">
            <el-select v-model="queryParams.courseType" placeholder="请选择课程类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_course_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="授课教师姓名" prop="teacherName">
            <el-input v-model="queryParams.teacherName" placeholder="请输入授课教师姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上课地点" prop="classroom">
            <el-input v-model="queryParams.classroom" placeholder="请输入上课地点" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="星期几" prop="weekDay">
            <el-input v-model="queryParams.weekDay" placeholder="请输入星期几" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="时间段" prop="timeSlot">
            <el-input v-model="queryParams.timeSlot" placeholder="请输入时间段" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="周次类型" prop="weekType">
            <el-select v-model="queryParams.weekType" placeholder="请选择周次类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_week_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学期" prop="semester">
            <el-input v-model="queryParams.semester" placeholder="请输入学期" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学年" prop="academicYear">
            <el-input v-model="queryParams.academicYear" placeholder="请输入学年" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:schedule:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:schedule:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:schedule:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:schedule:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scheduleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="课程名称" align="center" prop="courseName" show-overflow-tooltip />
      <el-table-column label="课程类型" align="center" prop="courseType" width="100">
        <template #default="scope">
          <dict-tag :options="edu_course_type" :value="scope.row.courseType" />
        </template>
      </el-table-column>
      <el-table-column label="授课教师" align="center" prop="teacherName" width="100" show-overflow-tooltip />
      <el-table-column label="上课时间" align="center" prop="weekDay" width="250" show-overflow-tooltip>
        <template #default="scope">
          <span style="display: inline-flex; align-items: center; gap: 4px;">
            <dict-tag :options="edu_week_day" :value="scope.row.weekDay" />
            <dict-tag :options="edu_time_slot" :value="scope.row.timeSlot" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="上课地点" align="center" prop="classroom" show-overflow-tooltip />
      <el-table-column label="学期" align="center" prop="semester" show-overflow-tooltip />
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:schedule:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:schedule:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改课信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="scheduleRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校">
              <el-select v-model="tempSchoolId" placeholder="请选择所属学校" clearable filterable @change="handleSchoolChange"
                style="width: 100%;">
                <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                  :value="school.schoolId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学院">
              <el-select v-model="tempCollegeId" placeholder="请选择所属学院" clearable filterable
                @change="handleCollegeChange" style="width: 100%;">
                <el-option v-for="college in collegeList" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属专业">
              <el-select v-model="tempMajorId" placeholder="请选择所属专业" clearable filterable @change="handleMajorChange"
                style="width: 100%;">
                <el-option v-for="major in majorList" :key="major.majorId" :label="major.majorName"
                  :value="major.majorId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属班级" prop="classId">
              <el-select v-model="form.classId" placeholder="请选择所属班级" clearable filterable style="width: 100%;">
                <el-option v-for="cls in classList" :key="cls.classId" :label="cls.className"
                  :value="cls.classId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程代码" prop="courseCode">
              <el-input v-model="form.courseCode" placeholder="请输入课程代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="form.courseName" placeholder="请输入课程名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程英文名称" prop="courseNameEn">
              <el-input v-model="form.courseNameEn" placeholder="请输入课程英文名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="courseType">
              <el-select v-model="form.courseType" placeholder="请选择课程类型" style="width: 100%;">
                <el-option v-for="dict in edu_course_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="授课教师ID" prop="teacherId">
              <el-input v-model="form.teacherId" placeholder="请输入授课教师ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课教师姓名" prop="teacherName">
              <el-input v-model="form.teacherName" placeholder="请输入授课教师姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上课地点" prop="classroom">
              <el-input v-model="form.classroom" placeholder="请输入上课地点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="星期几" prop="weekDay">
              <el-input v-model="form.weekDay" placeholder="请输入星期几" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时间段" prop="timeSlot">
              <el-input v-model="form.timeSlot" placeholder="请输入时间段" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始周次" prop="startWeek">
              <el-input v-model="form.startWeek" placeholder="请输入开始周次" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="结束周次" prop="endWeek">
              <el-input v-model="form.endWeek" placeholder="请输入结束周次" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周次类型" prop="weekType">
              <el-select v-model="form.weekType" placeholder="请选择周次类型" style="width: 100%;">
                <el-option v-for="dict in edu_week_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学期" prop="semester">
              <el-input v-model="form.semester" placeholder="请输入学期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学年" prop="academicYear">
              <el-input v-model="form.academicYear" placeholder="请输入学年" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学分" prop="credits">
              <el-input v-model="form.credits" placeholder="请输入学分" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学时" prop="hours">
              <el-input v-model="form.hours" placeholder="请输入学时" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入显示顺序" />
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

<script setup name="Schedule">
import { listSchedule, getSchedule, delSchedule, addSchedule, updateSchedule } from "@/api/edu/schedule"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"
import { listMajor } from "@/api/edu/major"
import { listClass } from "@/api/edu/class"

const { proxy } = getCurrentInstance()
const { edu_course_type, edu_week_type, edu_week_day, edu_time_slot } = proxy.useDict('edu_course_type', 'edu_week_type', 'edu_week_day', 'edu_time_slot')

const scheduleList = ref([])
const schoolList = ref([])
const collegeList = ref([])
const majorList = ref([])
const classList = ref([])
const allCollegeList = ref([])
const allMajorList = ref([])
const allClassList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 用于级联选择的临时变量（不提交到后端）
const tempSchoolId = ref(null)
const tempCollegeId = ref(null)
const tempMajorId = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    classId: null,
    courseCode: null,
    courseName: null,
    courseType: null,
    teacherName: null,
    classroom: null,
    weekDay: null,
    timeSlot: null,
    weekType: null,
    semester: null,
    academicYear: null,
    status: null,
    createTime: null,
  },
  rules: {
    classId: [
      { required: true, message: "所属班级ID不能为空", trigger: "blur" }
    ],
    courseName: [
      { required: true, message: "课程名称不能为空", trigger: "blur" }
    ],
    courseType: [
      { required: true, message: "课程类型不能为空", trigger: "change" }
    ],
    teacherName: [
      { required: true, message: "授课教师姓名不能为空", trigger: "blur" }
    ],
    classroom: [
      { required: true, message: "上课地点不能为空", trigger: "blur" }
    ],
    weekDay: [
      { required: true, message: "星期几不能为空", trigger: "blur" }
    ],
    timeSlot: [
      { required: true, message: "时间段不能为空", trigger: "blur" }
    ],
    startWeek: [
      { required: true, message: "开始周次不能为空", trigger: "blur" }
    ],
    endWeek: [
      { required: true, message: "结束周次不能为空", trigger: "blur" }
    ],
    weekType: [
      { required: true, message: "周次类型不能为空", trigger: "change" }
    ],
    semester: [
      { required: true, message: "学期不能为空", trigger: "blur" }
    ],
    academicYear: [
      { required: true, message: "学年不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询课信息列表 */
function getList() {
  loading.value = true
  listSchedule(queryParams.value).then(response => {
    scheduleList.value = response.rows
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
    scheduleId: null,
    classId: null,
    courseCode: null,
    courseName: null,
    courseNameEn: null,
    courseType: null,
    teacherId: null,
    teacherName: null,
    classroom: null,
    weekDay: null,
    timeSlot: null,
    startWeek: null,
    endWeek: null,
    weekType: null,
    semester: null,
    academicYear: null,
    credits: null,
    hours: null,
    sortOrder: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("scheduleRef")
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
  ids.value = selection.map(item => item.scheduleId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 获取学校列表 */
function getSchoolList() {
  listSchool().then(response => {
    schoolList.value = response.rows
  })
}

/** 获取学院列表 */
function getCollegeList() {
  listCollege().then(response => {
    allCollegeList.value = response.rows
    collegeList.value = response.rows
  })
}

/** 获取专业列表 */
function getMajorList() {
  listMajor().then(response => {
    allMajorList.value = response.rows
    majorList.value = response.rows
  })
}

/** 获取班级列表 */
function getClassList() {
  listClass().then(response => {
    allClassList.value = response.rows
    classList.value = response.rows
  })
}

/** 学校改变时筛选学院 */
function handleSchoolChange(schoolId) {
  tempCollegeId.value = null
  tempMajorId.value = null
  form.value.classId = null
  if (schoolId) {
    collegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
    majorList.value = []
    classList.value = []
  } else {
    collegeList.value = allCollegeList.value
    majorList.value = allMajorList.value
    classList.value = allClassList.value
  }
}

/** 学院改变时筛选专业 */
function handleCollegeChange(collegeId) {
  tempMajorId.value = null
  form.value.classId = null
  if (collegeId) {
    majorList.value = allMajorList.value.filter(major => major.collegeId === collegeId)
    classList.value = []
  } else if (tempSchoolId.value) {
    const schoolCollegeIds = collegeList.value.map(c => c.collegeId)
    majorList.value = allMajorList.value.filter(major => schoolCollegeIds.includes(major.collegeId))
    classList.value = allClassList.value
  } else {
    majorList.value = allMajorList.value
    classList.value = allClassList.value
  }
}

/** 专业改变时筛选班级 */
function handleMajorChange(majorId) {
  form.value.classId = null
  if (majorId) {
    classList.value = allClassList.value.filter(cls => cls.majorId === majorId)
  } else if (tempCollegeId.value) {
    const collegeMajorIds = majorList.value.map(m => m.majorId)
    classList.value = allClassList.value.filter(cls => collegeMajorIds.includes(cls.majorId))
  } else {
    classList.value = allClassList.value
  }
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  // 重置级联选择的临时变量
  tempSchoolId.value = null
  tempCollegeId.value = null
  tempMajorId.value = null
  // 加载数据
  getSchoolList()
  getCollegeList()
  getMajorList()
  getClassList()
  open.value = true
  title.value = "添加课信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getSchoolList()
  getCollegeList()
  getMajorList()
  getClassList()
  const _scheduleId = row.scheduleId || ids.value
  getSchedule(_scheduleId).then(response => {
    form.value = response.data
    // 根据已选班级反向查找并设置级联选择
    if (form.value.classId) {
      const selectedClass = allClassList.value.find(cls => cls.classId === form.value.classId)
      if (selectedClass && selectedClass.majorId) {
        tempMajorId.value = selectedClass.majorId
        classList.value = allClassList.value.filter(cls => cls.majorId === selectedClass.majorId)

        const selectedMajor = allMajorList.value.find(m => m.majorId === selectedClass.majorId)
        if (selectedMajor && selectedMajor.collegeId) {
          tempCollegeId.value = selectedMajor.collegeId
          majorList.value = allMajorList.value.filter(major => major.collegeId === selectedMajor.collegeId)

          const selectedCollege = allCollegeList.value.find(c => c.collegeId === selectedMajor.collegeId)
          if (selectedCollege && selectedCollege.schoolId) {
            tempSchoolId.value = selectedCollege.schoolId
            collegeList.value = allCollegeList.value.filter(college => college.schoolId === selectedCollege.schoolId)
          }
        }
      }
    }
    open.value = true
    title.value = "修改课信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["scheduleRef"].validate(valid => {
    if (valid) {
      if (form.value.scheduleId != null) {
        updateSchedule(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSchedule(form.value).then(response => {
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
  const _scheduleIds = row.scheduleId || ids.value
  proxy.$modal.confirm('是否确认删除课信息编号为"' + _scheduleIds + '"的数据项？').then(function () {
    return delSchedule(_scheduleIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/schedule/export', {
    ...queryParams.value
  }, `schedule_${new Date().getTime()}.xlsx`)
}

getList()
</script>
