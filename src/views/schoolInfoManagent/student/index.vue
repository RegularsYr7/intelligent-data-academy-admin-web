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
          <el-form-item label="专业" prop="majorId">
            <el-select v-model="queryParams.majorId" :placeholder="queryParams.collegeId ? '请选择专业' : '请先选择学院'"
              :disabled="!queryParams.collegeId" clearable filterable @change="handleQueryMajorChange"
              style="width: 100%;">
              <el-option v-for="item in queryFilteredMajorList" :key="item.majorId" :label="item.majorName"
                :value="item.majorId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班级" prop="classId">
            <el-select v-model="queryParams.classId" :placeholder="queryParams.majorId ? '请选择班级' : '请先选择专业'"
              :disabled="!queryParams.majorId" clearable filterable style="width: 100%;">
              <el-option v-for="item in queryFilteredClassList" :key="item.classId" :label="item.className"
                :value="item.classId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学号" prop="studentNo">
            <el-input v-model="queryParams.studentNo" placeholder="请输入学号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名" prop="studentName">
            <el-input v-model="queryParams.studentName" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号" prop="phoneCode">
            <el-input v-model="queryParams.phoneCode" placeholder="请输入手机号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="入学时间">
            <el-date-picker v-model="daterangeEnrollmentDate" value-format="YYYY-MM-DD" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="民族" prop="nation">
            <el-select v-model="queryParams.nation" placeholder="请选择民族" clearable filterable style="width: 100%;">
              <el-option label="汉族" value="汉族" />
              <el-option label="蒙古族" value="蒙古族" />
              <el-option label="回族" value="回族" />
              <el-option label="藏族" value="藏族" />
              <el-option label="维吾尔族" value="维吾尔族" />
              <el-option label="苗族" value="苗族" />
              <el-option label="彝族" value="彝族" />
              <el-option label="壮族" value="壮族" />
              <el-option label="布依族" value="布依族" />
              <el-option label="朝鲜族" value="朝鲜族" />
              <el-option label="满族" value="满族" />
              <el-option label="侗族" value="侗族" />
              <el-option label="瑶族" value="瑶族" />
              <el-option label="白族" value="白族" />
              <el-option label="土家族" value="土家族" />
              <el-option label="哈尼族" value="哈尼族" />
              <el-option label="哈萨克族" value="哈萨克族" />
              <el-option label="傣族" value="傣族" />
              <el-option label="黎族" value="黎族" />
              <el-option label="傈僳族" value="傈僳族" />
              <el-option label="佤族" value="佤族" />
              <el-option label="畲族" value="畲族" />
              <el-option label="高山族" value="高山族" />
              <el-option label="拉祜族" value="拉祜族" />
              <el-option label="水族" value="水族" />
              <el-option label="东乡族" value="东乡族" />
              <el-option label="纳西族" value="纳西族" />
              <el-option label="景颇族" value="景颇族" />
              <el-option label="柯尔克孜族" value="柯尔克孜族" />
              <el-option label="土族" value="土族" />
              <el-option label="达斡尔族" value="达斡尔族" />
              <el-option label="仫佬族" value="仫佬族" />
              <el-option label="羌族" value="羌族" />
              <el-option label="布朗族" value="布朗族" />
              <el-option label="撒拉族" value="撒拉族" />
              <el-option label="毛南族" value="毛南族" />
              <el-option label="仡佬族" value="仡佬族" />
              <el-option label="锡伯族" value="锡伯族" />
              <el-option label="阿昌族" value="阿昌族" />
              <el-option label="普米族" value="普米族" />
              <el-option label="塔吉克族" value="塔吉克族" />
              <el-option label="怒族" value="怒族" />
              <el-option label="乌孜别克族" value="乌孜别克族" />
              <el-option label="俄罗斯族" value="俄罗斯族" />
              <el-option label="鄂温克族" value="鄂温克族" />
              <el-option label="德昂族" value="德昂族" />
              <el-option label="保安族" value="保安族" />
              <el-option label="裕固族" value="裕固族" />
              <el-option label="京族" value="京族" />
              <el-option label="塔塔尔族" value="塔塔尔族" />
              <el-option label="独龙族" value="独龙族" />
              <el-option label="鄂伦春族" value="鄂伦春族" />
              <el-option label="赫哲族" value="赫哲族" />
              <el-option label="门巴族" value="门巴族" />
              <el-option label="珞巴族" value="珞巴族" />
              <el-option label="基诺族" value="基诺族" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="政治面貌" prop="politicalStatus">
            <el-select v-model="queryParams.politicalStatus" placeholder="请选择政治面貌" clearable style="width: 100%;">
              <el-option label="中共党员" value="中共党员" />
              <el-option label="中共预备党员" value="中共预备党员" />
              <el-option label="共青团员" value="共青团员" />
              <el-option label="民革党员" value="民革党员" />
              <el-option label="民盟盟员" value="民盟盟员" />
              <el-option label="民建会员" value="民建会员" />
              <el-option label="民进会员" value="民进会员" />
              <el-option label="农工党党员" value="农工党党员" />
              <el-option label="致公党党员" value="致公党党员" />
              <el-option label="九三学社社员" value="九三学社社员" />
              <el-option label="台盟盟员" value="台盟盟员" />
              <el-option label="无党派人士" value="无党派人士" />
              <el-option label="群众" value="群众" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年级" prop="grade">
            <el-input v-model="queryParams.grade" placeholder="请输入年级" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="社区昵称" prop="communityName">
            <el-input v-model="queryParams.communityName" placeholder="请输入社区昵称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['edu:student:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['edu:student:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['edu:student:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['edu:student:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Upload" @click="handleImport"
          v-hasPermi="['edu:student:import']">导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="学号" align="center" prop="studentNo" min-width="120" show-overflow-tooltip fixed="left" />
      <el-table-column label="姓名" align="center" prop="studentName" min-width="100" show-overflow-tooltip
        fixed="left" />
      <el-table-column label="学校" align="center" prop="schoolId" min-width="120" show-overflow-tooltip>
        <template #default="scope">
          <span>{{schoolOptions.find(s => s.schoolId === scope.row.schoolId)?.schoolName || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" align="center" prop="collegeId" min-width="140" show-overflow-tooltip>
        <template #default="scope">
          <span>{{collegeOptions.find(c => c.collegeId === scope.row.collegeId)?.collegeName || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" align="center" prop="majorId" min-width="160" show-overflow-tooltip>
        <template #default="scope">
          <span>{{majorOptions.find(m => m.majorId === scope.row.majorId)?.majorName || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center" prop="classId" min-width="140" show-overflow-tooltip>
        <template #default="scope">
          <span>{{classOptions.find(c => c.classId === scope.row.classId)?.className || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phoneCode" min-width="120" show-overflow-tooltip />
      <el-table-column label="身份证号" align="center" prop="idCard" min-width="180" show-overflow-tooltip />
      <el-table-column label="年级" align="center" prop="grade" min-width="100" show-overflow-tooltip />
      <el-table-column label="社区昵称" align="center" prop="communityName" min-width="120" show-overflow-tooltip />
      <el-table-column label="量化分" align="center" prop="quantitativeScore" min-width="100">
        <template #default="scope">
          <span style="color: #409EFF; font-weight: bold;">{{ scope.row.quantitativeScore || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入学时间" align="center" prop="enrollmentDate" min-width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.enrollmentDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" align="center" prop="nation" min-width="100" />
      <el-table-column label="政治面貌" align="center" prop="politicalStatus" min-width="120" />
      <el-table-column label="状态" align="center" prop="status" min-width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="粉丝" align="center" width="120" fixed="right">
        <template #default="scope">
          <el-button link type="success" icon="User" @click="handleViewFans(scope.row)">粉丝列表</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleViewQuantitative(scope.row)">查看量化</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['edu:student:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['edu:student:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 查看学生量化记录对话框 -->
    <el-dialog title="学生量化记录" v-model="quantitativeDialogVisible" width="1400px" append-to-body>
      <div class="quantitative-header">
        <div class="student-info">
          <el-descriptions :column="4" border>
            <el-descriptions-item label="学号">{{ currentStudent.studentNo }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ currentStudent.studentName }}</el-descriptions-item>
            <el-descriptions-item label="班级">{{classOptions.find(c => c.classId === currentStudent.classId)?.className
              ||
              '-'}}</el-descriptions-item>
            <el-descriptions-item label="当前量化分">
              <span style="color: #409EFF; font-weight: bold; font-size: 16px;">{{ currentStudent.quantitativeScore || 0
              }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <el-divider />

      <!-- 量化记录搜索表单 -->
      <el-form :model="quantitativeQueryParams" ref="quantitativeQueryRef" label-width="100px"
        style="margin-top: 20px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="记录类型" prop="recordType">
              <el-select v-model="quantitativeQueryParams.recordType" placeholder="请选择记录类型" clearable
                style="width: 100%;">
                <el-option v-for="dict in edu_quantitative_type" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源名称" prop="sourceName">
              <el-input v-model="quantitativeQueryParams.sourceName" placeholder="请输入来源名称" clearable
                @keyup.enter="handleQuantitativeQuery" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="记录时间">
              <el-date-picker v-model="quantitativeDateRange" value-format="YYYY-MM-DD" type="daterange"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuantitativeQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuantitativeQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 量化记录列表 -->
      <el-table v-loading="quantitativeLoading" :data="quantitativeList" style="margin-top: 10px;">
        <el-table-column label="记录类型" align="center" prop="recordType" width="120">
          <template #default="scope">
            <dict-tag :options="edu_quantitative_type" :value="scope.row.recordType" />
          </template>
        </el-table-column>
        <el-table-column label="来源名称" align="center" prop="sourceName" min-width="180" show-overflow-tooltip />
        <el-table-column label="分数变化" align="center" prop="score" width="200">
          <template #default="scope">
            <span :style="{ color: scope.row.score > 0 ? '#67C23A' : '#F56C6C', fontWeight: 'bold' }">
              {{ scope.row.score > 0 ? '+' : '' }}{{ scope.row.score }}
            </span>
            <span style="color: #909399; margin-left: 8px;">
              ({{ scope.row.scoreBefore }} → {{ scope.row.scoreAfter }})
            </span>
          </template>
        </el-table-column>
        <el-table-column label="记录时间" align="center" prop="recordTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.recordTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" min-width="150" show-overflow-tooltip />
      </el-table>

      <pagination v-show="quantitativeTotal > 0" :total="quantitativeTotal"
        v-model:page="quantitativeQueryParams.pageNum" v-model:limit="quantitativeQueryParams.pageSize"
        @pagination="getQuantitativeList" />

      <template #footer>
        <div class="dialog-footer">
          <el-button type="success" icon="Download" @click="handleExportQuantitative">导出量化记录</el-button>
          <el-button @click="quantitativeDialogVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改学生信息对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="studentRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="studentNo">
              <el-input v-model="form.studentNo" placeholder="请输入学号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phoneCode">
              <el-input v-model="form.phoneCode" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入学时间" prop="enrollmentDate">
              <el-date-picker clearable v-model="form.enrollmentDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择入学时间" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-select v-model="form.nation" placeholder="请选择民族" filterable style="width: 100%;">
                <el-option label="汉族" value="汉族" />
                <el-option label="蒙古族" value="蒙古族" />
                <el-option label="回族" value="回族" />
                <el-option label="藏族" value="藏族" />
                <el-option label="维吾尔族" value="维吾尔族" />
                <el-option label="苗族" value="苗族" />
                <el-option label="彝族" value="彝族" />
                <el-option label="壮族" value="壮族" />
                <el-option label="布依族" value="布依族" />
                <el-option label="朝鲜族" value="朝鲜族" />
                <el-option label="满族" value="满族" />
                <el-option label="侗族" value="侗族" />
                <el-option label="瑶族" value="瑶族" />
                <el-option label="白族" value="白族" />
                <el-option label="土家族" value="土家族" />
                <el-option label="哈尼族" value="哈尼族" />
                <el-option label="哈萨克族" value="哈萨克族" />
                <el-option label="傣族" value="傣族" />
                <el-option label="黎族" value="黎族" />
                <el-option label="傈僳族" value="傈僳族" />
                <el-option label="佤族" value="佤族" />
                <el-option label="畲族" value="畲族" />
                <el-option label="高山族" value="高山族" />
                <el-option label="拉祜族" value="拉祜族" />
                <el-option label="水族" value="水族" />
                <el-option label="东乡族" value="东乡族" />
                <el-option label="纳西族" value="纳西族" />
                <el-option label="景颇族" value="景颇族" />
                <el-option label="柯尔克孜族" value="柯尔克孜族" />
                <el-option label="土族" value="土族" />
                <el-option label="达斡尔族" value="达斡尔族" />
                <el-option label="仫佬族" value="仫佬族" />
                <el-option label="羌族" value="羌族" />
                <el-option label="布朗族" value="布朗族" />
                <el-option label="撒拉族" value="撒拉族" />
                <el-option label="毛南族" value="毛南族" />
                <el-option label="仡佬族" value="仡佬族" />
                <el-option label="锡伯族" value="锡伯族" />
                <el-option label="阿昌族" value="阿昌族" />
                <el-option label="普米族" value="普米族" />
                <el-option label="塔吉克族" value="塔吉克族" />
                <el-option label="怒族" value="怒族" />
                <el-option label="乌孜别克族" value="乌孜别克族" />
                <el-option label="俄罗斯族" value="俄罗斯族" />
                <el-option label="鄂温克族" value="鄂温克族" />
                <el-option label="德昂族" value="德昂族" />
                <el-option label="保安族" value="保安族" />
                <el-option label="裕固族" value="裕固族" />
                <el-option label="京族" value="京族" />
                <el-option label="塔塔尔族" value="塔塔尔族" />
                <el-option label="独龙族" value="独龙族" />
                <el-option label="鄂伦春族" value="鄂伦春族" />
                <el-option label="赫哲族" value="赫哲族" />
                <el-option label="门巴族" value="门巴族" />
                <el-option label="珞巴族" value="珞巴族" />
                <el-option label="基诺族" value="基诺族" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌" prop="politicalStatus">
              <el-select v-model="form.politicalStatus" placeholder="请选择政治面貌" style="width: 100%;">
                <el-option label="中共党员" value="中共党员" />
                <el-option label="中共预备党员" value="中共预备党员" />
                <el-option label="共青团员" value="共青团员" />
                <el-option label="民革党员" value="民革党员" />
                <el-option label="民盟盟员" value="民盟盟员" />
                <el-option label="民建会员" value="民建会员" />
                <el-option label="民进会员" value="民进会员" />
                <el-option label="农工党党员" value="农工党党员" />
                <el-option label="致公党党员" value="致公党党员" />
                <el-option label="九三学社社员" value="九三学社社员" />
                <el-option label="台盟盟员" value="台盟盟员" />
                <el-option label="无党派人士" value="无党派人士" />
                <el-option label="群众" value="群众" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="form.grade" placeholder="请输入年级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血型" prop="bloodType">
              <el-select v-model="form.bloodType" placeholder="请选择血型" style="width: 100%;">
                <el-option v-for="dict in edu_blood_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
            <el-form-item label="专业" prop="majorId">
              <el-select v-model="form.majorId" :placeholder="form.collegeId ? '请选择专业' : '请先选择学院'"
                :disabled="!form.collegeId" @change="handleFormMajorChange" style="width: 100%;" filterable>
                <el-option v-for="item in formFilteredMajorList" :key="item.majorId" :label="item.majorName"
                  :value="item.majorId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" prop="classId">
              <el-select v-model="form.classId" :placeholder="form.majorId ? '请选择班级' : '请先选择专业'"
                :disabled="!form.majorId" style="width: 100%;" filterable>
                <el-option v-for="item in formFilteredClassList" :key="item.classId" :label="item.className"
                  :value="item.classId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社区昵称" prop="communityName">
              <el-input v-model="form.communityName" placeholder="请输入社区昵称（用户在社区中的显示名称）" />
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

    <!-- 粉丝列表对话框 -->
    <el-dialog title="粉丝列表" v-model="fansDialogVisible" width="1200px" append-to-body>
      <div class="fans-header">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="学号">{{ currentStudent.studentNo }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ currentStudent.studentName }}</el-descriptions-item>
          <el-descriptions-item label="粉丝总数">
            <span style="color: #409EFF; font-weight: bold; font-size: 16px;">{{ fansTotal }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-divider />

      <!-- 粉丝列表搜索表单 -->
      <el-form :model="fansQueryParams" ref="fansQueryRef" :inline="true" label-width="100px" style="margin-top: 20px;">
        <el-form-item label="粉丝姓名" prop="followerName">
          <el-input v-model="fansQueryParams.followerName" placeholder="请输入粉丝姓名" clearable style="width: 200px;"
            @keyup.enter="handleFansQuery" />
        </el-form-item>
        <el-form-item label="关注时间">
          <el-date-picker v-model="fansDateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
            start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleFansQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetFansQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 粉丝列表 -->
      <el-table v-loading="fansLoading" :data="fansList" style="margin-top: 10px;">
        <el-table-column label="关注ID" align="center" prop="followId" width="90" />
        <el-table-column label="粉丝ID" align="center" prop="followerId" width="90" />
        <el-table-column label="粉丝姓名" align="center" prop="followerName" min-width="120" show-overflow-tooltip />
        <el-table-column label="粉丝头像" align="center" prop="followerAvatar" width="80">
          <template #default="scope">
            <el-image v-if="scope.row.followerAvatar" :src="scope.row.followerAvatar"
              :preview-src-list="[scope.row.followerAvatar]" fit="cover"
              style="width: 40px; height: 40px; border-radius: 50%;" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="关注时间" align="center" prop="createTime" width="110">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="danger" icon="Delete" @click="handleDeleteFans(scope.row)"
              v-hasPermi="['edu:communityFollow:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="fansTotal > 0" :total="fansTotal" v-model:page="fansQueryParams.pageNum"
        v-model:limit="fansQueryParams.pageSize" @pagination="getFansList" />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="fansDialogVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 学生信息导入对话框 -->
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
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的学生数据
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

<script setup name="Student">
import { listStudent, getStudent, delStudent, addStudent, updateStudent } from "@/api/edu/student"
import { listSchool } from "@/api/edu/school";
import { listCollege } from "@/api/edu/college";
import { listMajor } from "@/api/edu/major";
import { listClass } from "@/api/edu/class";
import { listQuantitative } from "@/api/edu/quantitative";
import { listCommunityFollow, delCommunityFollow } from "@/api/edu/communityFollow";
import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance()
const { edu_blood_type, sys_normal_disable, edu_education_level, edu_quantitative_type } = proxy.useDict('edu_blood_type', 'sys_normal_disable', 'edu_education_level', 'edu_quantitative_type')

const studentList = ref([])
const schoolOptions = ref([]);
const collegeOptions = ref([]);
const majorOptions = ref([]);
const classOptions = ref([]);

const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeEnrollmentDate = ref([])
const daterangeGraduationDate = ref([])
const daterangeBirthday = ref([])

// 量化记录相关
const quantitativeDialogVisible = ref(false)
const quantitativeLoading = ref(false)
const quantitativeList = ref([])
const quantitativeTotal = ref(0)
const quantitativeDateRange = ref([])
const currentStudent = ref({})
const quantitativeQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  studentId: null,
  recordType: null,
  sourceName: null,
  recordTime: null,
})

// 粉丝列表相关
const fansDialogVisible = ref(false)
const fansLoading = ref(false)
const fansList = ref([])
const fansTotal = ref(0)
const fansDateRange = ref([])
const fansQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  followeeId: null,
  followerName: null,
  createTime: null,
})

// 学生信息导入参数
const upload = reactive({
  // 是否显示弹出层（学生信息导入）
  open: false,
  // 弹出层标题（学生信息导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的学生数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/edu/student/importData",
  // 选中的文件
  selectedFile: null
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    studentNo: null,
    studentName: null,
    idCard: null,
    phoneCode: null,
    enrollmentDate: null,
    nation: null,
    politicalStatus: null,
    bloodType: null,
    schoolId: null,
    collegeId: null,
    majorId: null,
    classId: null,
    grade: null,
    educationLevel: null,
    communityName: null,
    status: null,
    createTime: null,
  },
  rules: {
    studentNo: [
      { required: true, message: "学号不能为空", trigger: "blur" }
    ],
    studentName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "密码不能为空", trigger: "blur" }
    ],
    enrollmentDate: [
      { required: true, message: "入学时间不能为空", trigger: "blur" }
    ],
    schoolId: [
      { required: true, message: "学校ID不能为空", trigger: "blur" }
    ],
    collegeId: [
      { required: true, message: "学院ID不能为空", trigger: "blur" }
    ],
    majorId: [
      { required: true, message: "专业ID不能为空", trigger: "blur" }
    ],
    classId: [
      { required: true, message: "班级ID不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

// 计算属性：查询表单中根据学校筛选学院
const queryFilteredCollegeList = computed(() => {
  if (!queryParams.value.schoolId) return [];
  return collegeOptions.value.filter(item => item.schoolId === queryParams.value.schoolId);
});

// 计算属性：查询表单中根据学院筛选专业
const queryFilteredMajorList = computed(() => {
  if (!queryParams.value.collegeId) return [];
  return majorOptions.value.filter(item => item.collegeId === queryParams.value.collegeId);
});

// 计算属性：查询表单中根据专业筛选班级
const queryFilteredClassList = computed(() => {
  if (!queryParams.value.majorId) return [];
  return classOptions.value.filter(item => item.majorId === queryParams.value.majorId);
});

// 查询表单学校变更处理
function handleQuerySchoolChange() {
  queryParams.value.collegeId = null;
  queryParams.value.majorId = null;
  queryParams.value.classId = null;
}

// 查询表单学院变更处理
function handleQueryCollegeChange() {
  queryParams.value.majorId = null;
  queryParams.value.classId = null;
}

// 查询表单专业变更处理
function handleQueryMajorChange() {
  queryParams.value.classId = null;
}

// 计算属性：表单对话框中根据学校筛选学院
const formFilteredCollegeList = computed(() => {
  if (!form.value.schoolId) return [];
  return collegeOptions.value.filter(item => item.schoolId === form.value.schoolId);
});

// 计算属性：表单对话框中根据学院筛选专业
const formFilteredMajorList = computed(() => {
  if (!form.value.collegeId) return [];
  return majorOptions.value.filter(item => item.collegeId === form.value.collegeId);
});

// 计算属性：表单对话框中根据专业筛选班级
const formFilteredClassList = computed(() => {
  if (!form.value.majorId) return [];
  return classOptions.value.filter(item => item.majorId === form.value.majorId);
});

// 表单对话框学校变更处理
function handleFormSchoolChange() {
  form.value.collegeId = null;
  form.value.majorId = null;
  form.value.classId = null;
}

// 表单对话框学院变更处理
function handleFormCollegeChange() {
  form.value.majorId = null;
  form.value.classId = null;
}

// 表单对话框专业变更处理
function handleFormMajorChange() {
  form.value.classId = null;
}

/** 查询学生信息列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeEnrollmentDate && '' != daterangeEnrollmentDate) {
    queryParams.value.params["beginEnrollmentDate"] = daterangeEnrollmentDate.value[0]
    queryParams.value.params["endEnrollmentDate"] = daterangeEnrollmentDate.value[1]
  }
  if (null != daterangeGraduationDate && '' != daterangeGraduationDate) {
    queryParams.value.params["beginGraduationDate"] = daterangeGraduationDate.value[0]
    queryParams.value.params["endGraduationDate"] = daterangeGraduationDate.value[1]
  }
  if (null != daterangeBirthday && '' != daterangeBirthday) {
    queryParams.value.params["beginBirthday"] = daterangeBirthday.value[0]
    queryParams.value.params["endBirthday"] = daterangeBirthday.value[1]
  }
  listStudent(queryParams.value).then(response => {
    studentList.value = response.rows
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
    studentId: null,
    studentNo: null,
    studentName: null,
    idCard: null,
    password: null,
    phoneCode: null,
    avatarUrl: null,
    enrollmentDate: null,
    graduationDate: null,
    birthday: null,
    nation: null,
    politicalStatus: null,
    hometown: null,
    bloodType: null,
    schoolId: null,
    collegeId: null,
    majorId: null,
    classId: null,
    grade: null,
    educationLevel: null,
    schoolingLength: null,
    totalCredits: null,
    totalPoints: null,
    quantitativeScore: null,
    activityCount: null,
    organizationCount: null,
    communityName: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("studentRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeEnrollmentDate.value = []
  daterangeGraduationDate.value = []
  daterangeBirthday.value = []
  proxy.resetForm("queryRef")

  // 手动重置级联相关状态
  queryParams.value.schoolId = null
  queryParams.value.collegeId = null
  queryParams.value.majorId = null
  queryParams.value.classId = null
  queryParams.value.pageNum = 1

  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.studentId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加学生信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _studentId = row.studentId || ids.value
  getStudent(_studentId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改学生信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["studentRef"].validate(valid => {
    if (valid) {
      if (form.value.studentId != null) {
        updateStudent(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addStudent(form.value).then(response => {
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
  const _studentIds = row.studentId || ids.value
  proxy.$modal.confirm('是否确认删除学生信息编号为"' + _studentIds + '"的数据项？').then(function () {
    return delStudent(_studentIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('edu/student/export', {
    ...queryParams.value
  }, `student_${new Date().getTime()}.xlsx`)
}

/** 查看学生量化记录 */
function handleViewQuantitative(row) {
  currentStudent.value = { ...row }
  quantitativeQueryParams.studentId = row.studentId
  quantitativeQueryParams.pageNum = 1
  quantitativeDialogVisible.value = true
  getQuantitativeList()
}

/** 查询量化记录列表 */
function getQuantitativeList() {
  quantitativeLoading.value = true
  const params = { ...quantitativeQueryParams }
  params.params = {}

  if (quantitativeDateRange.value && quantitativeDateRange.value.length === 2) {
    params.params["beginRecordTime"] = quantitativeDateRange.value[0]
    params.params["endRecordTime"] = quantitativeDateRange.value[1]
  }

  listQuantitative(params).then(response => {
    quantitativeList.value = response.rows
    quantitativeTotal.value = response.total
    quantitativeLoading.value = false
  }).catch(() => {
    quantitativeLoading.value = false
  })
}

/** 搜索量化记录 */
function handleQuantitativeQuery() {
  quantitativeQueryParams.pageNum = 1
  getQuantitativeList()
}

/** 重置量化记录查询 */
function resetQuantitativeQuery() {
  quantitativeDateRange.value = []
  quantitativeQueryParams.recordType = null
  quantitativeQueryParams.sourceName = null
  quantitativeQueryParams.pageNum = 1
  getQuantitativeList()
}

/** 导出学生量化记录 */
function handleExportQuantitative() {
  const params = {
    studentId: currentStudent.value.studentId,
    recordType: quantitativeQueryParams.recordType,
    sourceName: quantitativeQueryParams.sourceName,
  }

  if (quantitativeDateRange.value && quantitativeDateRange.value.length === 2) {
    params.params = {
      beginRecordTime: quantitativeDateRange.value[0],
      endRecordTime: quantitativeDateRange.value[1]
    }
  }

  proxy.download('edu/quantitative/export', params,
    `${currentStudent.value.studentName}_量化记录_${new Date().getTime()}.xlsx`)
}

/** 查看学生粉丝列表 */
function handleViewFans(row) {
  currentStudent.value = { ...row }
  fansQueryParams.followeeId = row.studentId
  fansQueryParams.pageNum = 1
  fansDialogVisible.value = true
  getFansList()
}

/** 查询粉丝列表 */
function getFansList() {
  fansLoading.value = true
  const params = { ...fansQueryParams }
  params.params = {}

  if (fansDateRange.value && fansDateRange.value.length === 2) {
    params.params["beginCreateTime"] = fansDateRange.value[0]
    params.params["endCreateTime"] = fansDateRange.value[1]
  }

  listCommunityFollow(params).then(response => {
    fansList.value = response.rows
    fansTotal.value = response.total
    fansLoading.value = false
  }).catch(() => {
    fansLoading.value = false
  })
}

/** 搜索粉丝列表 */
function handleFansQuery() {
  fansQueryParams.pageNum = 1
  getFansList()
}

/** 重置粉丝列表查询 */
function resetFansQuery() {
  fansDateRange.value = []
  fansQueryParams.followerName = null
  fansQueryParams.pageNum = 1
  getFansList()
}

/** 删除粉丝 */
function handleDeleteFans(row) {
  proxy.$modal.confirm('是否确认删除该粉丝关注记录？').then(function () {
    return delCommunityFollow(row.followId)
  }).then(() => {
    getFansList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 查询学校列表 */
function getSchoolList() {
  listSchool().then(response => {
    schoolOptions.value = response.rows;
  });
}

/** 查询学院列表 */
function getCollegeList() {
  listCollege().then(response => {
    collegeOptions.value = response.rows;
  });
}

/** 查询专业列表 */
function getMajorList() {
  listMajor().then(response => {
    majorOptions.value = response.rows;
  });
}

/** 查询班级列表 */
function getClassList() {
  listClass().then(response => {
    classOptions.value = response.rows;
  });
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "学生信息导入";
  upload.open = true;
  upload.selectedFile = null;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download("edu/student/importTemplate", {}, `student_template_${new Date().getTime()}.xlsx`);
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
  getList();
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

getSchoolList();
getCollegeList();
getMajorList();
getClassList();
getList()
</script>

<style scoped lang="scss">
.quantitative-header {
  .student-info {
    margin-bottom: 10px;

    :deep(.el-descriptions__label) {
      font-weight: bold;
      background-color: #f5f7fa;
    }
  }
}

.fans-header {
  margin-bottom: 10px;

  :deep(.el-descriptions__label) {
    font-weight: bold;
    background-color: #f5f7fa;
  }
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
