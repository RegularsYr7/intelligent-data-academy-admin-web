<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属学校" prop="schoolId">
            <el-select v-model="queryParams.schoolId" placeholder="请选择所属学校" clearable filterable
              @change="handleQuerySchoolChange" style="width: 100%;">
              <el-option v-for="school in schoolList" :key="school.schoolId" :label="school.schoolName"
                :value="school.schoolId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属学院" prop="collegeId">
            <el-select v-model="queryParams.collegeId" placeholder="请选择所属学院" clearable filterable style="width: 100%;">
              <el-option v-for="college in queryCollegeList" :key="college.collegeId" :label="college.collegeName"
                :value="college.collegeId" />
            </el-select>
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
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="主席名称" prop="presidentName">
            <el-input v-model="queryParams.presidentName" placeholder="请输入主席姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="queryParams.organizationLevel === '2' || queryParams.organizationLevel === '4'">
          <el-form-item label="显示学院" prop="queryCollegeId">
            <el-select v-model="queryParams.queryCollegeId" placeholder="所属学院" clearable filterable
              style="width: 100%;">
              <el-option v-for="college in queryCollegeList" :key="college.collegeId" :label="college.collegeName"
                :value="college.collegeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="queryParams.organizationLevel === '3'">
          <el-form-item label="显示学院班级" prop="classId">
            <el-select v-model="queryParams.classId" placeholder="请选择所属班级" clearable filterable style="width: 100%;">
              <el-option v-for="classItem in queryClassList" :key="classItem.classId" :label="classItem.className"
                :value="classItem.classId" />
            </el-select>
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
      <el-table-column label="所属学校" align="center" prop="schoolName" min-width="120" show-overflow-tooltip />
      <el-table-column label="所属学院" align="center" prop="collegeName" min-width="120" show-overflow-tooltip />
      <el-table-column label="组织等级" align="center" prop="organizationLevel" width="100">
        <template #default="scope">
          <dict-tag :options="edu_organization_level" :value="scope.row.organizationLevel" />
        </template>
      </el-table-column>
      <el-table-column label="成员人数" align="center" prop="memberCount" width="100" />
      <el-table-column label="当前主席" align="center" prop="presidentName" min-width="100" show-overflow-tooltip />
      <el-table-column label="办公地点" align="center" prop="officeLocation" min-width="120" show-overflow-tooltip />
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
              <el-select v-model="form.organizationLevel" placeholder="请选择组织等级" @change="handleLevelChange"
                style="width: 100%;">
                <el-option v-for="dict in edu_organization_level" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
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
          <el-col :span="12"
            v-if="form.organizationLevel === '2' || form.organizationLevel === '3' || form.organizationLevel === '4'">
            <el-form-item label="所属学院" prop="collegeId">
              <el-select v-model="form.collegeId" placeholder="请选择所属学院" clearable filterable
                @change="handleCollegeChange" style="width: 100%;">
                <el-option v-for="college in collegeList" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="form.organizationLevel === '3'">
          <el-col :span="12">
            <el-form-item label="所属班级" prop="classId">
              <el-select v-model="form.classId" placeholder="请选择所属班级" clearable filterable style="width: 100%;">
                <el-option v-for="classItem in classList" :key="classItem.classId" :label="classItem.className"
                  :value="classItem.classId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成立年份" prop="establishYear">
              <el-date-picker v-model="form.establishYear" type="year" placeholder="请选择成立年份" value-format="YYYY"
                style="width: 100%;" />
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
            <el-form-item label="主席姓名" prop="presidentName">
              <el-input v-model="form.presidentName" placeholder="请输入主席姓名" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主席ID" prop="presidentId">
              <el-select v-model="form.presidentId" placeholder="请选择主席" clearable filterable
                @change="handlePresidentChange" style="width: 100%;">
                <el-option v-for="student in studentList" :key="student.studentId"
                  :label="`${student.studentName}（${student.studentNo}）`" :value="student.studentId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="组织logo" prop="organizationLogo">
              <image-upload v-model="form.organizationLogo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="推荐图" prop="recommendImage">
              <image-upload v-model="form.recommendImage" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="组织简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" :rows="3" placeholder="请输入组织简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="推荐文本" prop="displayText">
              <el-input v-model="form.displayText" type="textarea" :rows="3" placeholder="请输入推荐文本" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="主要活动" prop="mainActivities">
              <el-button type="primary" size="small" @click="handleViewActivities">查看活动列表</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="form.organizationId">
          <el-col :span="24">
            <el-form-item label="主要负责人">
              <el-alert title="提示：主要负责人会按照角色等级自动排序" type="info" :closable="false" style="margin-bottom: 10px;" />
              <el-table :data="leadersList" max-height="300" border>
                <el-table-column label="学生姓名" align="center" prop="studentName" min-width="150" />
                <el-table-column label="成员角色" align="center" prop="memberRole" min-width="120">
                  <template #default="scope">
                    <dict-tag :options="edu_member_role" :value="scope.row.memberRole" />
                  </template>
                </el-table-column>
                <el-table-column label="加入时间" align="center" prop="joinTime" min-width="120">
                  <template #default="scope">
                    <span>{{ parseTime(scope.row.joinTime, '{y}-{m}-{d}') }}</span>
                  </template>
                </el-table-column>
              </el-table>
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

    <!-- 主要活动列表对话框 -->
    <el-dialog title="主要活动列表" v-model="activityDialogVisible" width="1200px" append-to-body>
      <el-table v-loading="activityLoading" :data="activityList" max-height="500">
        <el-table-column label="活动名称" align="center" prop="activityName" min-width="150" show-overflow-tooltip />
        <el-table-column label="活动类型" align="center" prop="activityType" width="100" />
        <el-table-column label="开始时间" align="center" prop="startTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动地点" align="center" prop="location" min-width="120" show-overflow-tooltip />
        <el-table-column label="参与人数" align="center" prop="participantCount" width="100" />
        <el-table-column label="状态" align="center" prop="status" width="80">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="activityTotal > 0" :total="activityTotal" v-model:page="activityQueryParams.pageNum"
        v-model:limit="activityQueryParams.pageSize" @pagination="getActivityList" />
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
                      <el-input v-model="row.studentName" disabled />
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
                    <el-form-item label="加入时间">
                      <el-input v-model="row.joinTime" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="状态">
                      <div style="line-height: 32px;">
                        <dict-tag :options="edu_member_status" :value="row.status" />
                      </div>
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
        <el-table-column label="学生姓名" align="center" prop="studentName" width="200" />
        <el-table-column label="成员角色" align="center" prop="memberRole" width="180">
          <template #default="scope">
            <dict-tag :options="edu_member_role" :value="scope.row.memberRole" />
          </template>
        </el-table-column>
        <el-table-column label="加入时间" align="center" prop="joinTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.joinTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="80">
          <template #default="scope">
            <dict-tag :options="edu_member_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="280" fixed="right">
          <template #default="scope">
            <!-- 申请中状态：显示同意/拒绝按钮 -->
            <template v-if="scope.row.status === '2'">
              <el-button link type="success" icon="Check" @click="handleApproveMember(scope.row)"
                v-hasPermi="['edu:member:approve']">同意</el-button>
              <el-button link type="danger" icon="Close" @click="handleRejectMember(scope.row)"
                v-hasPermi="['edu:member:reject']">拒绝</el-button>
            </template>
            <!-- 正常状态：显示设置角色和移除按钮 -->
            <template v-else-if="scope.row.status === '0'">
              <el-button v-if="scope.row.memberRole === '0'" link type="primary" icon="User"
                @click="handleSetAdmin(scope.row)" v-hasPermi="['edu:member:setAdmin']">设为管理员</el-button>
              <el-button v-if="scope.row.memberRole === '1'" link type="warning" icon="User"
                @click="handleRemoveAdmin(scope.row)" v-hasPermi="['edu:member:removeAdmin']">取消管理员</el-button>
              <el-button v-if="scope.row.memberRole !== '2'" link type="primary" icon="User"
                @click="handleSetPresident(scope.row)" v-hasPermi="['edu:member:setPresident']">设为主席</el-button>
              <el-button v-if="scope.row.memberRole === '2'" link type="warning" icon="User"
                @click="handleRemovePresident(scope.row)" v-hasPermi="['edu:member:removePresident']">取消主席</el-button>
              <el-button link type="danger" icon="Delete" @click="handleRemoveMember(scope.row)"
                v-hasPermi="['edu:member:remove']">移除成员</el-button>
            </template>
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
import { listStudent } from "@/api/edu/student"
import { listActivity } from "@/api/edu/activity"

const { proxy } = getCurrentInstance()
const { edu_organization_level, sys_normal_disable, sys_yes_no, edu_member_role, edu_member_status } = proxy.useDict('edu_organization_level', 'sys_normal_disable', 'sys_yes_no', 'edu_member_role', 'edu_member_status')

const schoolList = ref([]) // 学校列表
const collegeList = ref([]) // 当前显示的学院列表（会根据学校筛选）
const classList = ref([]) // 当前显示的班级列表（会根据学院筛选）
const studentList = ref([]) // 学生列表
const allCollegeList = ref([]) // 所有学院列表（用于筛选）
const allClassList = ref([]) // 所有班级列表（用于筛选）

// 查询条件的学院和班级列表
const queryCollegeList = ref([])
const queryClassList = ref([])

const organizationList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

// 活动列表相关
const activityDialogVisible = ref(false)
const activityLoading = ref(false)
const activityList = ref([])
const activityTotal = ref(0)
const activityQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  organizationId: null
})

// 主要负责人相关
const leadersList = ref([])

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
    schoolId: null,
    collegeId: null,
    organizationName: null,
    organizationLevel: null,
    presidentName: null,
    queryCollegeId: null,
    classId: null
  },
  rules: {
    organizationName: [
      { required: true, message: "组织名称不能为空", trigger: "blur" }
    ],
    organizationLevel: [
      { required: true, message: "组织等级不能为空", trigger: "change" }
    ],
    schoolId: [
      { required: true, message: "所属学校不能为空", trigger: "change" }
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
  leadersList.value = [] // 清空负责人列表
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

  // 手动重置级联相关状态
  queryParams.value.schoolId = null
  queryParams.value.collegeId = null
  queryParams.value.classId = null
  queryParams.value.queryCollegeId = null
  queryParams.value.pageNum = 1

  // 重置学院和班级列表为全部
  queryCollegeList.value = allCollegeList.value
  queryClassList.value = allClassList.value

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
    // 将数字类型的年份转换为字符串,以便el-date-picker正确显示
    if (form.value.establishYear && typeof form.value.establishYear === 'number') {
      form.value.establishYear = form.value.establishYear.toString()
    }
    open.value = true
    title.value = "修改组织信息"
    // 修改时根据已选的学校和学院自动筛选列表(传入true表示是初始化,不清空数据)
    if (form.value.schoolId) {
      handleSchoolChange(form.value.schoolId, true)
    }
    if (form.value.collegeId) {
      handleCollegeChange(form.value.collegeId, true)
    }
    // 加载主要负责人列表
    if (form.value.organizationId) {
      getLeadersList()
    }
  })
}

/** 提交按钮 */
function submitForm() {
  // 根据组织等级动态验证
  if (form.value.organizationLevel === '2' || form.value.organizationLevel === '3' || form.value.organizationLevel === '4') {
    if (!form.value.collegeId) {
      proxy.$modal.msgWarning("请选择所属学院")
      return
    }
  }
  if (form.value.organizationLevel === '3') {
    if (!form.value.classId) {
      proxy.$modal.msgWarning("请选择所属班级")
      return
    }
  }

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
function handleSchoolChange(schoolId, isInit = false) {
  // 如果不是初始化加载,则清空下级字段
  if (!isInit) {
    form.value.collegeId = null // 清空学院选择
    form.value.classId = null // 清空班级选择
    form.value.presidentId = null // 清空主席选择
    form.value.presidentName = null
  }
  if (schoolId) {
    // 只显示该学校下的学院
    collegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
    if (!isInit) {
      classList.value = [] // 清空班级列表
    }
    // 加载学生列表
    loadStudentList()
  } else {
    collegeList.value = allCollegeList.value
    classList.value = allClassList.value
    studentList.value = []
  }
}

/** 学院改变事件（级联筛选班级） */
function handleCollegeChange(collegeId, isInit = false) {
  // 如果不是初始化加载,则清空下级字段
  if (!isInit) {
    form.value.classId = null // 清空班级选择
    form.value.presidentId = null // 清空主席选择
    form.value.presidentName = null
  }
  if (collegeId) {
    // 只显示该学院下的班级
    classList.value = allClassList.value.filter(classItem => classItem.collegeId === collegeId)
    // 重新加载学生列表
    loadStudentList()
  } else if (form.value.schoolId) {
    // 如果已选择学校但清空了学院，则显示该学校所有学院的班级
    const schoolCollegeIds = collegeList.value.map(c => c.collegeId)
    classList.value = allClassList.value.filter(classItem => schoolCollegeIds.includes(classItem.collegeId))
    // 重新加载学生列表
    loadStudentList()
  } else {
    classList.value = allClassList.value
    studentList.value = []
  }
}

/** 组织等级改变事件 */
function handleLevelChange(level) {
  // 根据组织等级清空对应字段
  if (level === '1') {
    // 校级:清空学院和班级
    form.value.collegeId = null
    form.value.classId = null
  } else if (level === '2' || level === '4') {
    // 院级或党支部:清空班级
    form.value.classId = null
  }
  // 班级(3)保留学院和班级
}

/** 加载学生列表 */
function loadStudentList() {
  const params = {
    pageNum: 1,
    pageSize: 1000,
    status: '0'
  }
  if (form.value.schoolId) {
    params.schoolId = form.value.schoolId
  }
  if (form.value.collegeId) {
    params.collegeId = form.value.collegeId
  }
  listStudent(params).then(response => {
    studentList.value = response.rows || []
  })
}

/** 主席选择改变事件 */
function handlePresidentChange(studentId) {
  if (studentId) {
    const student = studentList.value.find(s => s.studentId === studentId)
    if (student) {
      form.value.presidentName = student.studentName
    }
  } else {
    form.value.presidentName = null
  }
}

/** 查询条件学校改变 */
function handleQuerySchoolChange(schoolId) {
  queryParams.value.collegeId = null
  queryParams.value.classId = null
  if (schoolId) {
    queryCollegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)
    queryClassList.value = []
  } else {
    queryCollegeList.value = allCollegeList.value
    queryClassList.value = allClassList.value
  }
}

/** 查看活动列表 */
function handleViewActivities() {
  if (!form.value.organizationId) {
    proxy.$modal.msgWarning("请先保存组织信息后再查看活动")
    return
  }
  activityQueryParams.value.organizationId = form.value.organizationId
  activityQueryParams.value.pageNum = 1
  activityDialogVisible.value = true
  getActivityList()
}

/** 获取活动列表 */
function getActivityList() {
  activityLoading.value = true
  listActivity(activityQueryParams.value).then(response => {
    activityList.value = response.rows || []
    activityTotal.value = response.total || 0
    activityLoading.value = false
  })
}

/** 获取主要负责人列表 */
function getLeadersList() {
  memberLoading.value = true
  const params = {
    pageNum: 1,
    pageSize: 100,
    organizationId: form.value.organizationId,
    status: '0'
  }
  listMember(params).then(response => {
    // 按角色等级排序（角色值: 2=主席 > 1=管理员 > 0=普通成员）
    leadersList.value = (response.rows || [])
      .filter(m => m.memberRole === '2' || m.memberRole === '1') // 只显示主席和管理员
      .sort((a, b) => {
        return (b.memberRole || '0') - (a.memberRole || '0') // 降序排序，主席在前
      })
    memberLoading.value = false
  })
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

/** 同意加入申请 */
function handleApproveMember(row) {
  proxy.$modal.confirm('是否同意该成员加入组织？').then(function () {
    row.status = '0' // 设置为正常状态
    row.joinTime = new Date().toISOString().split('T')[0] // 设置加入时间为当前日期
    return updateMember(row)
  }).then(() => {
    getMemberList()
    proxy.$modal.msgSuccess("已同意该成员加入")
  }).catch(() => { })
}

/** 拒绝加入申请 */
function handleRejectMember(row) {
  proxy.$modal.confirm('是否拒绝该成员的加入申请？').then(function () {
    return delMember(row.memberId)
  }).then(() => {
    getMemberList()
    proxy.$modal.msgSuccess("已拒绝申请")
  }).catch(() => { })
}

/** 设为管理员 */
function handleSetAdmin(row) {
  proxy.$modal.confirm('是否设置该成员为管理员？').then(function () {
    row.memberRole = '1' // 设置为管理员
    return updateMember(row)
  }).then(() => {
    getMemberList()
    proxy.$modal.msgSuccess("已设为管理员")
  }).catch(() => { })
}

/** 取消管理员 */
function handleRemoveAdmin(row) {
  proxy.$modal.confirm('是否取消该成员的管理员身份？').then(function () {
    row.memberRole = '0' // 设置为普通成员
    return updateMember(row)
  }).then(() => {
    getMemberList()
    proxy.$modal.msgSuccess("已取消管理员身份")
  }).catch(() => { })
}

/** 设为主席 */
function handleSetPresident(row) {
  proxy.$modal.confirm('设置主席后，原主席将变为普通成员，是否继续？').then(function () {
    row.memberRole = '2' // 设置为主席
    return updateMember(row)
  }).then(() => {
    getMemberList()
    proxy.$modal.msgSuccess("已设为主席")
  }).catch(() => { })
}

/** 取消主席 */
function handleRemovePresident(row) {
  proxy.$modal.confirm('是否取消该成员的主席身份？').then(function () {
    row.memberRole = '0' // 设置为普通成员
    return updateMember(row)
  }).then(() => {
    getMemberList()
    proxy.$modal.msgSuccess("已取消主席身份")
  }).catch(() => { })
}

/** 移除成员 */
function handleRemoveMember(row) {
  // 检查是否是管理员或主席
  if (row.memberRole === '1') {
    proxy.$modal.msgWarning("该成员是管理员，无法移除")
    return
  }
  if (row.memberRole === '2') {
    proxy.$modal.msgWarning("该成员是主席，无法移除")
    return
  }

  proxy.$modal.confirm('是否确认移除该成员？').then(function () {
    return delMember(row.memberId)
  }).then(() => {
    getMemberList()
    proxy.$modal.msgSuccess("已移除成员")
  }).catch(() => { })
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

// 初始化加载
getSchoolList()
getCollegeList()
getClassList()
getList()
</script>
