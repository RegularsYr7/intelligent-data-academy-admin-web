<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="班级">
        <el-select v-model="queryParams.classId" placeholder="请选择班级" filterable>
          <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId" />
        </el-select>
      </el-form-item>
      <el-form-item label="学期">
        <el-select v-model="queryParams.semester" placeholder="请选择学期" filterable>
          <el-option v-for="item in semesterList" :key="item.semesterId" :label="item.semesterName"
            :value="item.semesterName" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="success" plain icon="Upload" @click="handleImport">导入</el-button>
      </el-form-item>
    </el-form>

    <!-- 课表展示 -->
    <div v-if="hasData" class="schedule-container">
      <div class="week-selector">
        <el-button @click="changeWeek(-1)" :disabled="currentWeek <= 1">上一周</el-button>
        <span class="current-week">第 {{ currentWeek }} 周</span>
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
    <div v-else-if="searched" class="no-data">
      <el-empty description="暂无课程数据" />
    </div>
    <div v-else class="no-data">
      <el-empty description="请选择班级和学期后点击查询" />
    </div>

    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="courseFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="教师姓名" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入教师姓名" />
        </el-form-item>
        <el-form-item label="上课地点" prop="classroom">
          <el-input v-model="form.classroom" placeholder="请输入上课地点" />
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
          <el-button v-if="form.scheduleId" type="danger" @click="handleDelete">删 除</el-button>
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
import { getScheduleForAdmin, addSchedule, updateSchedule, delSchedule } from "@/api/edu/schedule";
import { listClass } from "@/api/edu/class";
import { listSemester } from "@/api/edu/semester";
import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance();

const queryParams = ref({
  classId: null,
  semester: null
});

const classList = ref([]);
const semesterList = ref([]);
const scheduleData = ref({});
const currentWeek = ref(1);
const maxWeek = ref(20);
const hasData = ref(false);
const searched = ref(false);

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const timeSlots = ['第一大节', '第二大节', '第三大节', '第四大节', '第五大节'];

const open = ref(false);
const title = ref("");
const form = ref({});
const rules = {
  courseName: [{ required: true, message: "课程名称不能为空", trigger: "blur" }],
  teacherName: [{ required: true, message: "教师姓名不能为空", trigger: "blur" }],
  classroom: [{ required: true, message: "上课地点不能为空", trigger: "blur" }],
  startWeek: [{ required: true, message: "开始周次不能为空", trigger: "blur" }],
  endWeek: [{ required: true, message: "结束周次不能为空", trigger: "blur" }],
  weekType: [{ required: true, message: "周次类型不能为空", trigger: "change" }]
};

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

function handleAdd(dayIndex, slotIndex) {
  reset();
  form.value = {
    classId: queryParams.value.classId,
    semester: queryParams.value.semester,
    weekDay: dayIndex + 1, // Assuming 1-based weekDay
    timeSlot: slotIndex,
    startWeek: 1,
    endWeek: maxWeek.value,
    weekType: "0"
  };
  title.value = "添加课程";
  open.value = true;
}

function handleUpdate(course) {
  reset();
  form.value = { ...course };
  title.value = "修改课程";
  open.value = true;
}

function submitForm() {
  proxy.$refs["courseFormRef"].validate(valid => {
    if (valid) {
      if (form.value.scheduleId != null) {
        updateSchedule(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          handleQuery();
        });
      } else {
        addSchedule(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          handleQuery();
        });
      }
    }
  });
}

function handleDelete() {
  if (!form.value.scheduleId) return;
  proxy.$modal.confirm('是否确认删除该课程？').then(function () {
    return delSchedule(form.value.scheduleId);
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    open.value = false;
    handleQuery();
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

function getList() {
  listClass({ pageNum: 1, pageSize: 1000 }).then(res => {
    classList.value = res.rows;
  });
  listSemester({ pageNum: 1, pageSize: 1000 }).then(res => {
    semesterList.value = res.rows;
  });
}

function handleQuery() {
  if (!queryParams.value.classId || !queryParams.value.semester) {
    proxy.$modal.msgError("请选择班级和学期");
    return;
  }
  searched.value = true;

  const selectedSemester = semesterList.value.find(item => item.semesterName === queryParams.value.semester);

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
  });
}

function changeWeek(delta) {
  const newWeek = currentWeek.value + delta;
  if (newWeek >= 1 && newWeek <= maxWeek.value) {
    currentWeek.value = newWeek;
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
