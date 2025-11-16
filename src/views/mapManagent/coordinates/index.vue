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
          <el-form-item label="地标编码" prop="landmarkCode">
            <el-input v-model="queryParams.landmarkCode" placeholder="请输入地标编码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地标名称" prop="landmarkName">
            <el-input v-model="queryParams.landmarkName" placeholder="请输入地标名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否无障碍设施" prop="isAccessible">
            <el-select v-model="queryParams.isAccessible" placeholder="请选择是否无障碍设施" clearable style="width: 100%;">
              <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align: right;">
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
      <el-table-column label="地标编码" align="center" prop="landmarkCode" />
      <el-table-column label="地标名称" align="center" prop="landmarkName" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="是否无障碍设施" align="center" prop="isAccessible">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.isAccessible" />
        </template>
      </el-table-column>
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
            <el-form-item label="地标编码" prop="landmarkCode">
              <el-input v-model="form.landmarkCode" placeholder="请输入地标编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="地标名称" prop="landmarkName">
              <el-input v-model="form.landmarkName" placeholder="请输入地标名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地标英文名称" prop="landmarkNameEn">
              <el-input v-model="form.landmarkNameEn" placeholder="请输入地标英文名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude" placeholder="请输入经度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude" placeholder="请输入纬度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="楼层数" prop="floorCount">
              <el-input v-model="form.floorCount" placeholder="请输入楼层数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑面积" prop="buildingArea">
              <el-input v-model="form.buildingArea" placeholder="请输入建筑面积" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="开放时间" prop="openingHours">
              <el-input v-model="form.openingHours" placeholder="请输入开放时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入显示顺序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="地标图片URL" prop="imageUrl">
              <image-upload v-model="form.imageUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地标图标URL" prop="iconUrl">
              <image-upload v-model="form.iconUrl" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px;">
          <el-col :span="12">
            <el-form-item label="地标简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否无障碍设施" prop="isAccessible">
              <el-radio-group v-model="form.isAccessible">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
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
  </div>
</template>

<script setup name="Landmark">
import { listLandmark, getLandmark, delLandmark, addLandmark, updateLandmark } from "@/api/edu/landmark"
import { listSchool } from "@/api/edu/school"

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
const daterangeCreateTime = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    schoolId: null,
    landmarkCode: null,
    landmarkName: null,
    isAccessible: null,
    status: null,
    createTime: null,
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
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询地图地标信息列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
  }
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
    landmarkCode: null,
    landmarkName: null,
    landmarkNameEn: null,
    introduction: null,
    longitude: null,
    latitude: null,
    imageUrl: null,
    iconUrl: null,
    floorCount: null,
    buildingArea: null,
    contactPhone: null,
    contactPerson: null,
    openingHours: null,
    isAccessible: null,
    sortOrder: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
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
  daterangeCreateTime.value = []
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

getList()
getSchoolList()
</script>
