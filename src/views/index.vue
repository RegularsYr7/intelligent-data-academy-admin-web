<template>
  <div class="app-container home">
    <!-- 欢迎区域 -->
    <el-row :gutter="20" class="welcome-section">
      <el-col :span="24">
        <el-card shadow="hover" class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-text">
              <h2>欢迎回来，{{ userInfo.nickName || userInfo.userName }}！</h2>
              <p class="welcome-desc">{{ welcomeMessage }}</p>
              <p class="current-time">{{ currentTime }}</p>
            </div>
            <div class="welcome-avatar">
              <el-avatar :size="80" :src="userInfo.avatar" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="statistics-section">
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="stat-card stat-card-primary">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40">
                <User />
              </el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">学生总数</p>
              <h3 class="stat-value">{{ statistics.studentCount }}</h3>
              <span class="stat-trend up">
                <el-icon>
                  <CaretTop />
                </el-icon> 12%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="stat-card stat-card-success">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40">
                <DocumentChecked />
              </el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">活动总数</p>
              <h3 class="stat-value">{{ statistics.activityCount }}</h3>
              <span class="stat-trend up">
                <el-icon>
                  <CaretTop />
                </el-icon> 8%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="stat-card stat-card-warning">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40">
                <School />
              </el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">组织数量</p>
              <h3 class="stat-value">{{ statistics.organizationCount }}</h3>
              <span class="stat-trend">
                <el-icon>
                  <Minus />
                </el-icon> 0%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="stat-card stat-card-danger">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40">
                <Trophy />
              </el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">竞赛数量</p>
              <h3 class="stat-value">{{ statistics.competitionCount }}</h3>
              <span class="stat-trend up">
                <el-icon>
                  <CaretTop />
                </el-icon> 15%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="20" class="quick-access-section">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon>
                  <Fold />
                </el-icon> 快捷入口</span>
            </div>
          </template>
          <el-row :gutter="15">
            <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3" v-for="item in quickLinks" :key="item.path">
              <div class="quick-item" @click="handleQuickNav(item.path)">
                <div class="quick-icon" :style="{ background: item.color }">
                  <el-icon :size="24">
                    <component :is="item.icon" />
                  </el-icon>
                </div>
                <p class="quick-label">{{ item.label }}</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据图表与动态 -->
    <el-row :gutter="20" class="chart-section">
      <!-- 活动趋势图 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon>
                  <TrendCharts />
                </el-icon> 活动参与趋势</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div id="activityChart" style="height: 300px;"></div>
        </el-card>
      </el-col>

      <!-- 最新动态 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" class="notice-card">
          <template #header>
            <div class="card-header">
              <span><el-icon>
                  <Bell />
                </el-icon> 最新动态</span>
            </div>
          </template>
          <el-scrollbar height="300px">
            <div class="notice-list">
              <div class="notice-item" v-for="(item, index) in notices" :key="index">
                <div class="notice-dot" :class="item.type"></div>
                <div class="notice-content">
                  <p class="notice-title">{{ item.title }}</p>
                  <p class="notice-time">{{ item.time }}</p>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办事项与系统信息 -->
    <el-row :gutter="20" class="bottom-section">
      <!-- 待办事项 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon>
                  <List />
                </el-icon> 待办事项</span>
              <el-tag size="small" type="danger">{{ todoList.length }}</el-tag>
            </div>
          </template>
          <el-table :data="todoList" stripe style="width: 100%" max-height="250">
            <el-table-column prop="title" label="事项" show-overflow-tooltip />
            <el-table-column prop="priority" label="优先级" width="80" align="center">
              <template #default="scope">
                <el-tag :type="getPriorityType(scope.row.priority)" size="small">
                  {{ scope.row.priority }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止时间" width="110" align="center" />
            <el-table-column label="操作" width="80" align="center">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleTodo(scope.row)">
                  处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 系统信息 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon>
                  <Monitor />
                </el-icon> 系统信息</span>
            </div>
          </template>
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">系统名称：</span>
              <span class="info-value">智能化数据学院管理系统</span>
            </div>
            <div class="info-item">
              <span class="info-label">系统版本：</span>
              <span class="info-value">v2.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前角色：</span>
              <span class="info-value">{{ userInfo.roles?.join(', ') }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">登录时间：</span>
              <span class="info-value">{{ loginTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">上次登录：</span>
              <span class="info-value">{{ lastLoginTime }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
import { User, DocumentChecked, School, Trophy, Fold, TrendCharts, Bell, List, Monitor, CaretTop, Minus } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import * as echarts from 'echarts'

const { proxy } = getCurrentInstance()
const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => ({
  userName: userStore.name,
  nickName: userStore.nickName,
  avatar: userStore.avatar,
  roles: userStore.roles
}))

// 当前时间
const currentTime = ref('')
const loginTime = ref('')
const lastLoginTime = ref('')

// 欢迎语
const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了,注意休息'
  if (hour < 9) return '早上好,新的一天开始了'
  if (hour < 12) return '上午好,工作愉快'
  if (hour < 14) return '中午好,注意休息'
  if (hour < 18) return '下午好,继续加油'
  if (hour < 22) return '晚上好,辛苦了'
  return '夜深了,早点休息'
})

// 统计数据
const statistics = reactive({
  studentCount: 1248,
  activityCount: 156,
  organizationCount: 28,
  competitionCount: 45
})

// 图表周期
const chartPeriod = ref('month')

// 快捷入口
const quickLinks = ref([
  { label: '学生管理', path: '/schoolInfoManagent/student/index', icon: 'User', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: '班级管理', path: '/schoolInfoManagent/class/index', icon: 'School', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { label: '活动管理', path: '/activityManagent/activity/index', icon: 'DocumentChecked', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: '竞赛管理', path: '/competitionManagent/competitionInfo/index', icon: 'Trophy', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: '组织管理', path: '/organizationalManagement/organization/index', icon: 'OfficeBuilding', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { label: '考勤任务', path: '/attendanceManagement/task/index', icon: 'Calendar', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { label: '量化分数', path: '/quantitative/index', icon: 'DataLine', color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
  { label: '失物招领', path: '/lostFoundManagement/found/index', icon: 'Search', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { label: '社区帖子', path: '/communityManagement/communityPost/index', icon: 'ChatDotRound', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { label: '风采展示', path: '/styleManagement/styleInfo/index', icon: 'Picture', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { label: '地图坐标', path: '/mapManagent/coordinates/index', icon: 'Location', color: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' },
  { label: '反馈建议', path: '/feedback/index', icon: 'ChatLineSquare', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
])

// 最新动态
const notices = ref([
  { type: 'success', title: '新学期活动报名开始', time: '2小时前' },
  { type: 'warning', title: '学生信息需要更新', time: '5小时前' },
  { type: 'info', title: '竞赛报名截止提醒', time: '1天前' },
  { type: 'danger', title: '系统维护通知', time: '2天前' },
  { type: 'success', title: '风采展示已发布', time: '3天前' },
  { type: 'info', title: '量化分数已更新', time: '3天前' }
])

// 待办事项
const todoList = ref([
  { title: '审核学生活动申请', priority: '高', deadline: '今天' },
  { title: '更新竞赛信息', priority: '中', deadline: '明天' },
  { title: '处理反馈建议', priority: '低', deadline: '本周' },
  { title: '组织会议安排', priority: '高', deadline: '明天' }
])

// 更新时间
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long'
  })
}

// 初始化图表
function initChart() {
  const chartDom = document.getElementById('activityChart')
  if (!chartDom) return

  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['活动数', '参与人数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['第1周', '第2周', '第3周', '第4周']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '活动数',
        type: 'bar',
        data: [12, 18, 15, 21],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        }
      },
      {
        name: '参与人数',
        type: 'line',
        data: [320, 450, 380, 520],
        smooth: true,
        itemStyle: {
          color: '#f5576c'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245, 87, 108, 0.3)' },
            { offset: 1, color: 'rgba(245, 87, 108, 0.05)' }
          ])
        }
      }
    ]
  }
  myChart.setOption(option)

  // 响应式
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

// 快捷导航
function handleQuickNav(path) {
  router.push(path)
}

// 处理待办
function handleTodo(row) {
  proxy.$modal.msgInfo('功能开发中...')
}

// 优先级类型
function getPriorityType(priority) {
  const types = { '高': 'danger', '中': 'warning', '低': 'info' }
  return types[priority] || 'info'
}

onMounted(() => {
  // 更新时间
  updateTime()
  setInterval(updateTime, 1000)

  // 设置登录时间
  loginTime.value = new Date().toLocaleString('zh-CN')
  lastLoginTime.value = '2025-01-02 09:30:25'

  // 初始化图表
  nextTick(() => {
    initChart()
  })
})

// 监听图表周期变化
watch(chartPeriod, () => {
  initChart()
})
</script>

<style scoped lang="scss">
.home {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 84px);
}

// 欢迎区域
.welcome-section {
  margin-bottom: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;

  ::v-deep(.el-card__body) {
    padding: 30px;
  }
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text {
  h2 {
    font-size: 28px;
    margin: 0 0 10px 0;
    font-weight: 600;
  }

  .welcome-desc {
    font-size: 16px;
    opacity: 0.9;
    margin: 5px 0;
  }

  .current-time {
    font-size: 14px;
    opacity: 0.8;
    margin: 5px 0 0 0;
  }
}

.welcome-avatar {
  ::v-deep(.el-avatar) {
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
}

// 统计卡片
.statistics-section {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  ::v-deep(.el-card__body) {
    padding: 20px;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-card-primary .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-success .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card-warning .stat-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-card-danger .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 26px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

.stat-trend {
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-top: 5px;

  &.up {
    color: #67c23a;
  }

  &.down {
    color: #f56c6c;
  }
}

// 快捷入口
.quick-access-section {
  margin-bottom: 20px;
}

.quick-item {
  text-align: center;
  padding: 20px 10px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;

  &:hover {
    background: #f5f7fa;
    transform: translateY(-3px);
  }
}

.quick-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  color: #fff;
}

.quick-label {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

// 图表区域
.chart-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;

  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

// 动态通知
.notice-card {
  height: 100%;
}

.notice-list {
  padding: 0;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.notice-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  margin-right: 12px;
  flex-shrink: 0;

  &.success {
    background: #67c23a;
  }

  &.warning {
    background: #e6a23c;
  }

  &.info {
    background: #909399;
  }

  &.danger {
    background: #f56c6c;
  }
}

.notice-content {
  flex: 1;
}

.notice-title {
  font-size: 14px;
  color: #303133;
  margin: 0 0 5px 0;
  line-height: 1.5;
}

.notice-time {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

// 底部区域
.bottom-section {
  margin-bottom: 20px;
}

.system-info {
  padding: 10px 0;
}

.info-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  width: 100px;
  color: #909399;
  font-size: 14px;
}

.info-value {
  flex: 1;
  color: #303133;
  font-size: 14px;
}

// 响应式
@media (max-width: 768px) {
  .home {
    padding: 10px;
  }

  .welcome-card ::v-deep(.el-card__body) {
    padding: 20px;
  }

  .welcome-text h2 {
    font-size: 22px;
  }

  .stat-value {
    font-size: 22px;
  }

  .statistics-section {
    .el-col {
      margin-bottom: 10px;
    }
  }
}
</style>
