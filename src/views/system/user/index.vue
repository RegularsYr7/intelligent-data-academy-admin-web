<template>
  <div class="app-container">
    <el-row :gutter="20">
      <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme">
        <!--部门数据-->
        <!-- <pane size="16">
          <el-col>
            <div class="head-container">
              <el-input v-model="deptName" placeholder="请输入部门名称" clearable prefix-icon="Search"
                style="margin-bottom: 20px" />
            </div>
            <div class="head-container">
              <el-tree :data="deptOptions" :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false" :filter-node-method="filterNode" ref="deptTreeRef" node-key="id"
                highlight-current default-expand-all @node-click="handleNodeClick" />
            </div>
          </el-col>
        </pane> -->
        <!--用户数据-->
        <pane size="84">
          <el-col>
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item label="用户名称" prop="userName">
                <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px"
                  @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 240px"
                  @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="所属学校" prop="schoolId" v-if="isAdmin">
                <el-select v-model="queryParams.schoolId" placeholder="请选择学校" clearable style="width: 240px"
                  @change="handleSchoolChange">
                  <el-option v-for="school in schoolOptions" :key="school.schoolId" :label="school.schoolName"
                    :value="school.schoolId" />
                </el-select>
              </el-form-item>
              <el-form-item label="所属学院" prop="collegeId">
                <el-select v-model="queryParams.collegeId" placeholder="请选择学院" clearable style="width: 240px">
                  <el-option v-for="college in collegeOptions" :key="college.collegeId" :label="college.collegeName"
                    :value="college.collegeId" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 240px">
                  <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间" style="width: 308px">
                <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
                  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="handleAdd"
                  v-hasPermi="['system:user:add']">新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                  v-hasPermi="['system:user:edit']">修改</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                  v-hasPermi="['system:user:remove']">删除</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="info" plain icon="Upload" @click="handleImport"
                  v-hasPermi="['system:user:import']">导入</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport"
                  v-hasPermi="['system:user:export']">导出</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns.userId.visible" />
              <el-table-column label="用户名称" align="center" key="userName" prop="userName"
                v-if="columns.userName.visible" :show-overflow-tooltip="true" />
              <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"
                v-if="columns.nickName.visible" :show-overflow-tooltip="true" />
              <el-table-column label="所属学校" align="center" key="schoolName" prop="schoolName"
                v-if="columns.schoolName.visible" :show-overflow-tooltip="true" width="120" />
              <el-table-column label="所属学院" align="center" key="collegeName" prop="collegeName"
                v-if="columns.collegeName.visible" :show-overflow-tooltip="true" width="190" />
              <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"
                v-if="columns.deptName.visible" :show-overflow-tooltip="true" />
              <el-table-column label="角色" align="center" key="roles" v-if="columns.roles.visible"
                :show-overflow-tooltip="true">
                <template #default="scope">
                  <span v-if="scope.row.roles && scope.row.roles.length > 0">
                    {{scope.row.roles.map(role => role.roleName).join(', ')}}
                  </span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber"
                v-if="columns.phonenumber.visible" width="120" />
              <el-table-column label="状态" align="center" key="status" v-if="columns.status.visible">
                <template #default="scope">
                  <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
                    @change="handleStatusChange(scope.row)"></el-switch>
                </template>
              </el-table-column>
              <!-- <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible"
                width="160">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                <template #default="scope">
                  <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                      v-hasPermi="['system:user:edit']"></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                      v-hasPermi="['system:user:remove']"></el-button>
                  </el-tooltip>
                  <el-tooltip content="重置密码" placement="top" v-if="scope.row.userId !== 1">
                    <el-button link type="primary" icon="Key" @click="handleResetPwd(scope.row)"
                      v-hasPermi="['system:user:resetPwd']"></el-button>
                  </el-tooltip>
                  <el-tooltip content="分配角色" placement="top" v-if="scope.row.userId !== 1">
                    <el-button link type="primary" icon="CircleCheck" @click="handleAuthRole(scope.row)"
                      v-hasPermi="['system:user:edit']"></el-button>
                  </el-tooltip>
                  <el-tooltip content="管理班级" placement="top" v-if="isCounselor(scope.row)">
                    <el-button link type="primary" icon="School" @click="handleManageClass(scope.row)"
                      v-hasPermi="['system:user:edit']"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize" @pagination="getList" />
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select v-model="form.deptId" :data="enabledDeptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id" placeholder="请选择归属部门"
                clearable check-strictly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="isAdmin">
            <el-form-item label="所属学校" prop="schoolId">
              <el-select v-model="form.schoolId" placeholder="请选择学校" clearable style="width: 100%"
                @change="handleFormSchoolChange">
                <el-option v-for="school in schoolOptions" :key="school.schoolId" :label="school.schoolName"
                  :value="school.schoolId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="isAdmin ? 12 : 24">
            <el-form-item label="所属学院" prop="collegeId">
              <el-select v-model="form.collegeId" placeholder="请选择学院" clearable style="width: 100%">
                <el-option v-for="college in formCollegeOptions" :key="college.collegeId" :label="college.collegeName"
                  :value="college.collegeId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择">
                <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId"
                  :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId"
                  :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :on-change="handleFileChange"
        :on-remove="handleFileRemove" :auto-upload="false" drag>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
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

    <!-- 班级管理弹窗 -->
    <el-dialog title="管理班级" v-model="classDialogVisible" width="700px" append-to-body>
      <div v-loading="classLoading">
        <el-alert :title="`为 ${currentUser.nickName} 管理班级`" type="info" :closable="false" style="margin-bottom: 15px">
        </el-alert>

        <div class="class-header">
          <span style="font-weight: bold">已管理的班级 ({{ userClassList.length }})</span>
          <el-button type="primary" size="small" icon="Plus" @click="openAddClassDialog">
            添加班级
          </el-button>
        </div>

        <el-table :data="userClassList" border style="margin-top: 10px" empty-text="暂无管理班级">
          <el-table-column prop="className" label="班级名称" align="center" />
          <el-table-column prop="collegeName" label="所属学院" align="center" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button link type="danger" size="small" icon="Delete" @click="handleRemoveClass(scope.row)">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <el-button @click="classDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 添加班级选择器弹窗 -->
    <el-dialog title="选择班级" v-model="addClassDialogVisible" width="500px" append-to-body>
      <el-select v-model="selectedClassIds" multiple placeholder="请选择要添加的班级" style="width: 100%" collapse-tags
        collapse-tags-tooltip>
        <el-option v-for="item in availableClasses" :key="item.classId"
          :label="`${item.className} - ${item.collegeName || ''}`" :value="item.classId"
          :disabled="isClassManaged(item.classId)">
        </el-option>
      </el-select>

      <template #footer>
        <el-button @click="addClassDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddClasses">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="User">
import { getToken } from "@/utils/auth"
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import { changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUser, deptTreeSelect } from "@/api/system/user"
import { getUserClassList, addUserClasses, removeUserClass } from "@/api/system/userClass"
import { listClass } from "@/api/edu/class"
import { listSchool } from "@/api/edu/school"
import { listCollege } from "@/api/edu/college"
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const { proxy } = getCurrentInstance()
const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex")

const userList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const dateRange = ref([])
const deptName = ref("")
const deptOptions = ref(undefined)
const enabledDeptOptions = ref(undefined)
const initPassword = ref(undefined)
const postOptions = ref([])
const roleOptions = ref([])
const schoolOptions = ref([]) // 学校选项
const collegeOptions = ref([]) // 学院选项（查询条件用）
const formCollegeOptions = ref([]) // 学院选项（表单用）

// 判断是否为超级管理员
const isAdmin = computed(() => {
  return userStore.roles.includes('admin')
})

// 获取当前用户的学校ID
const currentSchoolId = computed(() => {
  return userStore.schoolInfo?.schoolId || null
})

// 班级管理相关数据
const classDialogVisible = ref(false) // 班级管理弹窗显示状态
const addClassDialogVisible = ref(false) // 添加班级弹窗显示状态
const classLoading = ref(false) // 班级列表加载状态
const currentUser = ref({}) // 当前操作的用户
const userClassList = ref([]) // 用户已管理的班级列表
const selectedClassIds = ref([]) // 选中的班级ID数组
const availableClasses = ref([]) // 可选的班级列表
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
})
// 列显隐信息
const columns = ref({
  userId: { label: '用户编号', visible: true },
  userName: { label: '用户名称', visible: true },
  nickName: { label: '用户昵称', visible: true },
  schoolName: { label: '所属学校', visible: true },
  collegeName: { label: '所属学院', visible: true },
  deptName: { label: '部门', visible: true },
  roles: { label: '角色', visible: true },
  phonenumber: { label: '手机号码', visible: true },
  status: { label: '状态', visible: true },
  createTime: { label: '创建时间', visible: true }
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phonenumber: undefined,
    status: undefined,
    deptId: undefined,
    schoolId: undefined,
    collegeId: undefined
  },
  rules: {
    userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
    nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
    password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }, { pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val)
})

/** 查询用户列表 */
function getList() {
  loading.value = true
  listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    loading.value = false
    userList.value = res.rows
    total.value = res.total
  })
}

/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data
    enabledDeptOptions.value = filterDisabledDept(JSON.parse(JSON.stringify(response.data)))
  })
}

/** 加载学校列表 */
function loadSchoolOptions() {
  listSchool({}).then(response => {
    schoolOptions.value = response.rows || []
  })
}

/** 加载学院列表（查询条件用） */
function loadCollegeOptions(schoolId) {
  // 如果传入了schoolId，使用传入的值
  if (schoolId) {
    listCollege({ schoolId: schoolId }).then(response => {
      collegeOptions.value = response.rows || []
    })
  } else {
    // 没有传入schoolId时，清空学院列表
    collegeOptions.value = []
  }
}

/** 加载学院列表（表单用） */
function loadFormCollegeOptions(schoolId) {
  // 如果传入了schoolId，使用传入的值
  if (schoolId) {
    listCollege({ schoolId: schoolId }).then(response => {
      formCollegeOptions.value = response.rows || []
    })
  } else {
    // 没有传入schoolId时，清空学院列表
    formCollegeOptions.value = []
  }
}

/** 查询条件-学校改变 */
function handleSchoolChange(schoolId) {
  // 清空学院选择
  queryParams.value.collegeId = undefined
  // 重新加载学院选项
  loadCollegeOptions(schoolId)
}

/** 表单-学校改变 */
function handleFormSchoolChange(schoolId) {
  // 清空学院选择
  form.value.collegeId = undefined
  // 重新加载学院选项
  loadFormCollegeOptions(schoolId)
}

/** 过滤禁用的部门 */
function filterDisabledDept(deptList) {
  return deptList.filter(dept => {
    if (dept.disabled) {
      return false
    }
    if (dept.children && dept.children.length) {
      dept.children = filterDisabledDept(dept.children)
    }
    return true
  })
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id
  handleQuery()
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = []
  proxy.resetForm("queryRef")
  queryParams.value.deptId = undefined
  queryParams.value.schoolId = undefined
  queryParams.value.collegeId = undefined
  // proxy.$refs.deptTreeRef.setCurrentKey(null) // 部门树已注释,不需要重置
  handleQuery()
}

/** 删除按钮操作 */
function handleDelete(row) {
  const userIds = row.userId || ids.value
  proxy.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function () {
    return delUser(userIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/user/export", {
    ...queryParams.value,
  }, `user_${new Date().getTime()}.xlsx`)
}

/** 用户状态修改  */
function handleStatusChange(row) {
  let text = row.status === "0" ? "启用" : "停用"
  proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
    return changeUserStatus(row.userId, row.status)
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功")
  }).catch(function () {
    row.status = row.status === "0" ? "1" : "0"
  })
}

/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row)
      break
    case "handleAuthRole":
      handleAuthRole(row)
      break
    default:
      break
  }
}

/** 跳转角色分配 */
function handleAuthRole(row) {
  const userId = row.userId
  router.push("/system/user-auth/role/" + userId)
}

/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
    inputValidator: (value) => {
      if (/<|>|"|'|\||\\/.test(value)) {
        return "不能包含非法字符：< > \" ' \\\ |"
      }
    },
  }).then(({ value }) => {
    resetUserPwd(row.userId, value).then(response => {
      proxy.$modal.msgSuccess("修改成功，新密码是：" + value)
    })
  }).catch(() => { })
}

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.userId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入"
  upload.open = true
  upload.selectedFile = null
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download("system/user/importTemplate", {
  }, `user_template_${new Date().getTime()}.xlsx`)
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true
}

/** 文件选择处理 */
const handleFileChange = (file, fileList) => {
  upload.selectedFile = file
}

/** 文件删除处理 */
const handleFileRemove = (file, fileList) => {
  upload.selectedFile = null
}

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false
  upload.isUploading = false
  proxy.$refs["uploadRef"].handleRemove(file)
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true })
  getList()
}

/** 提交上传文件 */
function submitFileForm() {
  const file = upload.selectedFile
  if (!file || file.length === 0 || !file.name.toLowerCase().endsWith('.xls') && !file.name.toLowerCase().endsWith('.xlsx')) {
    proxy.$modal.msgError("请选择后缀为 “xls”或“xlsx”的文件。")
    return
  }
  proxy.$refs["uploadRef"].submit()
}

/** 重置操作表单 */
function reset() {
  form.value = {
    userId: undefined,
    deptId: undefined,
    userName: undefined,
    nickName: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    sex: undefined,
    status: "0",
    remark: undefined,
    postIds: [],
    roleIds: []
  }
  proxy.resetForm("userRef")
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getUser().then(response => {
    postOptions.value = response.posts
    roleOptions.value = response.roles
    open.value = true
    title.value = "添加用户"
    form.value.password = initPassword.value

    // 非超管自动设置学校ID
    if (!isAdmin.value && currentSchoolId.value) {
      form.value.schoolId = currentSchoolId.value
      // 加载该学校的学院列表
      loadFormCollegeOptions(currentSchoolId.value)
    }
  })
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const userId = row.userId || ids.value
  getUser(userId).then(response => {
    form.value = response.data
    postOptions.value = response.posts
    roleOptions.value = response.roles
    form.value.postIds = response.postIds
    form.value.roleIds = response.roleIds
    open.value = true
    title.value = "修改用户"
    form.password = ""

    // 加载学院列表（根据用户已有的学校ID或当前登录用户的学校ID）
    const schoolId = form.value.schoolId || (!isAdmin.value ? currentSchoolId.value : null)
    if (schoolId) {
      loadFormCollegeOptions(schoolId)
    }
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      // 非超管自动设置学校ID
      if (!isAdmin.value && currentSchoolId.value && !form.value.schoolId) {
        form.value.schoolId = currentSchoolId.value
      }

      if (form.value.userId != undefined) {
        updateUser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addUser(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 判断是否是辅导员 */
function isCounselor(row) {
  return row.roles && row.roles.some(role => role.roleId === 100)
}

/** 打开班级管理弹窗 */
function handleManageClass(row) {
  currentUser.value = row
  loadUserClasses(row.userId)
  classDialogVisible.value = true
}

/** 加载用户管理的班级 */
async function loadUserClasses(userId) {
  classLoading.value = true
  try {
    const response = await getUserClassList(userId)
    userClassList.value = response.data || []
  } catch (error) {
    proxy.$modal.msgError("加载班级列表失败")
  } finally {
    classLoading.value = false
  }
}

/** 打开添加班级弹窗 */
async function openAddClassDialog() {
  try {
    const response = await listClass({
      collegeId: currentUser.value.collegeId
    })
    availableClasses.value = response.rows || []
    selectedClassIds.value = []
    addClassDialogVisible.value = true
  } catch (error) {
    proxy.$modal.msgError("加载班级选项失败")
  }
}

/** 判断班级是否已被管理 */
function isClassManaged(classId) {
  return userClassList.value.some(item => item.classId === classId)
}

/** 添加班级 */
async function handleAddClasses() {
  if (selectedClassIds.value.length === 0) {
    proxy.$modal.msgWarning("请选择至少一个班级")
    return
  }

  try {
    await addUserClasses({
      userId: currentUser.value.userId,
      classIds: selectedClassIds.value
    })

    proxy.$modal.msgSuccess("添加成功")
    addClassDialogVisible.value = false
    loadUserClasses(currentUser.value.userId)
    getList()
  } catch (error) {
    proxy.$modal.msgError("添加失败")
  }
}

/** 移除班级 */
async function handleRemoveClass(row) {
  proxy.$modal.confirm(`确定要移除 ${row.className} 吗?`).then(async () => {
    try {
      await removeUserClass(currentUser.value.userId, row.classId)
      proxy.$modal.msgSuccess("移除成功")
      loadUserClasses(currentUser.value.userId)
      getList()
    } catch (error) {
      proxy.$modal.msgError("移除失败")
    }
  }).catch(() => { })
}

onMounted(() => {
  getDeptTree()
  getList()

  // 只有超管才加载学校选项
  if (isAdmin.value) {
    loadSchoolOptions()
    // 超管不自动加载学院列表，等待选择学校后再加载
  } else {
    // 非超管：使用当前用户的学校ID自动加载学院列表
    if (currentSchoolId.value) {
      loadCollegeOptions(currentSchoolId.value)
    }
  }

  proxy.getConfigKey("sys.user.initPassword").then(response => {
    initPassword.value = response.msg
  })
})
</script>

<style scoped>
.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
