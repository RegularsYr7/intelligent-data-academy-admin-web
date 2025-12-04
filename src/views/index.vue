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
    <el-row :gutter="20" class="statistics-section" v-if="visibleStatistics.length > 0">
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" v-for="stat in visibleStatistics" :key="stat.key">
        <el-card shadow="hover" class="stat-card" :class="stat.colorClass">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">{{ stat.label }}</p>
              <h3 class="stat-value">{{ stat.value }}</h3>
              <span class="stat-trend" :class="{ up: stat.trend > 0, down: stat.trend < 0 }" v-if="stat.trend !== 0">
                <el-icon>
                  <CaretTop v-if="stat.trend > 0" />
                  <CaretBottom v-else />
                </el-icon> {{ Math.abs(stat.trend) }}%
              </span>
              <span class="stat-trend" v-else>
                <el-icon>
                  <Minus />
                </el-icon> 0%
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
          <el-row :gutter="15" v-if="quickLinks.length > 0">
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
          <el-empty v-else description="暂无可用的快捷入口" :image-size="80" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
import { Fold, CaretTop, CaretBottom, Minus } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import * as echarts from 'echarts'
import { listStudent } from '@/api/edu/student'
import { listActivity } from '@/api/edu/activity'
import { listOrganization } from '@/api/edu/organization'
import { listCompetition } from '@/api/edu/competition'

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

// 定义统计数据的响应式对象
const statisticsData = reactive({
  studentCount: 0,
  activityCount: 0,
  organizationCount: 0,
  competitionCount: 0
})

// 统计数据配置（包含权限要求）
const allStatistics = computed(() => [
  {
    key: 'studentCount',
    label: '学生总数',
    value: statisticsData.studentCount,
    trend: 12,
    icon: 'User',
    colorClass: 'stat-card-primary',
    permission: 'edu:student:list'
  },
  {
    key: 'activityCount',
    label: '活动总数',
    value: statisticsData.activityCount,
    trend: 8,
    icon: 'DocumentChecked',
    colorClass: 'stat-card-success',
    permission: 'edu:activity:list'
  },
  {
    key: 'organizationCount',
    label: '组织数量',
    value: statisticsData.organizationCount,
    trend: 0,
    icon: 'School',
    colorClass: 'stat-card-warning',
    permission: 'edu:organization:list'
  },
  {
    key: 'competitionCount',
    label: '竞赛数量',
    value: statisticsData.competitionCount,
    trend: 15,
    icon: 'Trophy',
    colorClass: 'stat-card-danger',
    permission: 'edu:competitionInfo:list'
  }
])

// 根据权限过滤统计卡片
const visibleStatistics = computed(() => {
  const all_permission = "*:*:*"
  const permissions = userStore.permissions

  return allStatistics.value.filter(stat => {
    if (!stat.permission) return true
    if (permissions.includes(all_permission)) return true
    return permissions.some(p => p === stat.permission)
  })
})

// 图表周期
const chartPeriod = ref('month')

// 所有快捷入口配置（包含权限要求）- 按功能类型分组排序
const allQuickLinks = [
  // 基础信息管理
  { label: '学生管理', path: '/schoolInfoManagent/student/index', icon: 'User', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', permission: 'edu:student:list' },
  { label: '班级管理', path: '/schoolInfoManagent/class/index', icon: 'School', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', permission: 'edu:class:list' },

  // 组织与活动
  { label: '组织管理', path: '/organizationalManagement/organization/index', icon: 'OfficeBuilding', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', permission: 'edu:organization:list' },
  { label: '活动管理', path: '/activityManagent/activity/index', icon: 'DocumentChecked', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', permission: 'edu:activity:list' },
  { label: '竞赛管理', path: '/competitionManagent/competitionInfo/index', icon: 'Trophy', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', permission: 'edu:competitionInfo:list' },

  // 日常管理
  { label: '考勤任务', path: '/attendanceManagement/task/index', icon: 'Calendar', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', permission: 'edu:task:list' },
  { label: '失物招领', path: '/lostFoundManagement/found/index', icon: 'Search', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', permission: 'edu:found:list' },

  // 社区互动
  { label: '社区帖子', path: '/communityManagement/communityPost', icon: 'ChatDotRound', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', permission: 'edu:communityPost:list' },
  { label: '风采展示', path: '/styleManagement/styleInfo/index', icon: 'Picture', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', permission: 'edu:showcase:list' },

  // 其他功能
  { label: '地图坐标', path: '/mapManagent/coordinates/index', icon: 'Location', color: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)', permission: 'edu:coordinates:list' },
  { label: '反馈建议', path: '/feedback/index', icon: 'ChatLineSquare', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', permission: 'edu:feedback:list' }
]

// 根据权限过滤快捷入口
const quickLinks = computed(() => {
  const all_permission = "*:*:*"
  const permissions = userStore.permissions

  return allQuickLinks.filter(link => {
    // 如果没有配置权限要求，则显示
    if (!link.permission) return true
    // 如果用户有超级管理员权限，则显示所有
    if (permissions.includes(all_permission)) return true
    // 检查用户是否有该功能的权限
    return permissions.some(p => p === link.permission)
  })
})

// 所有动态配置（包含权限要求）
const allNotices = [
  { type: 'success', title: '新学期活动报名开始', time: '2小时前', permission: 'edu:activity:list' },
  { type: 'warning', title: '学生信息需要更新', time: '5小时前', permission: 'edu:student:list' },
  { type: 'info', title: '竞赛报名截止提醒', time: '1天前', permission: 'edu:competitionInfo:list' },
  { type: 'danger', title: '系统维护通知', time: '2天前', permission: null }, // 所有人可见
  { type: 'success', title: '风采展示已发布', time: '3天前', permission: 'edu:showcase:list' },
  { type: 'info', title: '量化分数已更新', time: '3天前', permission: 'edu:quantitative:list' }
]

// 根据权限过滤动态
const notices = computed(() => {
  const all_permission = "*:*:*"
  const permissions = userStore.permissions

  return allNotices.filter(notice => {
    if (!notice.permission) return true
    if (permissions.includes(all_permission)) return true
    return permissions.some(p => p === notice.permission)
  })
})

// 所有待办事项配置（包含权限要求）
const allTodoList = [
  { title: '审核学生活动申请', priority: '高', deadline: '今天', permission: 'edu:activity:edit' },
  { title: '更新竞赛信息', priority: '中', deadline: '明天', permission: 'edu:competitionInfo:edit' },
  { title: '处理反馈建议', priority: '低', deadline: '本周', permission: 'edu:feedback:edit' },
  { title: '组织会议安排', priority: '高', deadline: '明天', permission: 'edu:organization:edit' }
]

// 根据权限过滤待办事项
const todoList = computed(() => {
  const all_permission = "*:*:*"
  const permissions = userStore.permissions

  return allTodoList.filter(todo => {
    if (!todo.permission) return true
    if (permissions.includes(all_permission)) return true
    return permissions.some(p => p === todo.permission)
  })
})

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

// 获取统计数据
async function fetchStatistics() {
  try {
    // 并行调用所有接口，每个只请求1条数据以获取总数
    const [studentRes, activityRes, organizationRes, competitionRes] = await Promise.all([
      listStudent({ pageNum: 1, pageSize: 1 }),
      listActivity({ pageNum: 1, pageSize: 1 }),
      listOrganization({ pageNum: 1, pageSize: 1 }),
      listCompetition({ pageNum: 1, pageSize: 1 })
    ])

    // 更新统计数据
    statisticsData.studentCount = studentRes.total || 0
    statisticsData.activityCount = activityRes.total || 0
    statisticsData.organizationCount = organizationRes.total || 0
    statisticsData.competitionCount = competitionRes.total || 0
  } catch (error) {
    console.error('获取统计数据失败:', error)
    proxy.$modal.msgError('获取统计数据失败')
  }
}

onMounted(() => {
  // 更新时间
  updateTime()
  setInterval(updateTime, 1000)

  // 设置登录时间
  loginTime.value = new Date().toLocaleString('zh-CN')
  lastLoginTime.value = '2025-01-02 09:30:25'

  // 获取统计数据
  fetchStatistics()

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
  background: var(--el-bg-color-page);
  min-height: calc(100vh - 84px);
}

// 欢迎区域
.welcome-section {
  margin-bottom: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;

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
    color: #fff;
  }

  .welcome-desc {
    font-size: 16px;
    opacity: 0.9;
    margin: 5px 0;
    color: rgba(255, 255, 255, 0.9);
  }

  .current-time {
    font-size: 14px;
    opacity: 0.8;
    margin: 5px 0 0 0;
    color: rgba(255, 255, 255, 0.8);
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
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--el-box-shadow-light);
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
  color: var(--el-text-color-secondary);
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 26px;
  font-weight: 600;
  margin: 0;
  color: var(--el-text-color-primary);
}

.stat-trend {
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-top: 5px;

  &.up {
    color: var(--el-color-success);
  }

  &.down {
    color: var(--el-color-danger);
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
    background: var(--el-fill-color-light);
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
  color: var(--el-text-color-regular);
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
  color: var(--el-text-color-primary);

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
  border-bottom: 1px solid var(--el-border-color-lighter);

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
    background: var(--el-color-success);
  }

  &.warning {
    background: var(--el-color-warning);
  }

  &.info {
    background: var(--el-color-info);
  }

  &.danger {
    background: var(--el-color-danger);
  }
}

.notice-content {
  flex: 1;
}

.notice-title {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin: 0 0 5px 0;
  line-height: 1.5;
}

.notice-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
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
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  width: 100px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.info-value {
  flex: 1;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

// 空状态
::v-deep(.el-empty) {
  padding: 30px 0;
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
