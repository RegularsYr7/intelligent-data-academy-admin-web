<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="组织ID" prop="organizationId">
            <el-input v-model="queryParams.organizationId" placeholder="请输入组织ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组织名称" prop="organizationName">
            <el-input v-model="queryParams.organizationName" placeholder="请输入组织名称" clearable
              @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组织等级" prop="organizationLevel">
            <el-select v-model="queryParams.organizationLevel" placeholder="请选择组织等级" clearable style="width: 100%;">
              <el-option v-for="dict in edu_organization_level" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="成立年份" prop="establishYear">
            <el-input v-model="queryParams.establishYear" placeholder="请输入成立年份" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="所属学校ID" prop="schoolId">
            <el-input v-model="queryParams.schoolId" placeholder="请输入所属学校ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属学院ID" prop="collegeId">
            <el-input v-model="queryParams.collegeId" placeholder="请输入所属学院ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属班级ID" prop="classId">
            <el-input v-model="queryParams.classId" placeholder="请输入所属班级ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="当前主席姓名" prop="presidentName">
            <el-input v-model="queryParams.presidentName" placeholder="请输入当前主席姓名" clearable
              @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['edu:organization:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:organization:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:organization:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:organization:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="organizationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column label="组织名称" align="center" prop="organizationName" min-width="150" show-overflow-tooltip />
      <el-table-column label="组织等级" align="center" prop="organizationLevel" width="100">
        <template #default="scope">
          <dict-tag :options="edu_organization_level" :value="scope.row.organizationLevel" />
        </template>
      </el-table-column>
      <el-table-column label="成员人数" align="center" prop="memberCount" width="100" />
      <el-table-column label="当前主席" align="center" prop="presidentName" min-width="100" show-overflow-tooltip />
      <el-table-column label="办公地点" align="center" prop="officeLocation" min-width="120" show-overflow-tooltip />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员信息" align="center" width="100" fixed="right">
        <template #default="scope">
          <el-button link type="success" @click="showMemberDetail(scope.row.organizationId)">查看成员</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:organization:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:organization:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改组织信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="organizationRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="组织名称" prop="organizationName">
              <el-input v-model="form.organizationName" placeholder="请输入组织名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织等级" prop="organizationLevel">
              <el-select v-model="form.organizationLevel" placeholder="请选择组织等级" style="width: 100%;">
                <el-option v-for="dict in edu_organization_level" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成立年份" prop="establishYear">
              <el-input v-model="form.establishYear" placeholder="请输入成立年份" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否推荐" prop="isRecommended">
              <el-radio-group v-model="form.isRecommended">
                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择所属学校" clearable filterable @change="handleSchoolChange"
                style="width: 100%;">
                <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                  :value="school.schoolId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学院" prop="collegeId">
              <el-select v-model="form.collegeId" placeholder="请选择所属学院" clearable filterable
                @change="handleCollegeChange" style="width: 100%;">
                <el-option v-for="college in collegeList" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属班级" prop="classId">
              <el-select v-model="form.classId" placeholder="请选择所属班级" clearable filterable style="width: 100%;">
                <el-option v-for="classItem in classList" :key="classItem.classId" :label="classItem.className"
                  :value="classItem.classId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公地点" prop="officeLocation">
              <el-input v-model="form.officeLocation" placeholder="请输入办公地点" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input v-model="form.contactEmail" placeholder="请输入联系邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="当前主席ID" prop="presidentId">
              <el-input v-model="form.presidentId" placeholder="请输入当前主席ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前主席姓名" prop="presidentName">
              <el-input v-model="form.presidentName" placeholder="请输入当前主席姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="组织logo" prop="organizationLogo">
              <image-upload v-model="form.organizationLogo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="推荐图" prop="recommendImage">
              <image-upload v-model="form.recommendImage" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="展示文案" prop="displayText">
              <el-input v-model="form.displayText" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="组织简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="主要负责人" prop="mainLeaders">
              <el-input v-model="form.mainLeaders" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="主要活动" prop="mainActivities">
              <el-input v-model="form.mainActivities" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="荣誉成就" prop="honors">
              <el-input v-model="form.honors" type="textarea" placeholder="请输入内容" />
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

    <!-- 成员信息详情对话框 -->
    <el-dialog title="成员信息详情" v-model="memberDialogVisible" width="1400px" append-to-body>
      <el-table v-loading="memberLoading" :data="memberList" max-height="500">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div style="padding: 20px;">
              <el-form :model="row" label-width="140px" size="default">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="学生ID">
                      <el-input v-model="row.studentId" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="学生姓名">
                      <el-input v-model="row.studentName" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="成员角色">
                      <el-select v-model="row.memberRole" placeholder="请选择成员角色" style="width: 100%">
                        <el-option v-for="dict in edu_member_role" :key="dict.value" :label="dict.label"
                          :value="dict.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="人员标签">
                      <el-input v-model="row.memberTag" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="加入时间">
                      <el-date-picker v-model="row.joinTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择加入时间"
                        style="width: 100%">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="离开时间">
                      <el-date-picker v-model="row.leaveTime" type="date" value-format="YYYY-MM-DD"
                        placeholder="请选择离开时间" style="width: 100%">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="状态">
                      <el-radio-group v-model="row.status">
                        <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                        }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      <el-input v-model="row.remark" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item>
                      <el-button type="primary" @click="handleUpdateMember(row)"
                        v-hasPermi="['edu:member:edit']">保存修改</el-button>
                      <el-button @click="handleCancelMemberEdit(row)">取消</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="studentName" min-width="120" show-overflow-tooltip />
        <el-table-column label="成员角色" align="center" prop="memberRole" width="100">
          <template #default="scope">
            <dict-tag :options="edu_member_role" :value="scope.row.memberRole" />
          </template>
        </el-table-column>
        <el-table-column label="人员标签" align="center" prop="memberTag" min-width="120" show-overflow-tooltip />
        <el-table-column label="加入时间" align="center" prop="joinTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.joinTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="80">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="danger" icon="Delete" @click="handleDeleteMember(scope.row)"
              v-hasPermi="['edu:member:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="memberTotal > 0" :total="memberTotal" v-model:page="memberQueryParams.pageNum"
        v-model:limit="memberQueryParams.pageSize" @pagination="getMemberList" />
    </el-dialog>
  </div>
</template>

<script setup name="Organization">
import { listOrganization, getOrganization, delOrganization, addOrganization, updateOrganization } from "@/api/edu/organization"
import { listMember, getMember, updateMember, delMember } from "@/api/edu/member"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"
import { listClass } from "@/api/edu/class"

const { proxy } = getCurrentInstance()
const { edu_organization_level, sys_normal_disable, sys_yes_no, edu_member_role } = proxy.useDict('edu_organization_level', 'sys_normal_disable', 'sys_yes_no', 'edu_member_role')

const schoolList = ref([]) // 学校列表
const collegeList = ref([]) // 当前显示的学院列表（会根据学校筛选）
const classList = ref([]) // 当前显示的班级列表（会根据学院筛选）
const allCollegeList = ref([]) // 所有学院列表（用于筛选）
const allClassList = ref([]) // 所有班级列表（用于筛选）

const organizationList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 成员详情相关
const memberDialogVisible = ref(false)
const memberLoading = ref(false)
const memberList = ref([])
const memberTotal = ref(0)
const currentOrganizationId = ref(null)
const memberQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  organizationId: null
})
const originalMemberData = ref({}) // 保存原始成员数据用于取消编辑

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    organizationId: null,
    organizationName: null,
    organizationLevel: null,
    establishYear: null,
    schoolId: null,
    collegeId: null,
    classId: null,
    presidentName: null,
    status: null,
    createTime: null,
  },
  rules: {
    organizationName: [
      { required: true, message: "组织名称不能为空", trigger: "blur" }
    ],
    organizationLevel: [
      { required: true, message: "组织等级不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询组织信息列表 */
function getList() {
  loading.value = true
  listOrganization(queryParams.value).then(response => {
    organizationList.value = response.rows
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
    organizationId: null,
    organizationName: null,
    organizationLevel: null,
    organizationLogo: null,
    recommendImage: null,
    isRecommended: 'N',
    displayText: null,
    introduction: null,
    memberCount: null,
    establishYear: null,
    schoolId: null,
    collegeId: null,
    classId: null,
    officeLocation: null,
    contactPhone: null,
    contactEmail: null,
    mainLeaders: null,
    mainActivities: null,
    honors: null,
    presidentId: null,
    presidentName: null,
    viewCount: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("organizationRef")
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
  ids.value = selection.map(item => item.organizationId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getSchoolList()
  getCollegeList()
  getClassList()
  open.value = true
  title.value = "添加组织信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getSchoolList()
  getCollegeList()
  getClassList()
  const _organizationId = row.organizationId || ids.value
  getOrganization(_organizationId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改组织信息"
    // 修改时根据已选的学校和学院自动筛选列表
    if (form.value.schoolId) {
      handleSchoolChange(form.value.schoolId)
    }
    if (form.value.collegeId) {
      handleCollegeChange(form.value.collegeId)
    }
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["organizationRef"].validate(valid => {
    if (valid) {
      if (form.value.organizationId != null) {
        updateOrganization(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addOrganization(form.value).then(response => {
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
  const _organizationIds = row.organizationId || ids.value
  proxy.$modal.confirm('是否确认删除组织信息编号为"' + _organizationIds + '"的数据项？').then(function () {
    return delOrganization(_organizationIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/organization/export', {
    ...queryParams.value
  }, `organization_${new Date().getTime()}.xlsx`)
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

/** 获取班级列表 */
function getClassList() {
  listClass().then(response => {
    allClassList.value = response.rows
    classList.value = response.rows
  })
}

/** 学校改变事件（级联筛选学院） */
function handleSchoolChange(schoolId) {
  form.value.collegeId = null // 清空学院选择
  form.value.classId = null // 清空班级选择
  if (schoolId) {
    // 只显示该学校下的学院
    collegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
    classList.value = [] // 清空班级列表
  } else {
    collegeList.value = allCollegeList.value
    classList.value = allClassList.value
  }
}

/** 学院改变事件（级联筛选班级） */
function handleCollegeChange(collegeId) {
  form.value.classId = null // 清空班级选择
  if (collegeId) {
    // 只显示该学院下的班级
    classList.value = allClassList.value.filter(classItem => classItem.collegeId === collegeId)
  } else if (form.value.schoolId) {
    // 如果已选择学校但清空了学院，则显示该学校所有学院的班级
    const schoolCollegeIds = collegeList.value.map(c => c.collegeId)
    classList.value = allClassList.value.filter(classItem => schoolCollegeIds.includes(classItem.collegeId))
  } else {
    classList.value = allClassList.value
  }
}

/** 查看成员信息详情 */
function showMemberDetail(organizationId) {
  currentOrganizationId.value = organizationId
  memberQueryParams.value.organizationId = organizationId
  memberQueryParams.value.pageNum = 1
  memberDialogVisible.value = true
  getMemberList()
}

/** 获取成员列表 */
function getMemberList() {
  memberLoading.value = true
  listMember(memberQueryParams.value).then(response => {
    memberList.value = response.rows
    memberTotal.value = response.total
    memberLoading.value = false
    // 保存原始数据
    memberList.value.forEach(member => {
      originalMemberData.value[member.memberId] = JSON.parse(JSON.stringify(member))
    })
  })
}

/** 保存成员修改 */
function handleUpdateMember(row) {
  updateMember(row).then(response => {
    proxy.$modal.msgSuccess("修改成功")
    getMemberList()
  }).catch(() => {
    proxy.$modal.msgError("修改失败")
  })
}

/** 取消成员编辑 */
function handleCancelMemberEdit(row) {
  if (originalMemberData.value[row.memberId]) {
    Object.assign(row, originalMemberData.value[row.memberId])
  }
}

/** 删除成员 */
function handleDeleteMember(row) {
  proxy.$modal.confirm('是否确认删除该成员？').then(function () {
    return delMember(row.memberId)
  }).then(() => {
    getMemberList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

getList()
</script>
