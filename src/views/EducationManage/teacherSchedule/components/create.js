import InsertClass from '@/views/EducationManage/components/InsertClass' // 学员插班
import RankCourse from '@/views/EducationManage/components/RankCourse' // 排课
import ShiftHandle from '@/views/EducationManage/components/ShiftHandle' // 换挡

export default {
  components: {
    InsertClass,
    RankCourse,
    ShiftHandle
  },
  data() {
    return {
      isRank: false,
      isInsert: false,
      isShift: false,
      currentInfo: [],
      crmType: 'teacher'
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
      this.currentInfo = [row]
      if (type === 'insert') {
        this.isInsert = true
      } else if (type === 'shift') {
        this.isShift = true
      } else if (type === 'rank') {
        this.isRank = true
      }
    }
  }
}
