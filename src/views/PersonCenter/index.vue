<template>
  <flexbox align="flex-start" class="person-center">
    <div class="left">
      <flexbox class="user-box">
        <div
          v-photo="userInfo"
          v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img || '')"
          class="user-img div-photo" />
        <span class="username">
          {{ userInfo.realname }}
        </span>
      </flexbox>
      <ul class="nav-list">
        <li
          v-for="(item, index) in navList"
          :key="index"
          :class="{active: selectedIndex === index}"
          class="nav-list-item"
          @click="selectedIndex = index">
          <span :class="item.icon" class="wk icon" />
          <span class="text">
            {{ item.label }}
          </span>
        </li>
      </ul>
    </div>
    <div class="right">
      <edit-user-info
        v-if="selectedIndex === 0"
        @change="getDetail" />
      <edit-pwd v-if="selectedIndex === 1" />
    </div>
  </flexbox>
</template>

<script>
import { mapGetters } from 'vuex'
import EditUserInfo from './components/editUserInfo'
import EditPwd from './components/editPwd'

export default {
  name: 'PersonCenter',
  components: {
    EditUserInfo,
    EditPwd
  },
  data() {
    return {
      navList: [
        { label: '个人信息', icon: 'wk-user' },
        { label: '账号密码', icon: 'wk-circle-password' }
      ],
      selectedIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      this.$store.dispatch('GetUserInfo').then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .person-center {
    width: 1180px;
    margin: 0 auto;
    .left {
      width: 300px;
      background-color: white;
      padding-bottom: 100px;
      margin-right: 20px;
      .user-box {
        width: 376px;
        padding: 15px 20px 20px;
        .user-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 22px;
        }
        .username {
          flex: 1;
          font-size: 14px;
          color: #666;
        }
      }
      .nav-list {
        width: 100%;
        &-item {
          height: 50px;
          color: #666;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          .icon {
            margin-right: 10px;
          }
          &.active {
            color: #333;
            background-color: #F1F5F8;
          }
        }
      }
    }
    .right {
      flex: 1;
    }
  }
</style>
