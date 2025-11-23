<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="学校名称" prop="schoolName">
            <el-input v-model="queryParams.schoolName" placeholder="请输入学校名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="10" style="text-align: right;">
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
      <el-table-column label="ID" align="center" prop="schoolId" width="80" />
      <el-table-column label="学校Logo" align="center" prop="logoUrl" width="100">
        <template #default="scope">
          <el-image v-if="scope.row.logoUrl" :src="scope.row.logoUrl" :preview-src-list="[scope.row.logoUrl]"
            style="width: 50px; height: 50px;" fit="cover" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="学校名称" align="center" prop="schoolName" min-width="120" />
      <el-table-column label="省份" align="center" prop="province" width="100" />
      <el-table-column label="城市" align="center" prop="city" width="100" />
      <el-table-column label="区县" align="center" prop="district" width="100" />
      <el-table-column label="详细地址" align="center" prop="address" min-width="150" show-overflow-tooltip />
      <el-table-column label="经度" align="center" prop="longitude" width="100" />
      <el-table-column label="纬度" align="center" prop="latitude" width="100" />
      <el-table-column label="显示顺序" align="center" prop="sortOrder" width="100" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
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
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
      <el-form ref="schoolRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="学校Logo" prop="logoUrl">
              <image-upload v-model="form.logoUrl" :limit="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="学校名称" prop="schoolName">
              <el-input v-model="form.schoolName" placeholder="请输入学校名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
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
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址">
                <template #append>
                  <el-button @click="showMapDialog = true">地图选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude" placeholder="点击地图选择位置自动填充" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude" placeholder="点击地图选择位置自动填充" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="学校简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" :rows="4" placeholder="请输入学校简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" :min="0" controls-position="right" style="width: 100%;" />
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

<script setup name="School">
import { listSchool, getSchool, delSchool, addSchool, updateSchool } from "@/api/edu/school"
import ImageUpload from '@/components/ImageUpload'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const schoolList = ref([])
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

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    schoolName: null,
  },
  rules: {
    schoolName: [
      { required: true, message: "学校名称不能为空", trigger: "blur" }
    ],
    logoUrl: [
      { required: true, message: "学校Logo不能为空", trigger: "blur" }
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
    schoolName: null,
    province: null,
    city: null,
    district: null,
    address: null,
    longitude: null,
    latitude: null,
    logoUrl: null,
    introduction: null,
    sortOrder: 0,
    status: "0"
  }
  proxy.resetForm("schoolRef")
}

// 初始化高德地图
function initAMap() {
  // 动态加载高德地图API
  if (!window.AMap) {
    const script = document.createElement('script')
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&plugin=AMap.PlaceSearch,AMap.Geocoder'
    script.onload = () => {
      createMap()
    }
    document.head.appendChild(script)
  } else {
    createMap()
  }
}

// 创建地图实例
function createMap() {
  nextTick(() => {
    if (!mapInstance.value) {
      mapInstance.value = new AMap.Map('amap-container', {
        zoom: 13,
        center: [form.value.longitude || 116.397428, form.value.latitude || 39.90923],
        viewMode: '3D'
      })

      // 添加点击事件
      mapInstance.value.on('click', (e) => {
        const { lng, lat } = e.lnglat
        updateMarker(lng, lat)

        // 逆地理编码获取地址信息
        const geocoder = new AMap.Geocoder()
        geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            const addressComponent = result.regeocode.addressComponent
            selectedLocation.value = {
              address: result.regeocode.formattedAddress,
              longitude: lng.toFixed(6),
              latitude: lat.toFixed(6),
              province: addressComponent.province,
              city: addressComponent.city,
              district: addressComponent.district
            }
          }
        })
      })
    }

    // 如果有经纬度，显示标记
    if (form.value.longitude && form.value.latitude) {
      updateMarker(form.value.longitude, form.value.latitude)
      mapInstance.value.setCenter([form.value.longitude, form.value.latitude])
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
      proxy.$modal.msgError('未找到相关地点')
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
  form.value.province = selectedLocation.value.province
  form.value.city = selectedLocation.value.city
  form.value.district = selectedLocation.value.district
  form.value.address = selectedLocation.value.address

  showMapDialog.value = false
  proxy.$modal.msgSuccess('位置已填充')
}

// 监听地图对话框打开
watch(showMapDialog, (val) => {
  if (val) {
    initAMap()
  }
})

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

<style lang="scss" scoped>
.map-container {
  .map-search {
    width: 100%;
  }

  .map-info {
    margin-top: 10px;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;

    p {
      margin: 5px 0;
      font-size: 14px;
      color: #606266;
    }
  }
}

#amap-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
