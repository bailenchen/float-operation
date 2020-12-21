/** 教务管理路由 */
import Layout from '@/views/layout/educationLayout'

const layout = function(meta = {}) {
  return {
    path: '/education',
    component: Layout,
    meta: {
      requiresAuth: true,
      ...meta
    }
  }
}

export default [
  {
    ...layout({
      permissions: ['educational']
    }),
    children: [
      {
        path: 'classroom', // 教室管理
        component: () => import('@/views/EducationManage/classroom/ClassroomIndex'),
        meta: {
          title: '教室管理',
          icon: 'customer'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['educational', 'class']
    }),
    children: [
      {
        path: 'class', // 班级管理
        component: () => import('@/views/EducationManage/class/ClassIndex'),
        meta: {
          title: '班级管理',
          icon: 'todo'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['educational', 'classschedule']
    }),
    children: [
      {
        path: 'class-schedule', // 班级排课表
        component: () => import('@/views/EducationManage/classSchedule/ClassScheduleIndex'),
        meta: {
          title: '班级排课表',
          icon: 'record'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['educational', 'studentschedule']
    }),
    children: [
      {
        path: 'student-schedule', // 学员排课表
        component: () => import('@/views/EducationManage/studentSchedule/StudentScheduleIndex'),
        meta: {
          title: '学员排课表',
          icon: 'employees'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['educational', 'teacherschedule']
    }),
    children: [
      {
        path: 'teacher-schedule', // 教师排课表
        component: () => import('@/views/EducationManage/teacherSchedule/TeacherScheduleIndex'),
        meta: {
          title: '教师排课表',
          icon: 'contacts'
        }
      }
    ]
  }
]
