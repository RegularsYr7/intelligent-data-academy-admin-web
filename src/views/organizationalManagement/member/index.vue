<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="成员关系ID" prop="memberId">
            <el-input v-model="queryParams.memberId" placeholder="请输入成员关系ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组织ID" prop="organizationId">
            <el-input v-model="queryParams.organizationId" placeholder="请输入组织ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学生ID" prop="studentId">
            <el-input v-model="queryParams.studentId" placeholder="请输入学生ID" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学生姓名" prop="studentName">
            <el-input v-model="queryParams.studentName" placeholder="请输入学生姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="成员角色" prop="memberRole">
            <el-select v-model="queryParams.memberRole" placeholder="请选择成员角色" clearable style="width: 100%;">
              <el-option v-for="dict in edu_member_role" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人员标签" prop="memberTag">
            <el-input v-model="queryParams.memberTag" placeholder="请输入人员标签" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="加入时间">
            <el-date-picker v-model="daterangeJoinTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
              <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 18px;">
        <el-col :span="6">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:member:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:member:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:member:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:member:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed />
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
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:member:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:member:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改组织成员关系对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="memberRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属组织" prop="organizationId">
              <el-select v-model="form.organizationId" placeholder="请选择所属组织" clearable filterable style="width: 100%">
                <el-option v-for="org in organizationList" :key="org.organizationId" :label="org.organizationName"
                  :value="org.organizationId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生ID" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学生ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成员角色" prop="memberRole">
              <el-select v-model="form.memberRole" placeholder="请选择成员角色" style="width: 100%">
                <el-option v-for="dict in edu_member_role" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员标签" prop="memberTag">
              <el-input v-model="form.memberTag" placeholder="请输入人员标签" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加入时间" prop="joinTime">
              <el-date-picker clearable v-model="form.joinTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择加入时间" style="width: 100%">
              </el-date-picker>
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

<script setup name="Member">
import { listMember, getMember, delMember, addMember, updateMember } from "@/api/edu/member"
import { listOrganization } from "@/api/edu/organization"

const { proxy } = getCurrentInstance()
const { edu_member_role, sys_normal_disable } = proxy.useDict('edu_member_role', 'sys_normal_disable')

const organizationList = ref([]) // 组织列表

const memberList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeJoinTime = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    memberId: null,
    organizationId: null,
    studentId: null,
    studentName: null,
    memberRole: null,
    memberTag: null,
    joinTime: null,
    status: null,
    createTime: null,
  },
  rules: {
    organizationId: [
      { required: true, message: "组织ID不能为空", trigger: "blur" }
    ],
    studentId: [
      { required: true, message: "学生ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询组织成员关系列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeJoinTime && '' != daterangeJoinTime) {
    queryParams.value.params["beginJoinTime"] = daterangeJoinTime.value[0]
    queryParams.value.params["endJoinTime"] = daterangeJoinTime.value[1]
  }
  listMember(queryParams.value).then(response => {
    memberList.value = response.rows
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
    memberId: null,
    organizationId: null,
    studentId: null,
    studentName: null,
    memberRole: null,
    memberTag: null,
    joinTime: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("memberRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeJoinTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.memberId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 获取组织列表 */
function getOrganizationList() {
  listOrganization().then(response => {
    organizationList.value = response.rows
  })
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  getOrganizationList()
  open.value = true
  title.value = "添加组织成员关系"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getOrganizationList()
  const _memberId = row.memberId || ids.value
  getMember(_memberId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改组织成员关系"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["memberRef"].validate(valid => {
    if (valid) {
      if (form.value.memberId != null) {
        updateMember(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMember(form.value).then(response => {
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
  const _memberIds = row.memberId || ids.value
  proxy.$modal.confirm('是否确认删除组织成员关系编号为"' + _memberIds + '"的数据项？').then(function () {
    return delMember(_memberIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/member/export', {
    ...queryParams.value
  }, `member_${new Date().getTime()}.xlsx`)
}

getList()
</script>
