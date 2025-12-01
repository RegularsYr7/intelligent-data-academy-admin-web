<template>
  <div class="app-container">
    <!-- 视图切换按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button label="schedule">课表视图</el-radio-button>
          <el-radio-button label="table">列表视图</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>

    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" ref="queryRef">
      <el-form-item label="学校">
        <el-select v-model="queryParams.schoolId" placeholder="请选择学校" clearable filterable @change="handleSchoolChange">
          <el-option v-for="item in schoolList" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId" />
        </el-select>
      </el-form-item>
      <el-form-item label="学院">
        <el-select v-model="queryParams.collegeId" :placeholder="queryParams.schoolId ? '请选择学院' : '请先选择学校'"
          :disabled="!queryParams.schoolId" clearable filterable @change="handleCollegeChange">
          <el-option v-for="item in filteredCollegeList" :key="item.collegeId" :label="item.collegeName"
            :value="item.collegeId" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="queryParams.classId" :placeholder="queryParams.collegeId ? '请选择班级' : '请先选择学院'"
          :disabled="!queryParams.collegeId" clearable filterable @change="handleClassChange">
          <el-option v-for="item in filteredClassList" :key="item.classId" :label="item.className"
            :value="item.classId" />
        </el-select>
      </el-form-item>
      <el-form-item label="学期">
        <el-select v-model="queryParams.semester" :placeholder="queryParams.classId ? '请选择学期' : '请先选择班级'"
          :disabled="!queryParams.classId" clearable filterable>
          <el-option v-for="item in filteredSemesterList" :key="item.semesterId" :label="item.semesterName"
            :value="item.semesterName" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="success" plain icon="Upload" @click="handleImport">导入</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表视图 -->
    <div v-if="viewMode === 'table'">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd()">新增</el-button>
          <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleBatchDelete">删除</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="scheduleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="课程名称" align="center" prop="courseName" />
        <el-table-column label="教师姓名" align="center" prop="teacherName" />
        <el-table-column label="上课地点" align="center" prop="classroom" />
        <el-table-column label="星期" align="center" prop="weekDay">
          <template #default="scope">
            {{ weekDays[scope.row.weekDay - 1] }}
          </template>
        </el-table-column>
        <el-table-column label="时间段" align="center" prop="timeSlot">
          <template #default="scope">
            {{ timeSlots[scope.row.timeSlot] }}
          </template>
        </el-table-column>
        <el-table-column label="周次范围" align="center">
          <template #default="scope">
            第{{ scope.row.startWeek }}-{{ scope.row.endWeek }}周
          </template>
        </el-table-column>
        <el-table-column label="周次类型" align="center" prop="weekType">
          <template #default="scope">
            {{ weekTypeMap[scope.row.weekType] || '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getScheduleList" />
    </div>

    <!-- 课表视图 -->
    <div v-if="viewMode === 'schedule' && hasData" class="schedule-container">
      <div class="week-selector">
        <el-button @click="changeWeek(-1)" :disabled="currentWeek <= 1">上一周</el-button>
        <div class="week-input-wrapper">
          <span>第</span>
          <el-input-number v-model="currentWeek" :min="1" :max="maxWeek" :controls="false" class="week-input"
            @change="handleWeekChange" />
          <span>周</span>
        </div>
        <el-button @click="changeWeek(1)" :disabled="currentWeek >= maxWeek">下一周</el-button>
      </div>

      <div class="schedule-table">
        <!-- 表头 -->
        <div class="schedule-header">
          <div class="header-cell time-col">时间</div>
          <div class="header-cell" v-for="day in weekDays" :key="day">{{ day }}</div>
        </div>
        <!-- 表体 -->
        <div class="schedule-body">
          <div v-for="(slotName, slotIndex) in timeSlots" :key="slotIndex" class="schedule-row">
            <div class="time-cell">{{ slotName }}</div>
            <div v-for="(day, dayIndex) in 7" :key="dayIndex" class="course-cell"
              @click="handleCellClick(dayIndex, slotIndex)">
              <div v-if="getCourse(currentWeek, dayIndex, slotIndex)" class="course-info">
                <div class="course-name">{{ getCourse(currentWeek, dayIndex, slotIndex).courseName }}</div>
                <div class="course-room">@{{ getCourse(currentWeek, dayIndex, slotIndex).classroom }}</div>
                <div class="course-teacher">{{ getCourse(currentWeek, dayIndex, slotIndex).teacherName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="viewMode === 'schedule' && searched" class="no-data">
      <el-empty description="暂无课程数据" />
    </div>
    <div v-else-if="viewMode === 'schedule'" class="no-data">
      <el-empty description="请选择学校、学院、班级和学期后点击查询" />
    </div>

    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="courseFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="班级" prop="classId" v-if="!form.scheduleId || viewMode === 'table'">
          <el-select v-model="form.classId" placeholder="请选择班级" filterable :disabled="viewMode === 'schedule'">
            <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId" />
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="semester" v-if="!form.scheduleId || viewMode === 'table'">
          <el-select v-model="form.semester" placeholder="请选择学期" filterable :disabled="viewMode === 'schedule'">
            <el-option v-for="item in semesterList" :key="item.semesterId" :label="item.semesterName"
              :value="item.semesterName" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="教师姓名" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入教师姓名" />
        </el-form-item>
        <el-form-item label="上课地点" prop="classroom">
          <el-input v-model="form.classroom" placeholder="请输入上课地点" />
        </el-form-item>
        <el-form-item label="星期" prop="weekDay">
          <el-select v-model="form.weekDay" placeholder="请选择星期">
            <el-option v-for="(day, index) in weekDays" :key="index" :label="day" :value="index + 1" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间段" prop="timeSlot">
          <el-select v-model="form.timeSlot" placeholder="请选择时间段">
            <el-option v-for="(slot, index) in timeSlots" :key="index" :label="slot" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="周次范围" required>
          <el-col :span="11">
            <el-form-item prop="startWeek">
              <el-input-number v-model="form.startWeek" :min="1" :max="maxWeek" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="2" class="text-center" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endWeek">
              <el-input-number v-model="form.endWeek" :min="1" :max="maxWeek" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="周次类型" prop="weekType">
          <el-radio-group v-model="form.weekType">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">单周</el-radio>
            <el-radio label="2">双周</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
          <el-button v-if="form.scheduleId" type="danger" @click="handleDeleteSingle">删 除</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 课程表导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :on-change="handleFileChange"
        :on-remove="handleFileRemove" :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的课程数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Schedule">
import { listSchedule, getScheduleForAdmin, addSchedule, updateSchedule, delSchedule } from "@/api/edu/schedule";
import { listClass } from "@/api/edu/class";
import { listSemester } from "@/api/edu/semester";
import { listCollege } from "@/api/edu/college";
import { listSchool } from "@/api/edu/school";
import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance();

const viewMode = ref("schedule"); // 视图模式：schedule-课表视图，table-列表视图

// 周次类型映射
const weekTypeMap = {
  '0': '全部',
  '1': '单周',
  '2': '双周'
};

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  schoolId: null,
  collegeId: null,
  classId: null,
  semester: null
});

const schoolList = ref([]);
const collegeList = ref([]);
const classList = ref([]);
const allClassList = ref([]); // 完整班级列表
const semesterList = ref([]);
const allSemesterList = ref([]); // 完整学期列表
const scheduleData = ref({});
const scheduleList = ref([]); // 列表视图数据
const currentWeek = ref(1);
const maxWeek = ref(20);
const hasData = ref(false);
const searched = ref(false);
const loading = ref(false);
const total = ref(0);
const ids = ref([]);
const multiple = ref(true);

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const timeSlots = ['第一大节', '第二大节', '第三大节', '第四大节', '第五大节'];

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
  classId: [{ required: true, message: "班级不能为空", trigger: "change" }],
  semester: [{ required: true, message: "学期不能为空", trigger: "change" }],
  courseName: [{ required: true, message: "课程名称不能为空", trigger: "blur" }],
  teacherName: [{ required: true, message: "教师姓名不能为空", trigger: "blur" }],
  classroom: [{ required: true, message: "上课地点不能为空", trigger: "blur" }],
  weekDay: [{ required: true, message: "星期不能为空", trigger: "change" }],
  timeSlot: [{ required: true, message: "时间段不能为空", trigger: "change" }],
  startWeek: [{ required: true, message: "开始周次不能为空", trigger: "blur" }],
  endWeek: [{ required: true, message: "结束周次不能为空", trigger: "blur" }],
  weekType: [{ required: true, message: "周次类型不能为空", trigger: "change" }]
};

// 计算属性：根据学校筛选学院
const filteredCollegeList = computed(() => {
  if (!queryParams.value.schoolId) return [];
  return collegeList.value.filter(item => item.schoolId === queryParams.value.schoolId);
});

// 计算属性：根据学院筛选班级
const filteredClassList = computed(() => {
  if (!queryParams.value.collegeId) return [];
  return allClassList.value.filter(item => item.collegeId === queryParams.value.collegeId);
});

// 班级对应的学期列表（动态加载）
const classSemesterList = ref([]);

// 计算属性：根据班级筛选学期（使用动态加载的数据）
const filteredSemesterList = computed(() => {
  return classSemesterList.value;
});

// 课程表导入参数
const upload = reactive({
  // 是否显示弹出层（课程表导入）
  open: false,
  // 弹出层标题（课程表导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的课程数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/edu/schedule/importData",
  // 选中的文件
  selectedFile: null
});

// 学校变更处理
function handleSchoolChange() {
  queryParams.value.collegeId = null;
  queryParams.value.classId = null;
  queryParams.value.semester = null;
}

// 学院变更处理
function handleCollegeChange() {
  queryParams.value.classId = null;
  queryParams.value.semester = null;
}

// 班级变更处理
function handleClassChange() {
  queryParams.value.semester = null;
  classSemesterList.value = [];

  // 根据班级ID查询该班级的学期列表
  if (queryParams.value.classId) {
    listSemester({ classId: queryParams.value.classId, pageNum: 1, pageSize: 1000 }).then(res => {
      classSemesterList.value = res.rows;
    });
  }
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.scheduleId);
  multiple.value = !selection.length;
}

function handleCellClick(dayIndex, slotIndex) {
  if (!queryParams.value.classId || !queryParams.value.semester) {
    proxy.$modal.msgError("请先选择班级和学期");
    return;
  }

  const course = getCourse(currentWeek.value, dayIndex, slotIndex);
  if (course) {
    handleUpdate(course);
  } else {
    handleAdd(dayIndex, slotIndex);
  }
}

function handleAdd(dayIndex = null, slotIndex = null) {
  reset();
  if (viewMode.value === 'schedule' && dayIndex !== null && slotIndex !== null) {
    // 课表视图：直接填充班级、学期、星期、时间段
    form.value = {
      classId: queryParams.value.classId,
      semester: queryParams.value.semester,
      weekDay: dayIndex + 1,
      timeSlot: slotIndex,
      startWeek: 1,
      endWeek: maxWeek.value,
      weekType: "0"
    };
  } else {
    // 列表视图：空表单
    form.value = {
      startWeek: 1,
      endWeek: 20,
      weekType: "0"
    };
  }
  title.value = "添加课程";
  open.value = true;
}

function handleUpdate(course) {
  reset();
  form.value = { ...course };
  title.value = "修改课程";
  open.value = true;
}

// 批量删除
function handleBatchDelete() {
  const scheduleIds = ids.value;
  proxy.$modal.confirm('是否确认删除选中的课程数据？').then(function () {
    return delSchedule(scheduleIds);
  }).then(() => {
    getScheduleList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

function submitForm() {
  proxy.$refs["courseFormRef"].validate(valid => {
    if (valid) {
      if (form.value.scheduleId != null) {
        updateSchedule(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          if (viewMode.value === 'table') {
            getScheduleList();
          } else {
            handleQuery();
          }
        });
      } else {
        addSchedule(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          if (viewMode.value === 'table') {
            getScheduleList();
          } else {
            handleQuery();
          }
        });
      }
    }
  });
}

// 单个删除（对话框内删除）
function handleDeleteSingle() {
  if (!form.value.scheduleId) return;
  proxy.$modal.confirm('是否确认删除该课程？').then(function () {
    return delSchedule(form.value.scheduleId);
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    open.value = false;
    if (viewMode.value === 'table') {
      getScheduleList();
    } else {
      handleQuery();
    }
  }).catch(() => { });
}

// 列表中的删除按钮
function handleDelete(row) {
  const scheduleId = row.scheduleId;
  proxy.$modal.confirm('是否确认删除该课程？').then(function () {
    return delSchedule(scheduleId);
  }).then(() => {
    getScheduleList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "课程表导入";
  upload.open = true;
  upload.selectedFile = null;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download("edu/schedule/importTemplate", {}, `schedule_template_${new Date().getTime()}.xlsx`);
}

/** 文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
}

/** 文件选择处理 */
const handleFileChange = (file, fileList) => {
  upload.selectedFile = file;
}

/** 文件删除处理 */
const handleFileRemove = (file, fileList) => {
  upload.selectedFile = null;
}

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  handleQuery();
}

/** 提交上传文件 */
function submitFileForm() {
  const file = upload.selectedFile;
  if (!file || file.length === 0 || !file.name.toLowerCase().endsWith('.xls') && !file.name.toLowerCase().endsWith('.xlsx')) {
    proxy.$modal.msgError('请选择后缀为 "xls" 或 "xlsx" 的文件。');
    return;
  }
  proxy.$refs["uploadRef"].submit();
}

function cancel() {
  open.value = false;
  reset();
}

function reset() {
  form.value = {
    scheduleId: null,
    classId: null,
    semester: null,
    courseName: null,
    teacherName: null,
    classroom: null,
    weekDay: null,
    timeSlot: null,
    startWeek: null,
    endWeek: null,
    weekType: "0"
  };
  proxy.resetForm("courseFormRef");
}

// 重置查询
function resetQuery() {
  proxy.resetForm("queryRef");

  // 手动重置级联相关状态
  queryParams.value.schoolId = null;
  queryParams.value.collegeId = null;
  queryParams.value.classId = null;
  queryParams.value.semester = null;
  classSemesterList.value = [];

  // 重置视图状态
  searched.value = false;
  hasData.value = false;
  scheduleData.value = {};
  scheduleList.value = [];
  total.value = 0;
  currentWeek.value = 1;
  maxWeek.value = 20;
}

// 获取基础数据列表
function getList() {
  // 获取学校列表
  listSchool({ pageNum: 1, pageSize: 1000, status: '0' }).then(res => {
    schoolList.value = res.rows;
  });
  // 获取学院列表
  listCollege({ pageNum: 1, pageSize: 1000 }).then(res => {
    collegeList.value = res.rows;
  });
  // 获取所有班级列表
  listClass({ pageNum: 1, pageSize: 1000 }).then(res => {
    allClassList.value = res.rows;
    classList.value = res.rows;
  });
  // 获取所有学期列表
  listSemester({ pageNum: 1, pageSize: 1000 }).then(res => {
    allSemesterList.value = res.rows;
    semesterList.value = res.rows;
  });
}

// 获取课程列表（列表视图）
function getScheduleList() {
  loading.value = true;
  listSchedule(queryParams.value).then(response => {
    scheduleList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 查询按钮操作
function handleQuery() {
  if (viewMode.value === 'table') {
    // 列表视图：直接查询列表
    queryParams.value.pageNum = 1;
    getScheduleList();
  } else {
    // 课表视图：需要班级和学期
    if (!queryParams.value.classId || !queryParams.value.semester) {
      proxy.$modal.msgError("请选择班级和学期");
      return;
    }
    searched.value = true;
    loading.value = true;

    const selectedSemester = allSemesterList.value.find(item => item.semesterName === queryParams.value.semester);

    getScheduleForAdmin(queryParams.value.classId, queryParams.value.semester).then(res => {
      scheduleData.value = res.data || {};
      const weeks = Object.keys(scheduleData.value).map(Number);
      if (weeks.length > 0) {
        hasData.value = true;

        if (selectedSemester && selectedSemester.totalWeeks) {
          maxWeek.value = selectedSemester.totalWeeks;
        } else {
          maxWeek.value = Math.max(...weeks, 20);
        }

        if (selectedSemester && selectedSemester.currentWeek) {
          currentWeek.value = selectedSemester.currentWeek;
        } else {
          currentWeek.value = 1;
        }

        if (currentWeek.value > maxWeek.value) currentWeek.value = maxWeek.value;
        if (currentWeek.value < 1) currentWeek.value = 1;
      } else {
        hasData.value = false;
      }
      loading.value = false;
    }).catch(() => {
      loading.value = false;
    });
  }
}

function changeWeek(delta) {
  const newWeek = currentWeek.value + delta;
  if (newWeek >= 1 && newWeek <= maxWeek.value) {
    currentWeek.value = newWeek;
  }
}

// 周次输入框变化处理
function handleWeekChange(value) {
  if (value && value >= 1 && value <= maxWeek.value) {
    currentWeek.value = value;
  } else if (value > maxWeek.value) {
    currentWeek.value = maxWeek.value;
  } else if (value < 1) {
    currentWeek.value = 1;
  }
}

function getCourse(week, dayIndex, slotIndex) {
  const weekData = scheduleData.value[String(week)];
  if (!weekData) return null;

  const dayData = weekData[String(dayIndex)];
  if (!dayData) return null;

  const slotData = dayData[String(slotIndex)];
  return slotData;
}

getList();
</script>

<style scoped lang="scss">
.schedule-container {
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  background: #fff;
}

.week-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  .current-week {
    margin: 0 20px;
    font-size: 18px;
    font-weight: bold;
  }

  .week-input-wrapper {
    display: flex;
    align-items: center;
    margin: 0 20px;
    font-size: 18px;
    font-weight: bold;

    span {
      margin: 0 5px;
    }

    .week-input {
      width: 80px;

      :deep(.el-input__inner) {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}

.schedule-table {
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
}

.schedule-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;

  .header-cell {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-weight: bold;
    border-right: 1px solid #dcdfe6;

    &:last-child {
      border-right: none;
    }

    &.time-col {
      flex: 0 0 100px;
    }
  }
}

.schedule-body {
  .schedule-row {
    display: flex;
    border-bottom: 1px solid #dcdfe6;

    &:last-child {
      border-bottom: none;
    }

    .time-cell {
      flex: 0 0 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f7fa;
      border-right: 1px solid #dcdfe6;
      font-weight: bold;
    }

    .course-cell {
      flex: 1;
      min-height: 100px;
      border-right: 1px solid #dcdfe6;
      padding: 5px;

      &:last-child {
        border-right: none;
      }

      .course-info {
        background-color: #ecf5ff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        padding: 8px;
        height: 100%;
        font-size: 12px;
        color: #409eff;

        .course-name {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .course-room {
          margin-bottom: 2px;
        }
      }
    }
  }
}

.no-data {
  margin-top: 50px;
  text-align: center;
}

.course-cell:hover {
  background-color: #f5f7fa;
  cursor: pointer;
}
</style>
