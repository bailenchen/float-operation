import InsertClass from '@/views/EducationManage/components/InsertClass' // 学员插班
import RankCourse from '@/views/EducationManage/components/RankCourse' // 排课
import ShiftHandle from '@/views/EducationManage/components/ShiftHandle' // 换挡
import ClassList from './ClassList'

export default {
  components: {
    InsertClass,
    RankCourse,
    ShiftHandle,
    ClassList
  },
  data() {
    return {
      isRank: false,
      isInsert: false,
      isShift: false,
      currentInfo: [],
      crmType: 'teacher'

      // show: false,
      // currentId: ''
    }
  },
  methods: {
    createSaveSuccess() {
      if (this.type == 'day') {
        this.getWillMergeColumns()
      } else if (this.type == 'week') {
        this.getWillMergeRows()
      }
      this.getWillMergeRows()
    },

    hideView(type) {
      if (type == 'insert_class') {
        this.isInsert = false
      } else if (type == 'schedule') {
        this.isRank = false
      } else if (type == 'shift') {
        this.isShift = false
      }
    },

    handle(type, row) {
      console.log(row, 'zzzzbbb')
      this.currentInfo = [row]
      if (type === 'insert') {
        this.isInsert = true
      } else if (type === 'shift') {
        this.isShift = true
      } else if (type === 'rank') {
        this.isRank = true
      }
    },

    // 查看班级列表
    queryClassList() {

    },

    openClass(index) {
      console.log(this.firstColumnId, index, 'BBBBBBBBBBBBBB')

      this.$router.push({
        path: '/education/class',
        query: {
          id: this.firstColumnId[index].userId,
          name: this.firstColumnId[index].realname
        }
      })

      // data: {
      //   subject_teacher_id: { condition: 'is', value: row.subjectTeacherId, formType: 'user', name: 'subject_teacher_id' }
      // }
    }
  }
}
