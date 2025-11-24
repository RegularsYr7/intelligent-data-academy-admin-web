<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择所属学校" clearable style="width: 100%;">
              <el-option v-for="school in schoolOptions" :key="school.schoolId" :label="school.schoolName"
                :value="school.schoolId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地标名称" prop="landmarkName">
            <el-input v-model="queryParams.landmarkName" placeholder="请输入地标名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:landmark:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:landmark:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:landmark:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:landmark:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="landmarkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属学校" align="center" prop="schoolId">
        <template #default="scope">
          <span>{{schoolOptions.find(s => s.schoolId === scope.row.schoolId)?.schoolName || scope.row.schoolId
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地标名称" align="center" prop="landmarkName" />
      <el-table-column label="地标简介" align="center" prop="introduction" show-overflow-tooltip />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:landmark:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:landmark:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改地图地标信息对话框 -->
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
      <el-form ref="landmarkRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" clearable style="width: 100%;">
                <el-option v-for="school in schoolOptions" :key="school.schoolId" :label="school.schoolName"
                  :value="school.schoolId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地标名称" prop="landmarkName">
              <el-input v-model="form.landmarkName" placeholder="请输入地标名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude" placeholder="点击地图选择位置自动填充" readonly @click="showMapDialog = true">
                <template #append>
                  <el-button icon="Location" @click="showMapDialog = true" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude" placeholder="点击地图选择位置自动填充" readonly @click="showMapDialog = true">
                <template #append>
                  <el-button icon="Location" @click="showMapDialog = true" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="24">
            <el-form-item label="地标简介" prop="introduction">
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

    <!-- 地图选择对话框 -->
    <el-dialog title="地图选择位置" v-model="showMapDialog" width="800px" append-to-body>
      <div class="map-container">
        <el-input v-model="mapSearchKeyword" placeholder="搜索地点" class="map-search" @keyup.enter="searchLocation">
          <template #append>
            <el-button icon="Search" @click="searchLocation">搜索</el-button>
          </template>
        </el-input>
        <div id="amap-container" style="width: 100%; height: 500px; margin-top: 10px;"></div>
        <div class="map-info" v-if="selectedLocation.address">
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
  </div>
</template>

<script setup name="Landmark">
import { listLandmark, getLandmark, delLandmark, addLandmark, updateLandmark } from "@/api/edu/landmark"
import { listSchool } from "@/api/edu/school"
import { loadAMap } from "@/utils/amap"

const { proxy } = getCurrentInstance()
const { sys_yes_no } = proxy.useDict('sys_yes_no')

const landmarkList = ref([])
const schoolOptions = ref([])
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
  latitude: "",
  province: "",
  city: "",
  district: ""
})

const DEFAULT_LOCATION = {
  longitude: 104.464508,
  latitude: 30.845427,
  address: "",
  province: "",
  city: "",
  district: ""
}

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    schoolId: null,
    landmarkName: null,
  },
  rules: {
    landmarkName: [
      { required: true, message: "地标名称不能为空", trigger: "blur" }
    ],
    longitude: [
      { required: true, message: "经度不能为空", trigger: "blur" }
    ],
    latitude: [
      { required: true, message: "纬度不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询地图地标信息列表 */
function getList() {
  loading.value = true
  listLandmark(queryParams.value).then(response => {
    landmarkList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 获取学校列表 */
function getSchoolList() {
  listSchool({ status: '0' }).then(response => {
    schoolOptions.value = response.rows || []
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
    landmarkId: null,
    schoolId: null,
    landmarkName: null,
    introduction: null,
    longitude: null,
    latitude: null,
    remark: null
  }
  proxy.resetForm("landmarkRef")
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
  ids.value = selection.map(item => item.landmarkId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加地图地标信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _landmarkId = row.landmarkId || ids.value
  getLandmark(_landmarkId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改地图地标信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["landmarkRef"].validate(valid => {
    if (valid) {
      if (form.value.landmarkId != null) {
        updateLandmark(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addLandmark(form.value).then(response => {
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
  const _landmarkIds = row.landmarkId || ids.value
  proxy.$modal.confirm('是否确认删除地图地标信息编号为"' + _landmarkIds + '"的数据项？').then(function () {
    return delLandmark(_landmarkIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/landmark/export', {
    ...queryParams.value
  }, `landmark_${new Date().getTime()}.xlsx`)
}

function findSchoolById(id) {
  if (id === undefined || id === null || id === '') {
    return null
  }
  return schoolOptions.value.find(item => String(item.schoolId) === String(id)) || null
}

function getSchoolLocation() {
  const school = findSchoolById(form.value.schoolId)
  if (school) {
    const lng = parseFloat(school.longitude)
    const lat = parseFloat(school.latitude)
    if (!isNaN(lng) && !isNaN(lat)) {
      return {
        longitude: lng,
        latitude: lat,
        address: school.schoolName || "",
        province: school.province || "",
        city: school.city || "",
        district: school.district || ""
      }
    }
  }
  return null
}

function getInitialLocation() {
  const lng = parseFloat(form.value.longitude)
  const lat = parseFloat(form.value.latitude)
  if (!isNaN(lng) && !isNaN(lat)) {
    return {
      longitude: lng,
      latitude: lat,
      address: selectedLocation.value.address || form.value.landmarkName || "",
      province: selectedLocation.value.province || "",
      city: selectedLocation.value.city || "",
      district: selectedLocation.value.district || ""
    }
  }

  const schoolLocation = getSchoolLocation()
  if (schoolLocation) {
    return schoolLocation
  }

  return DEFAULT_LOCATION
}

function formatSelectedLocation(location, fallbackAddress = "") {
  const lng = Number(location.longitude)
  const lat = Number(location.latitude)
  return {
    address: location.address || fallbackAddress,
    longitude: !isNaN(lng) ? lng.toFixed(6) : "",
    latitude: !isNaN(lat) ? lat.toFixed(6) : "",
    province: location.province || "",
    city: location.city || "",
    district: location.district || ""
  }
}

function reverseGeocodeAndSet(lng, lat, fallbackAddress = "") {
  if (isNaN(lng) || isNaN(lat)) {
    return
  }

  const geocoder = new AMap.Geocoder()
  geocoder.getAddress([lng, lat], (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      const addressComponent = result.regeocode.addressComponent
      selectedLocation.value = formatSelectedLocation({
        address: result.regeocode.formattedAddress,
        longitude: lng,
        latitude: lat,
        province: addressComponent.province,
        city: addressComponent.city,
        district: addressComponent.district
      })
    } else {
      selectedLocation.value = formatSelectedLocation({
        longitude: lng,
        latitude: lat,
      }, fallbackAddress)
    }
  })
}

// 初始化高德地图
function initAMap() {
  loadAMap().then(() => {
    createMap()
  }).catch(e => {
    console.error(e)
    proxy.$modal.msgError("地图加载失败，请检查Key配置")
  })
}

// 创建地图实例
function createMap() {
  nextTick(() => {
    const initialLocation = getInitialLocation()
    const center = [initialLocation.longitude, initialLocation.latitude]

    mapInstance.value = new AMap.Map('amap-container', {
      zoom: 16,
      center: center,
      viewMode: '2D'
    })

    // 添加点击事件
    mapInstance.value.on('click', (e) => {
      const { lng, lat } = e.lnglat
      updateMarker(lng, lat)
      reverseGeocodeAndSet(lng, lat)
    })

    updateMarker(initialLocation.longitude, initialLocation.latitude)
    if (initialLocation.address) {
      selectedLocation.value = formatSelectedLocation(initialLocation, initialLocation.address)
    } else {
      reverseGeocodeAndSet(initialLocation.longitude, initialLocation.latitude, DEFAULT_LOCATION.address)
    }
  })
}

// 更新地图标记
function updateMarker(lng, lat) {
  if (markerInstance.value) {
    markerInstance.value.setPosition([lng, lat])
  } else {
    markerInstance.value = new AMap.Marker({
      position: [lng, lat],
      map: mapInstance.value
    })
  }
}

// 搜索地点
function searchLocation() {
  if (!mapSearchKeyword.value) {
    proxy.$modal.msgWarning('请输入搜索关键词')
    return
  }

  const placeSearch = new AMap.PlaceSearch({
    map: mapInstance.value
  })

  placeSearch.search(mapSearchKeyword.value, (status, result) => {
    if (status === 'complete' && result.poiList.pois.length > 0) {
      const poi = result.poiList.pois[0]
      const { lng, lat } = poi.location

      updateMarker(lng, lat)
      mapInstance.value.setCenter([lng, lat])

      selectedLocation.value = {
        address: poi.address + poi.name,
        longitude: lng.toFixed(6),
        latitude: lat.toFixed(6),
        province: poi.pname,
        city: poi.cityname,
        district: poi.adname
      }
    } else {
      if (result && result.info === 'USERKEY_PLAT_NOMATCH') {
        proxy.$modal.msgError('高德地图Key类型不匹配，请使用Web端(JS API)类型的Key')
      } else {
        proxy.$modal.msgError('未找到相关地点')
      }
    }
  })
}

// 确认位置
function confirmLocation() {
  if (!selectedLocation.value.longitude) {
    proxy.$modal.msgWarning('请先在地图上选择位置')
    return
  }

  form.value.longitude = selectedLocation.value.longitude
  form.value.latitude = selectedLocation.value.latitude

  showMapDialog.value = false
  proxy.$modal.msgSuccess('位置已填充')
}

watch(() => form.value.schoolId, () => {
  if (!showMapDialog.value || !mapInstance.value) {
    return
  }

  const formLng = parseFloat(form.value.longitude)
  const formLat = parseFloat(form.value.latitude)
  const hasFormLocation = !isNaN(formLng) && !isNaN(formLat)
  if (hasFormLocation) {
    return
  }

  const schoolLocation = getSchoolLocation()
  if (schoolLocation) {
    mapInstance.value.setCenter([schoolLocation.longitude, schoolLocation.latitude])
    updateMarker(schoolLocation.longitude, schoolLocation.latitude)
    const school = findSchoolById(form.value.schoolId)
    const fallbackAddress = school?.schoolName || DEFAULT_LOCATION.address
    if (schoolLocation.address) {
      selectedLocation.value = formatSelectedLocation(schoolLocation, fallbackAddress)
    } else {
      reverseGeocodeAndSet(schoolLocation.longitude, schoolLocation.latitude, fallbackAddress)
    }
  }
})

// 监听地图对话框打开
watch(showMapDialog, (val) => {
  if (val) {
    initAMap()
  } else {
    // 关闭时销毁地图实例
    if (mapInstance.value) {
      mapInstance.value.destroy()
      mapInstance.value = null
    }
    if (markerInstance.value) {
      markerInstance.value = null
    }
  }
})

getSchoolList()
getList()
</script>
