<template>
    <div class="app-container">
        <!-- 搜索栏 -->
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
                    <el-form-item label="所属组织" prop="organizationId">
                        <el-select v-model="queryParams.organizationId" placeholder="请先选择学校" clearable filterable
                            :disabled="!queryParams.schoolId" style="width: 100%;">
                            <el-option v-for="org in queryOrganizationList" :key="org.organizationId"
                                :label="org.organizationName" :value="org.organizationId" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="活动名称" prop="activityName">
                        <el-input v-model="queryParams.activityName" placeholder="请输入活动名称" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="活动类型" prop="activityType">
                        <el-select v-model="queryParams.activityType" placeholder="请选择活动类型" clearable
                            style="width: 100%;">
                            <el-option v-for="dict in edu_activity_type" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 18px;">
                <el-col :span="6">
                    <el-form-item label="活动状态" prop="activityStatus">
                        <el-select v-model="queryParams.activityStatus" placeholder="请选择状态" clearable
                            style="width: 100%;">
                            <el-option v-for="dict in edu_activity_status" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="活动级别" prop="activityLevel">
                        <el-select v-model="queryParams.activityLevel" placeholder="请选择活动级别" clearable
                            style="width: 100%;">
                            <el-option v-for="dict in edu_activity_level" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 100%;">
                            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 工具栏 -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="handleAdd"
                    v-hasPermi="['edu:activity:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['edu:activity:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['edu:activity:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport"
                    v-hasPermi="['edu:activity:export']">导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <!-- 表格 -->
        <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" fixed />
            <el-table-column label="活动名称" align="center" prop="activityName" min-width="150" show-overflow-tooltip />
            <el-table-column label="所属学校" align="center" prop="schoolName" min-width="120" show-overflow-tooltip />
            <el-table-column label="所属组织" align="center" prop="organizationName" min-width="120"
                show-overflow-tooltip />
            <el-table-column label="活动类型" align="center" prop="activityType" width="100">
                <template #default="scope">
                    <dict-tag :options="edu_activity_type" :value="scope.row.activityType" />
                </template>
            </el-table-column>
            <el-table-column label="活动状态" align="center" prop="activityStatus" width="100">
                <template #default="scope">
                    <dict-tag :options="edu_activity_status" :value="scope.row.activityStatus" />
                </template>
            </el-table-column>
            <el-table-column label="活动级别" align="center" prop="activityLevel" width="100">
                <template #default="scope">
                    <dict-tag :options="edu_activity_level" :value="scope.row.activityLevel" />
                </template>
            </el-table-column>
            <el-table-column label="活动开始时间" align="center" prop="activityStartTime" width="110">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.activityStartTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报名人数" align="center" prop="currentParticipants" width="100">
                <template #default="scope">
                    <span>{{ scope.row.currentParticipants }} / {{ scope.row.maxParticipants === 0 ? '不限' :
                        scope.row.maxParticipants }}</span>
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
            <el-table-column label="参与记录" align="center" width="100" fixed="right">
                <template #default="scope">
                    <el-button link type="success" @click="showParticipantDetail(scope.row.activityId)">查看记录</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150" fixed="right">
                <template #default="scope">
                    <el-tooltip v-if="scope.row.activityStatus === '5' || scope.row.activityStatus === '6'"
                        content="活动已结束或已完结，无法修改" placement="top">
                        <el-button link type="info" icon="Edit" disabled>修改</el-button>
                    </el-tooltip>
                    <el-button v-else link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['edu:activity:edit']">修改</el-button>

                    <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['edu:activity:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改活动信息对话框 -->
        <el-dialog :title="title" v-model="open" width="1200px" append-to-body>
            <el-form ref="activityRef" :model="form" :rules="rules" label-width="140px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="活动名称" prop="activityName">
                            <el-input v-model="form.activityName" placeholder="请输入活动名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动类型" prop="activityType">
                            <el-select v-model="form.activityType" placeholder="请选择活动类型" style="width: 100%">
                                <el-option v-for="dict in edu_activity_type" :key="dict.value" :label="dict.label"
                                    :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="活动状态" prop="activityStatus">
                            <el-select v-model="form.activityStatus" placeholder="请选择状态" style="width: 100%">
                                <el-option v-for="dict in edu_activity_status" :key="dict.value" :label="dict.label"
                                    :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动级别" prop="activityLevel">
                            <el-select v-model="form.activityLevel" placeholder="请选择活动级别" style="width: 100%">
                                <el-option v-for="dict in edu_activity_level" :key="dict.value" :label="dict.label"
                                    :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所属学校" prop="schoolId">
                            <el-select v-model="form.schoolId" placeholder="请选择所属学校" clearable filterable
                                @change="handleFormSchoolChange" style="width: 100%;">
                                <el-option v-for="school in schoolList" :key="school.schoolId"
                                    :label="school.schoolName" :value="school.schoolId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属组织" prop="organizationId">
                            <el-select v-model="form.organizationId" placeholder="请选择所属组织" clearable filterable
                                @change="handleOrganizationChange" style="width: 100%;">
                                <el-option v-for="org in formOrganizationList" :key="org.organizationId"
                                    :label="org.organizationName" :value="org.organizationId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="活动负责人" prop="leaderIds">
                            <el-input v-model="form.leaderNames" placeholder="点击右侧按钮选择负责人" readonly>
                                <template #append>
                                    <el-button icon="User" @click="showLeaderDialog = true"
                                        :disabled="!form.organizationId">选择负责人</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="报名开始时间" prop="registerStartTime">
                            <el-date-picker clearable v-model="form.registerStartTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择报名开始时间" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报名结束时间" prop="registerEndTime">
                            <el-date-picker clearable v-model="form.registerEndTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择报名结束时间" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="活动开始时间" prop="activityStartTime">
                            <el-date-picker clearable v-model="form.activityStartTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择活动开始时间" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动结束时间" prop="activityEndTime">
                            <el-date-picker clearable v-model="form.activityEndTime" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择活动结束时间" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="参与范围" prop="participateScope">
                            <el-select v-model="form.participateScope" placeholder="请选择参与范围"
                                @change="handleParticipateScopeChange" style="width: 100%">
                                <el-option v-for="dict in edu_participate_scope" :key="dict.value" :label="dict.label"
                                    :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.participateScope === '2' || form.participateScope === '3'">
                        <el-form-item label="活动所在学院" prop="collegeId">
                            <el-select v-model="form.collegeId" placeholder="请选择学院" clearable filterable
                                @change="handleFormCollegeChange" style="width: 100%;">
                                <el-option v-for="college in formCollegeList" :key="college.collegeId"
                                    :label="college.collegeName" :value="college.collegeId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="form.participateScope === '3'">
                    <el-col :span="12">
                        <el-form-item label="活动所在班级" prop="classId">
                            <el-select v-model="form.classId" placeholder="请选择班级" clearable filterable
                                style="width: 100%;">
                                <el-option v-for="classItem in formClassList" :key="classItem.classId"
                                    :label="classItem.className" :value="classItem.classId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="是否支持请假" prop="allowLeave">
                            <el-radio-group v-model="form.allowLeave">
                                <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最多报名人数" prop="maxParticipants">
                            <el-input v-model="form.maxParticipants" placeholder="请输入最多报名人数(0表示不限制)" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="活动学分" prop="creditValue">
                            <el-input v-model="form.creditValue" placeholder="请输入活动学分" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="contactPhone">
                            <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="活动标签" prop="activityTags">
                            <el-input v-model="form.activityTags" placeholder="点击右侧按钮选择标签" readonly>
                                <template #append>
                                    <el-button icon="Edit" @click="showTagDialog = true">选择标签</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="活动地点" prop="activityLocation">
                            <el-input v-model="form.activityLocation" placeholder="点击右侧按钮选择地点" readonly>
                                <template #append>
                                    <el-button icon="Location" @click="showMapDialog = true">选择位置</el-button>
                                </template>
                            </el-input>
                            <div v-if="form.longitude && form.latitude"
                                style="margin-top: 5px; color: #999; font-size: 12px;">
                                经度: {{ form.longitude }} | 纬度: {{ form.latitude }}
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="活动详情">
                            <editor v-model="form.activityDetail" :min-height="192" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="参与须知">
                            <editor v-model="form.participationNotes" :min-height="192" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="封面图片" prop="coverImage">
                            <image-upload v-model="form.coverImage" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{
                                    dict.label
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
        <el-dialog title="地图选择位置" v-model="showMapDialog" width="800px" append-to-body @open="initMap">
            <div class="map-container">
                <el-input v-model="mapSearchKeyword" placeholder="搜索地点" class="map-search"
                    @keyup.enter="searchLocation">
                    <template #append>
                        <el-button icon="Search" @click="searchLocation">搜索</el-button>
                    </template>
                </el-input>
                <div id="amap-container" style="width: 100%; height: 500px; margin-top: 10px;"></div>
                <div class="map-info" v-if="selectedLocation.address" style="margin-top: 10px;">
                    <p><strong>选中位置：</strong>{{ selectedLocation.address }}</p>
                    <p><strong>经度：</strong>{{ selectedLocation.longitude }} <strong>纬度：</strong>{{
                        selectedLocation.latitude }}
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

        <!-- 标签选择对话框 -->
        <el-dialog title="选择活动标签" v-model="showTagDialog" width="600px" append-to-body>
            <div class="tag-container">
                <el-input v-model="newTag" placeholder="输入新标签后按回车添加" @keyup.enter="addTag" style="margin-bottom: 15px;">
                    <template #append>
                        <el-button icon="Plus" @click="addTag">添加</el-button>
                    </template>
                </el-input>
                <div class="tag-list">
                    <el-tag v-for="(tag, index) in currentTags" :key="index" closable @close="removeTag(index)"
                        style="margin-right: 10px; margin-bottom: 10px;">
                        {{ tag }}
                    </el-tag>
                </div>
                <el-divider>常用标签</el-divider>
                <div class="common-tags">
                    <el-tag v-for="tag in commonTags" :key="tag" :type="currentTags.includes(tag) ? 'success' : 'info'"
                        @click="toggleTag(tag)" style="margin-right: 10px; margin-bottom: 10px; cursor: pointer;">
                        {{ tag }}
                    </el-tag>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="confirmTags">确 定</el-button>
                    <el-button @click="showTagDialog = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 负责人选择对话框 -->
        <el-dialog title="选择活动负责人" v-model="showLeaderDialog" width="800px" append-to-body>
            <div style="margin-bottom: 15px;">
                <el-input v-model="leaderSearchKeyword" placeholder="搜索成员姓名或学号" clearable @input="filterLeaderList">
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
            </div>
            <el-table ref="leaderTableRef" :data="filteredLeaderList" @selection-change="handleLeaderSelectionChange"
                max-height="400" v-loading="leaderLoading">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="姓名" align="center" prop="studentName" min-width="100" show-overflow-tooltip />
                <el-table-column label="学号" align="center" prop="studentNo" min-width="120" show-overflow-tooltip />
                <el-table-column label="角色" align="center" prop="role" width="100">
                    <template #default="scope">
                        <el-tag v-if="scope.row.role === '1'" type="danger">会长</el-tag>
                        <el-tag v-else-if="scope.row.role === '2'" type="warning">副会长</el-tag>
                        <el-tag v-else-if="scope.row.role === '3'" type="success">干事</el-tag>
                        <el-tag v-else type="info">成员</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="加入时间" align="center" prop="joinTime" width="110">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.joinTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="selectedLeaders.length > 0" style="margin-top: 15px;">
                <el-text>已选择 {{ selectedLeaders.length }} 人：</el-text>
                <el-tag v-for="leader in selectedLeaders" :key="leader.studentId" closable @close="removeLeader(leader)"
                    style="margin: 5px;">
                    {{ leader.studentName }}
                </el-tag>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="confirmLeaders">确 定</el-button>
                    <el-button @click="showLeaderDialog = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 参与记录详情对话框 -->
        <el-dialog title="参与记录详情" v-model="participantDialogVisible" width="1400px" append-to-body>
            <el-table v-loading="participantLoading" :data="participantList" max-height="500">
                <el-table-column label="参与记录ID" align="center" prop="participantId" width="110" />
                <el-table-column label="学生姓名" align="center" prop="studentName" min-width="100" show-overflow-tooltip />
                <el-table-column label="学号" align="center" prop="studentNo" min-width="120" show-overflow-tooltip />
                <el-table-column label="参与状态" align="center" prop="participateStatus" width="100">
                    <template #default="scope">
                        <dict-tag :options="edu_participate_status" :value="scope.row.participateStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="报名时间" align="center" prop="enrollTime" width="110">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.enrollTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="获得奖励" align="center" prop="creditsEarned" width="130">
                    <template #default="scope">
                        <span>学分: {{ scope.row.creditsEarned || 0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="评分" align="center" prop="rating" width="80" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="110">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100" fixed="right">
                    <template #default="scope">
                        <el-button link type="danger" icon="Delete" @click="handleDeleteParticipant(scope.row)"
                            v-hasPermi="['edu:participant:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="participantTotal > 0" :total="participantTotal"
                v-model:page="participantQueryParams.pageNum" v-model:limit="participantQueryParams.pageSize"
                @pagination="getParticipantList" />
        </el-dialog>
    </div>
</template>

<script setup name="Activity">
import { listActivity, getActivity, delActivity, addActivity, updateActivity } from "@/api/edu/activity"
import { listParticipant, delParticipant } from "@/api/edu/participant"
import { listSchool } from "@/api/edu/school"
import { listOrganization } from "@/api/edu/organization"
import { listMember } from "@/api/edu/member"
import { listCollege } from "@/api/edu/college"
import { listClass } from "@/api/edu/class"
import { loadAMap } from "@/utils/amap"

const { proxy } = getCurrentInstance()
const { edu_activity_level, edu_activity_status, sys_yes_no, sys_normal_disable, edu_activity_type, edu_participate_status, edu_participate_scope } = proxy.useDict('edu_activity_level', 'edu_activity_status', 'sys_yes_no', 'sys_normal_disable', 'edu_activity_type', 'edu_participate_status', 'edu_participate_scope')

const activityList = ref([])
const schoolList = ref([])
const allOrganizationList = ref([])
const allCollegeList = ref([])
const allClassList = ref([])

// 查询条件的组织列表(根据学校筛选)
const queryOrganizationList = ref([])

// 表单的学院和班级列表(根据学校和学院筛选)
const formOrganizationList = ref([])
const formCollegeList = ref([])
const formClassList = ref([])

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

// 标签相关
const showTagDialog = ref(false)

// 负责人相关
const showLeaderDialog = ref(false)
const leaderLoading = ref(false)
const leaderList = ref([])
const filteredLeaderList = ref([])
const selectedLeaders = ref([])
const leaderSearchKeyword = ref("")
const leaderTableRef = ref()
const newTag = ref("")
const currentTags = ref([])
const commonTags = ref([
    "学术讲座", "文体活动", "志愿服务", "社团活动",
    "创新创业", "就业指导", "心理健康", "安全教育",
    "技能培训", "体育竞技", "艺术表演", "文化交流"
])

// 参与记录相关
const participantDialogVisible = ref(false)
const participantLoading = ref(false)
const participantList = ref([])
const participantTotal = ref(0)
const currentActivityId = ref(null)
const participantQueryParams = ref({
    pageNum: 1,
    pageSize: 10,
    activityId: null
})

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        schoolId: null,
        organizationId: null,
        activityName: null,
        activityType: null,
        activityStatus: null,
        activityLevel: null,
        status: null,
    },
    rules: {
        activityName: [
            { required: true, message: "活动名称不能为空", trigger: "blur" }
        ],
        activityType: [
            { required: true, message: "活动类型不能为空", trigger: "change" }
        ],
        schoolId: [
            { required: true, message: "所属学校不能为空", trigger: "change" }
        ],
        participateScope: [
            { required: true, message: "参与范围不能为空", trigger: "change" }
        ],
    }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询活动信息列表 */
function getList() {
    loading.value = true
    listActivity(queryParams.value).then(response => {
        activityList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}

/** 获取学校列表 */
function getSchoolList() {
    return listSchool().then(response => {
        schoolList.value = response.rows || []
        return response
    })
}

/** 获取组织列表 */
function getOrganizationList() {
    return listOrganization().then(response => {
        allOrganizationList.value = response.rows || []
        queryOrganizationList.value = []  // 搜索框组织列表初始为空,需要先选择学校
        formOrganizationList.value = response.rows || []
        return response
    })
}

/** 获取学院列表 */
function getCollegeList() {
    return listCollege().then(response => {
        allCollegeList.value = response.rows || []
        formCollegeList.value = response.rows || []
        return response
    })
}

/** 获取班级列表 */
function getClassList() {
    return listClass().then(response => {
        allClassList.value = response.rows || []
        formClassList.value = response.rows || []
        return response
    })
}

/** 查询条件学校改变 */
function handleQuerySchoolChange(schoolId) {
    queryParams.value.organizationId = null
    if (schoolId) {
        queryOrganizationList.value = allOrganizationList.value.filter(org => org.schoolId === schoolId)
    } else {
        queryOrganizationList.value = allOrganizationList.value
    }
}

/** 表单学校改变 */
function handleFormSchoolChange(schoolId, keepValues = false) {
    // 保存当前值
    const savedOrgId = form.value.organizationId
    const savedCollegeId = form.value.collegeId
    const savedClassId = form.value.classId

    if (!keepValues) {
        form.value.organizationId = null
        form.value.collegeId = null
        form.value.classId = null
    }

    if (schoolId) {
        formOrganizationList.value = allOrganizationList.value.filter(org => org.schoolId === schoolId)
        formCollegeList.value = allCollegeList.value.filter(college => college.schoolId === schoolId)

        // 如果需要保留值,检查是否在筛选后的列表中
        if (keepValues) {
            if (savedOrgId && !formOrganizationList.value.find(org => org.organizationId === savedOrgId)) {
                form.value.organizationId = null
            }
            if (savedCollegeId && !formCollegeList.value.find(college => college.collegeId === savedCollegeId)) {
                form.value.collegeId = null
                form.value.classId = null
            }
        }
    } else {
        formOrganizationList.value = allOrganizationList.value
        formCollegeList.value = allCollegeList.value
    }

    if (!keepValues) {
        formClassList.value = []
    }
}

/** 表单学院改变 */
function handleFormCollegeChange(collegeId, keepValues = false) {
    const savedClassId = form.value.classId

    if (!keepValues) {
        form.value.classId = null
    }

    if (collegeId) {
        formClassList.value = allClassList.value.filter(classItem => classItem.collegeId === collegeId)

        // 如果需要保留值,检查是否在筛选后的列表中
        if (keepValues && savedClassId && !formClassList.value.find(classItem => classItem.classId === savedClassId)) {
            form.value.classId = null
        }
    } else if (form.value.schoolId) {
        const schoolCollegeIds = formCollegeList.value.map(c => c.collegeId)
        formClassList.value = allClassList.value.filter(classItem => schoolCollegeIds.includes(classItem.collegeId))
    } else {
        formClassList.value = allClassList.value
    }
}

/** 参与范围改变 */
function handleParticipateScopeChange(scope) {
    if (scope !== '2' && scope !== '3') {
        form.value.collegeId = null
    }
    if (scope !== '3') {
        form.value.classId = null
    }
}

/** 组织改变 */
async function handleOrganizationChange(organizationId) {
    // 清空之前选择的负责人
    form.value.leaderIds = null
    form.value.leaderNames = null
    selectedLeaders.value = []

    // 如果选择了组织，预加载成员列表
    if (organizationId) {
        await loadOrganizationMembers(organizationId)
    }
}

/** 加载组织成员列表 */
async function loadOrganizationMembers(organizationId) {
    try {
        leaderLoading.value = true
        const response = await listMember({
            organizationId: organizationId,
            pageNum: 1,
            pageSize: 1000 // 获取所有成员
        })
        leaderList.value = response.rows || []
        filteredLeaderList.value = leaderList.value
    } catch (error) {
        console.error('加载组织成员失败:', error)
        proxy.$modal.msgError('加载组织成员失败')
    } finally {
        leaderLoading.value = false
    }
}

/** 筛选负责人列表 */
function filterLeaderList() {
    const keyword = leaderSearchKeyword.value.trim().toLowerCase()
    if (!keyword) {
        filteredLeaderList.value = leaderList.value
    } else {
        filteredLeaderList.value = leaderList.value.filter(member => {
            const name = (member.studentName || '').toLowerCase()
            const no = (member.studentNo || '').toLowerCase()
            return name.includes(keyword) || no.includes(keyword)
        })
    }
}

/** 负责人选择变化 */
function handleLeaderSelectionChange(selection) {
    selectedLeaders.value = selection
}

/** 移除负责人 */
function removeLeader(leader) {
    const index = selectedLeaders.value.findIndex(l => l.studentId === leader.studentId)
    if (index > -1) {
        selectedLeaders.value.splice(index, 1)
        // 更新表格选中状态
        leaderTableRef.value.toggleRowSelection(leader, false)
    }
}

/** 确认选择负责人 */
function confirmLeaders() {
    if (selectedLeaders.value.length === 0) {
        proxy.$modal.msgWarning('请至少选择一位负责人')
        return
    }

    // 提取学生ID和姓名
    const leaderIds = selectedLeaders.value.map(l => l.studentId).join(',')
    const leaderNames = selectedLeaders.value.map(l => l.studentName).join(',')

    form.value.leaderIds = leaderIds
    form.value.leaderNames = leaderNames

    showLeaderDialog.value = false
    proxy.$modal.msgSuccess('已选择 ' + selectedLeaders.value.length + ' 位负责人')
}

// 取消按钮
function cancel() {
    open.value = false
    reset()
}

// 表单重置
function reset() {
    form.value = {
        activityId: null,
        activityName: null,
        activityType: null,
        activityStatus: null,
        activityLevel: null,
        activityTags: null,
        activityLocation: null,
        longitude: null,
        latitude: null,
        activityDetail: null,
        participationNotes: null,
        coverImage: null,
        imageUrls: null,
        registerStartTime: null,
        registerEndTime: null,
        activityStartTime: null,
        activityEndTime: null,
        participateScope: '1',
        allowLeave: 'N',
        maxParticipants: 0,
        currentParticipants: null,
        creditValue: null,
        scoreValue: null,
        leaderIds: null,
        leaderNames: null,
        organizerIds: null,
        organizerNames: null,
        participantIds: null,
        participantNames: null,
        favoriteCount: null,
        viewCount: null,
        schoolId: null,
        organizationId: null,
        collegeId: null,
        classId: null,
        contactPhone: null,
        contactEmail: null,
        isFeatured: null,
        isTop: null,
        publishTime: null,
        status: '0',
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
    }
    proxy.resetForm("activityRef")
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
    ids.value = selection.map(item => item.activityId)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    getSchoolList()
    getOrganizationList()
    getCollegeList()
    getClassList()
    open.value = true
    title.value = "添加活动信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    reset()
    const _activityId = row.activityId || ids.value

    // 并行加载所有数据
    Promise.all([
        getSchoolList(),
        getOrganizationList(),
        getCollegeList(),
        getClassList(),
        getActivity(_activityId)
    ]).then(([, , , , activityResponse]) => {
        form.value = activityResponse.data

        // 等待数据加载完成后,自动筛选表单的组织、学院、班级列表(保留原有值)
        if (form.value.schoolId) {
            handleFormSchoolChange(form.value.schoolId, true)
        }
        if (form.value.collegeId) {
            handleFormCollegeChange(form.value.collegeId, true)
        }

        open.value = true
        title.value = "修改活动信息"
    })
}

/** 提交按钮 */
function submitForm() {
    // 根据参与范围动态验证
    if (form.value.participateScope === '2') {
        if (!form.value.collegeId) {
            proxy.$modal.msgWarning("参与范围为学院时,必须选择活动所在学院")
            return
        }
    }
    if (form.value.participateScope === '3') {
        if (!form.value.collegeId || !form.value.classId) {
            proxy.$modal.msgWarning("参与范围为本班时,必须选择活动所在学院和班级")
            return
        }
    }

    proxy.$refs["activityRef"].validate(valid => {
        if (valid) {
            if (form.value.activityId != null) {
                updateActivity(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功")
                    open.value = false
                    getList()
                })
            } else {
                addActivity(form.value).then(response => {
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
    const _activityIds = row.activityId || ids.value
    proxy.$modal.confirm('是否确认删除活动信息编号为"' + _activityIds + '"的数据项？').then(function () {
        return delActivity(_activityIds)
    }).then(() => {
        getList()
        proxy.$modal.msgSuccess("删除成功")
    }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('edu/activity/export', {
        ...queryParams.value
    }, `activity_${new Date().getTime()}.xlsx`)
}

/** 初始化地图 */
async function initMap() {
    try {
        await loadAMap()

        if (!mapInstance.value) {
            const center = form.value.longitude && form.value.latitude
                ? [parseFloat(form.value.longitude), parseFloat(form.value.latitude)]
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
                            longitude: lng.toFixed(7),
                            latitude: lat.toFixed(7)
                        }
                    } else {
                        selectedLocation.value = {
                            address: `经度: ${lng.toFixed(7)}, 纬度: ${lat.toFixed(7)}`,
                            longitude: lng.toFixed(7),
                            latitude: lat.toFixed(7)
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
                            longitude: lng.toFixed(7),
                            latitude: lat.toFixed(7)
                        }
                    }
                })
            })

            mapInstance.value.add(markerInstance.value)

            if (form.value.activityLocation) {
                selectedLocation.value = {
                    address: form.value.activityLocation,
                    longitude: form.value.longitude,
                    latitude: form.value.latitude
                }
            } else {
                selectedLocation.value = {
                    address: DEFAULT_LOCATION.address,
                    longitude: DEFAULT_LOCATION.longitude,
                    latitude: DEFAULT_LOCATION.latitude
                }
            }
        } else {
            const center = form.value.longitude && form.value.latitude
                ? [parseFloat(form.value.longitude), parseFloat(form.value.latitude)]
                : [DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.latitude]

            mapInstance.value.setCenter(center)
            markerInstance.value.setPosition(center)

            if (form.value.activityLocation) {
                selectedLocation.value = {
                    address: form.value.activityLocation,
                    longitude: form.value.longitude,
                    latitude: form.value.latitude
                }
            }
        }
    } catch (error) {
        console.error('地图初始化失败:', error)
        proxy.$modal.msgError('地图加载失败，请检查网络连接')
    }
}

/** 搜索地点 */
function searchLocation() {
    if (!mapSearchKeyword.value) {
        proxy.$modal.msgWarning('请输入搜索关键词')
        return
    }

    AMap.plugin('AMap.PlaceSearch', () => {
        const placeSearch = new AMap.PlaceSearch({
            city: '成都'
        })

        placeSearch.search(mapSearchKeyword.value, (status, result) => {
            if (status === 'complete' && result.poiList.pois.length > 0) {
                const location = result.poiList.pois[0].location

                selectedLocation.value = {
                    address: result.poiList.pois[0].name,
                    longitude: location.lng.toFixed(7),
                    latitude: location.lat.toFixed(7)
                }

                mapInstance.value.setCenter([location.lng, location.lat])
                markerInstance.value.setPosition([location.lng, location.lat])
            } else {
                proxy.$modal.msgError('未找到相关地点')
            }
        })
    })
}

/** 确认位置 */
function confirmLocation() {
    if (!selectedLocation.value.longitude || !selectedLocation.value.latitude) {
        proxy.$modal.msgWarning('请先选择位置')
        return
    }

    form.value.longitude = selectedLocation.value.longitude
    form.value.latitude = selectedLocation.value.latitude
    form.value.activityLocation = selectedLocation.value.address
    showMapDialog.value = false
}

/** 添加标签 */
function addTag() {
    if (!newTag.value.trim()) {
        proxy.$modal.msgWarning('请输入标签内容')
        return
    }
    if (currentTags.value.includes(newTag.value.trim())) {
        proxy.$modal.msgWarning('标签已存在')
        return
    }
    currentTags.value.push(newTag.value.trim())
    newTag.value = ""
}

/** 删除标签 */
function removeTag(index) {
    currentTags.value.splice(index, 1)
}

/** 切换标签 */
function toggleTag(tag) {
    const index = currentTags.value.indexOf(tag)
    if (index > -1) {
        currentTags.value.splice(index, 1)
    } else {
        currentTags.value.push(tag)
    }
}

/** 确认标签 */
function confirmTags() {
    form.value.activityTags = currentTags.value.join(',')
    showTagDialog.value = false
}

/** 打开标签对话框时初始化 */
watch(showTagDialog, (newVal) => {
    if (newVal) {
        currentTags.value = form.value.activityTags ? form.value.activityTags.split(',') : []
    }
})

/** 打开负责人对话框时初始化 */
watch(showLeaderDialog, async (newVal) => {
    if (newVal) {
        // 如果还没有加载成员列表，先加载
        if (form.value.organizationId && leaderList.value.length === 0) {
            await loadOrganizationMembers(form.value.organizationId)
        }

        // 恢复之前选择的负责人
        leaderSearchKeyword.value = ''
        filteredLeaderList.value = leaderList.value

        if (form.value.leaderIds) {
            const leaderIdArray = form.value.leaderIds.split(',').map(id => parseInt(id))
            selectedLeaders.value = leaderList.value.filter(member =>
                leaderIdArray.includes(member.studentId)
            )

            // 设置表格选中状态
            nextTick(() => {
                if (leaderTableRef.value) {
                    selectedLeaders.value.forEach(leader => {
                        leaderTableRef.value.toggleRowSelection(leader, true)
                    })
                }
            })
        } else {
            selectedLeaders.value = []
        }
    }
})

/** 查看参与记录详情 */
function showParticipantDetail(activityId) {
    currentActivityId.value = activityId
    participantQueryParams.value.activityId = activityId
    participantQueryParams.value.pageNum = 1
    participantDialogVisible.value = true
    getParticipantList()
}

/** 获取参与记录列表 */
function getParticipantList() {
    participantLoading.value = true
    listParticipant(participantQueryParams.value).then(response => {
        participantList.value = response.rows
        participantTotal.value = response.total
        participantLoading.value = false
    })
}

/** 删除参与记录 */
function handleDeleteParticipant(row) {
    proxy.$modal.confirm('是否确认删除该参与记录？').then(function () {
        return delParticipant(row.participantId)
    }).then(() => {
        getParticipantList()
        proxy.$modal.msgSuccess("删除成功")
    }).catch(() => { })
}

// 初始化加载
getSchoolList()
getOrganizationList()
getCollegeList()
getClassList()
getList()
</script>

<style scoped>
.tag-container {
    padding: 20px;
}

.tag-list {
    min-height: 50px;
    padding: 10px;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    margin-bottom: 15px;
}

.common-tags {
    display: flex;
    flex-wrap: wrap;
}
</style>
