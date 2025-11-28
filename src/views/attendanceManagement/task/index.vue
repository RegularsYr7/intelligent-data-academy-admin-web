<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择学校" clearable filterable
              @change="handleQuerySchoolChange" style="width: 100%;">
              <el-option v-for="item in schoolOptions" :key="item.schoolId" :label="item.schoolName"
                :value="item.schoolId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学院" prop="collegeId">
            <el-select v-model="queryParams.collegeId" :placeholder="queryParams.schoolId ? '请选择学院' : '请先选择学校'"
              :disabled="!queryParams.schoolId" clearable filterable @change="handleQueryCollegeChange"
              style="width: 100%;">
              <el-option v-for="item in queryFilteredCollegeList" :key="item.collegeId" :label="item.collegeName"
                :value="item.collegeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班级" prop="classId">
            <el-select v-model="queryParams.classId" :placeholder="queryParams.collegeId ? '请选择班级' : '请先选择学院'"
              :disabled="!queryParams.collegeId" clearable filterable style="width: 100%;">
              <el-option v-for="item in queryFilteredClassList" :key="item.classId" :label="item.className"
                :value="item.classId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="任务类型" prop="taskType">
            <el-select v-model="queryParams.taskType" placeholder="请选择任务类型" clearable style="width: 100%;">
              <el-option v-for="dict in edu_checkin_task_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:task:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:task:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:task:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:task:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="任务名称" align="center" prop="taskName" min-width="150" show-overflow-tooltip fixed="left" />
      <el-table-column label="学校" align="center" prop="schoolName" min-width="120" show-overflow-tooltip />
      <el-table-column label="学院" align="center" prop="collegeName" min-width="140" show-overflow-tooltip />
      <el-table-column label="班级" align="center" min-width="200">
        <template #default="scope">
          <div v-if="scope.row.classNames" style="white-space: pre-line;">
            {{ scope.row.classNames.replace(/, /g, '\n') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" align="center" width="120">
        <template #default="scope">
          <dict-tag :options="edu_checkin_task_type" :value="scope.row.taskType" />
        </template>
      </el-table-column>
      <el-table-column label="签到时间" align="center" width="200">
        <template #default="scope">
          <div>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}') }}</div>
          <div>至</div>
          <div>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="目标地点" align="center" prop="targetAddress" min-width="150" show-overflow-tooltip />
      <el-table-column label="签到情况" align="center" width="120">
        <template #default="scope">
          <span>{{ scope.row.checkinCount || 0 }} / {{ scope.row.totalStudents || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否需要自拍" align="center" width="120">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.requirePhoto" />
        </template>
      </el-table-column>
      <el-table-column label="是否需要定位" align="center" width="120">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.requireLocation" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <dict-tag :options="edu_checkin_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="creatorName" width="100" />
      <el-table-column label="签到记录" align="center" width="100">
        <template #default="scope">
          <el-button link type="primary" @click="handleViewRecords(scope.row)">查看记录</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:task:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:task:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改签到任务对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="taskRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择学校" @change="handleFormSchoolChange"
                style="width: 100%;" filterable>
                <el-option v-for="item in schoolOptions" :key="item.schoolId" :label="item.schoolName"
                  :value="item.schoolId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院" prop="collegeId">
              <el-select v-model="form.collegeId" :placeholder="form.schoolId ? '请选择学院' : '请先选择学校'"
                :disabled="!form.schoolId" @change="handleFormCollegeChange" style="width: 100%;" filterable>
                <el-option v-for="item in formFilteredCollegeList" :key="item.collegeId" :label="item.collegeName"
                  :value="item.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="班级" prop="classIds">
              <el-select v-model="form.classIds" :placeholder="form.collegeId ? '请选择班级(可多选)' : '请先选择学院'"
                :disabled="!form.collegeId" style="width: 100%;" filterable multiple collapse-tags
                collapse-tags-tooltip>
                <el-option v-for="item in formFilteredClassList" :key="item.classId" :label="item.className"
                  :value="item.classId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="form.taskType" placeholder="请选择任务类型" style="width: 100%;">
                <el-option v-for="dict in edu_checkin_task_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="form.taskName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否允许迟到" prop="allowLate">
              <el-radio-group v-model="form.allowLate" @change="handleAllowLateChange">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable v-model="form.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择开始时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker clearable v-model="form.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择结束时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="form.allowLate === 'Y'">
          <el-col :span="12">
            <el-form-item label="迟到分钟数" prop="lateMinutes">
              <el-input v-model.number="form.lateMinutes" placeholder="请输入允许迟到的分钟数" type="number" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否需要自拍" prop="requirePhoto">
              <el-radio-group v-model="form.requirePhoto">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要定位" prop="requireLocation">
              <el-radio-group v-model="form.requireLocation">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="目标地点" prop="targetAddress">
              <el-input v-model="form.targetAddress" placeholder="点击右侧按钮选择地图位置">
                <template #append>
                  <el-button icon="Location" @click="showMapDialog = true">选择位置</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
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

    <!-- 地图选择对话框 -->
    <el-dialog title="地图选择位置" v-model="showMapDialog" width="800px" append-to-body @open="initMap">
      <div class="map-container">
        <el-input v-model="mapSearchKeyword" placeholder="搜索地点" class="map-search" @keyup.enter="searchLocation">
          <template #append>
            <el-button icon="Search" @click="searchLocation">搜索</el-button>
          </template>
        </el-input>
        <div id="amap-container" style="width: 100%; height: 500px; margin-top: 10px;"></div>
        <div class="map-info" v-if="selectedLocation.address" style="margin-top: 10px;">
          <p><strong>选中位置：</strong>{{ selectedLocation.address }}</p>
          <p><strong>经度：</strong>{{ selectedLocation.longitude }} <strong>纬度：</strong>{{ selectedLocation.latitude }}
          </p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmLocation">确认位置</el-button>
          <el-button @click="showMapDialog = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 签到记录对话框 -->
    <el-dialog title="签到记录" v-model="recordDialogVisible" width="1400px" append-to-body>
      <el-table v-loading="recordLoading" :data="recordList" max-height="500">
        <el-table-column label="签到照片" align="center" width="100" fixed="left">
          <template #default="scope">
            <el-image v-if="scope.row.photoUrl" :src="scope.row.photoUrl" :preview-src-list="[scope.row.photoUrl]"
              fit="cover" :hide-on-click-modal="true" :z-index="9999"
              style="width: 60px; height: 60px; cursor: pointer; border-radius: 4px;" />
            <span v-else style="color: #999;">无</span>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="studentName" width="100" show-overflow-tooltip />
        <el-table-column label="学号" align="center" prop="studentNo" width="140" show-overflow-tooltip />
        <el-table-column label="班级名称" align="center" prop="className" min-width="150" show-overflow-tooltip />
        <el-table-column label="签到状态" align="center" width="100">
          <template #default="scope">
            <dict-tag :options="edu_checkin_status" :value="scope.row.checkinStatus" />
          </template>
        </el-table-column>
        <el-table-column label="签到时间" align="center" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.checkinTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签到地点" align="center" prop="address" min-width="180" show-overflow-tooltip />
        <el-table-column label="经纬度" align="center" width="180">
          <template #default="scope">
            <div style="font-size: 12px; line-height: 1.4;">
              <div>{{ scope.row.longitude }}</div>
              <div>{{ scope.row.latitude }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="记录时间" align="center" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Delete" @click="handleDeleteRecord(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="recordTotal > 0" :total="recordTotal" v-model:page="recordQueryParams.pageNum"
        v-model:limit="recordQueryParams.pageSize" @pagination="getRecordList" />
    </el-dialog>
  </div>
</template>

<script setup name="Task">
import { listTask, getTask, delTask, addTask, updateTask } from "@/api/edu/task"
import { listRecord, delRecord } from "@/api/edu/record"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"
import { listClass } from "@/api/edu/class"
import { loadAMap } from "@/utils/amap"

const { proxy } = getCurrentInstance()
const { edu_checkin_status, sys_yes_no, edu_checkin_task_type } = proxy.useDict('edu_checkin_status', 'sys_yes_no', 'edu_checkin_task_type')

const taskList = ref([])
const schoolOptions = ref([])
const collegeOptions = ref([])
const classOptions = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 地图相关
const showMapDialog = ref(false)
const mapSearchKeyword = ref("")
const mapInstance = ref(null)
const markerInstance = ref(null)
const selectedLocation = ref({
  address: "",
  longitude: "",
  latitude: ""
})

const DEFAULT_LOCATION = {
  longitude: 104.078814,
  latitude: 30.663611,
  address: "成都文理学院"
}

// 签到记录相关
const recordDialogVisible = ref(false)
const recordList = ref([])
const recordLoading = ref(false)
const recordTotal = ref(0)
const currentTaskId = ref(null)
const recordQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  taskId: null
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    schoolId: null,
    collegeId: null,
    classId: null,
    taskName: null,
    taskType: null,
  },
  rules: {
    schoolId: [
      { required: true, message: "学校不能为空", trigger: "change" }
    ],
    collegeId: [
      { required: true, message: "学院不能为空", trigger: "change" }
    ],
    classIds: [
      { required: true, message: "班级不能为空", trigger: "change" }
    ],
    taskName: [
      { required: true, message: "签到名称不能为空", trigger: "blur" }
    ],
    taskType: [
      { required: true, message: "任务类型不能为空", trigger: "change" }
    ],
    startTime: [
      { required: true, message: "签到开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "签到结束时间不能为空", trigger: "blur" }
    ],
    requirePhoto: [
      { required: true, message: "是否需要自拍不能为空", trigger: "change" }
    ],
    requireLocation: [
      { required: true, message: "是否需要定位不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

// 计算属性：查询表单中根据学校筛选学院
const queryFilteredCollegeList = computed(() => {
  if (!queryParams.value.schoolId) return [];
  return collegeOptions.value.filter(item => item.schoolId === queryParams.value.schoolId);
});

// 计算属性：查询表单中根据学院筛选班级
const queryFilteredClassList = computed(() => {
  if (!queryParams.value.collegeId) return [];
  return classOptions.value.filter(item => item.collegeId === queryParams.value.collegeId);
});

// 计算属性：表单对话框中根据学校筛选学院
const formFilteredCollegeList = computed(() => {
  if (!form.value.schoolId) return [];
  return collegeOptions.value.filter(item => item.schoolId === form.value.schoolId);
});

// 计算属性：表单对话框中根据学院筛选班级
const formFilteredClassList = computed(() => {
  if (!form.value.collegeId) return [];
  return classOptions.value.filter(item => item.collegeId === form.value.collegeId);
});

// 查询表单学校变更处理
function handleQuerySchoolChange() {
  queryParams.value.collegeId = null;
  queryParams.value.classId = null;
}

// 查询表单学院变更处理
function handleQueryCollegeChange() {
  queryParams.value.classId = null;
}

// 表单对话框学校变更处理
function handleFormSchoolChange() {
  form.value.collegeId = null;
  form.value.classIds = [];
}

// 表单对话框学院变更处理
function handleFormCollegeChange() {
  form.value.classIds = [];
}

/** 查询学校列表 */
function getSchoolList() {
  listSchool({ pageNum: 1, pageSize: 1000, status: '0' }).then(response => {
    schoolOptions.value = response.rows
  })
}

/** 查询学院列表 */
function getCollegeList() {
  listCollege({ pageNum: 1, pageSize: 1000, status: '0' }).then(response => {
    collegeOptions.value = response.rows
  })
}

/** 查询班级列表 */
function getClassList() {
  listClass({ pageNum: 1, pageSize: 1000, status: '0' }).then(response => {
    classOptions.value = response.rows
  })
}

/** 查询签到任务列表 */
function getList() {
  loading.value = true
  listTask(queryParams.value).then(response => {
    taskList.value = response.rows
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
    taskId: null,
    schoolId: null,
    collegeId: null,
    classIds: [],
    taskName: null,
    taskType: null,
    totalStudents: null,
    startTime: null,
    endTime: null,
    allowLate: null,
    lateMinutes: null,
    requirePhoto: null,
    requireLocation: null,
    locationRange: null,
    targetLongitude: null,
    targetLatitude: null,
    targetAddress: null,
    remark: null
  }
  proxy.resetForm("taskRef")
}

/** 允许迟到改变 */
function handleAllowLateChange(val) {
  if (val === 'N') {
    form.value.lateMinutes = null
  }
}

/** 地图搜索 */
function searchLocation() {
  if (!mapSearchKeyword.value) {
    proxy.$modal.msgWarning('请输入搜索关键词')
    return
  }

  const placeSearch = new AMap.PlaceSearch({
    city: '成都',
    pageSize: 1
  })

  placeSearch.search(mapSearchKeyword.value, (status, result) => {
    if (status === 'complete' && result.poiList && result.poiList.pois.length > 0) {
      const poi = result.poiList.pois[0]
      const location = poi.location

      selectedLocation.value = {
        address: poi.name + (poi.address ? ' - ' + poi.address : ''),
        longitude: location.lng,
        latitude: location.lat
      }

      mapInstance.value.setCenter([location.lng, location.lat])
      markerInstance.value.setPosition([location.lng, location.lat])
    } else {
      proxy.$modal.msgError('未找到相关地点')
    }
  })
}

/** 确认位置 */
function confirmLocation() {
  if (!selectedLocation.value.longitude || !selectedLocation.value.latitude) {
    proxy.$modal.msgWarning('请先选择位置')
    return
  }

  form.value.targetLongitude = selectedLocation.value.longitude
  form.value.targetLatitude = selectedLocation.value.latitude
  form.value.targetAddress = selectedLocation.value.address
  showMapDialog.value = false
}

/** 初始化地图 */
async function initMap() {
  try {
    await loadAMap()

    if (!mapInstance.value) {
      const center = form.value.targetLongitude && form.value.targetLatitude
        ? [parseFloat(form.value.targetLongitude), parseFloat(form.value.targetLatitude)]
        : [DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.latitude]

      mapInstance.value = new AMap.Map('amap-container', {
        zoom: 16,
        center: center,
        resizeEnable: true
      })

      mapInstance.value.on('click', (e) => {
        const lng = e.lnglat.getLng()
        const lat = e.lnglat.getLat()

        const geocoder = new AMap.Geocoder()
        geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            selectedLocation.value = {
              address: result.regeocode.formattedAddress,
              longitude: lng,
              latitude: lat
            }
          } else {
            selectedLocation.value = {
              address: `经度: ${lng}, 纬度: ${lat}`,
              longitude: lng,
              latitude: lat
            }
          }
        })

        markerInstance.value.setPosition([lng, lat])
      })

      markerInstance.value = new AMap.Marker({
        position: center,
        draggable: true
      })

      markerInstance.value.on('dragend', (e) => {
        const position = e.target.getPosition()
        const lng = position.lng
        const lat = position.lat

        const geocoder = new AMap.Geocoder()
        geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            selectedLocation.value = {
              address: result.regeocode.formattedAddress,
              longitude: lng,
              latitude: lat
            }
          }
        })
      })

      mapInstance.value.add(markerInstance.value)

      if (form.value.targetAddress) {
        selectedLocation.value = {
          address: form.value.targetAddress,
          longitude: form.value.targetLongitude,
          latitude: form.value.targetLatitude
        }
      } else {
        selectedLocation.value = {
          address: DEFAULT_LOCATION.address,
          longitude: DEFAULT_LOCATION.longitude,
          latitude: DEFAULT_LOCATION.latitude
        }
      }
    } else {
      const center = form.value.targetLongitude && form.value.targetLatitude
        ? [parseFloat(form.value.targetLongitude), parseFloat(form.value.targetLatitude)]
        : [DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.latitude]

      mapInstance.value.setCenter(center)
      markerInstance.value.setPosition(center)

      if (form.value.targetAddress) {
        selectedLocation.value = {
          address: form.value.targetAddress,
          longitude: form.value.targetLongitude,
          latitude: form.value.targetLatitude
        }
      }
    }
  } catch (error) {
    console.error('地图初始化失败:', error)
    proxy.$modal.msgError('地图加载失败，请检查网络连接')
  }
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
  ids.value = selection.map(item => item.taskId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加签到任务"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _taskId = row.taskId || ids.value
  getTask(_taskId).then(response => {
    form.value = response.data
    // 将逗号分隔的字符串转为数组
    if (form.value.classIds && typeof form.value.classIds === 'string') {
      form.value.classIds = form.value.classIds.split(',').map(id => parseInt(id));
    }
    open.value = true
    title.value = "修改签到任务"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskRef"].validate(valid => {
    if (valid) {
      // 将班级ID数组转为逗号分隔的字符串
      const submitData = {
        ...form.value,
        classIds: Array.isArray(form.value.classIds) ? form.value.classIds.join(',') : form.value.classIds
      };

      if (form.value.taskId != null) {
        updateTask(submitData).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTask(submitData).then(response => {
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
  const _taskIds = row.taskId || ids.value
  proxy.$modal.confirm('是否确认删除签到任务编号为"' + _taskIds + '"的数据项？').then(function () {
    return delTask(_taskIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/task/export', {
    ...queryParams.value
  }, `task_${new Date().getTime()}.xlsx`)
}

/** 查看签到记录 */
function handleViewRecords(row) {
  currentTaskId.value = row.taskId
  recordQueryParams.value.taskId = row.taskId
  recordQueryParams.value.pageNum = 1
  recordDialogVisible.value = true
  getRecordList()
}

/** 查询签到记录列表 */
function getRecordList() {
  recordLoading.value = true
  listRecord(recordQueryParams.value).then(response => {
    recordList.value = response.rows
    recordTotal.value = response.total
    recordLoading.value = false
  })
}

/** 删除签到记录 */
function handleDeleteRecord(row) {
  proxy.$modal.confirm('是否确认删除该签到记录?').then(function () {
    return delRecord(row.recordId)
  }).then(() => {
    getRecordList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

getSchoolList()
getCollegeList()
getClassList()
getList()
</script>
