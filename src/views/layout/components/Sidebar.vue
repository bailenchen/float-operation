<template>
  <div class="container">
    <div
      :style="{ 'padding-top': createButtonTitle != '' ? '40px' : '25px', 'background-color':backgroundColor }"
      class="create-button-container">
      <el-popover
        v-if="createButtonTitle != ''"
        :offset="addOffset"
        :visible-arrow="false"
        placement="right"
        popper-class="no-padding-popover"
        trigger="hover">
        <slot name="add"/>
        <div
          slot="reference"
          class="create-button"
          @click="quicklyCreate">
          <div
            v-show="!buttonCollapse"
            class="button-name">{{ createButtonTitle }}</div>
          <div
            v-show="!buttonCollapse"
            class="button-line"/>
          <i
            :class="createButtonIcon"
            class="button-mark"/>
        </div>
      </el-popover>
    </div>
    <el-menu
      ref="menu"
      :default-active="activeIndex"
      :style="{'border-right-color': backgroundColor, 'padding-top': createButtonTitle != '' ? '90px' : '40px'}"
      :text-color="textColor"
      :background-color="backgroundColor"
      :active-text-color="activeTextColor"
      :collapse="collapse"
      class="el-menu-vertical"
      unique-opened
      @select="handleSelect">
      <template
        v-for="(item, index) in items"
        v-if="!item.hidden">
        <router-link
          v-if="!item.children"
          :key="index"
          :to="getFullPath(item.path)">
          <el-tooltip
            :disabled="showTooltip"
            :content="item.meta.title"
            effect="dark"
            placement="right">
            <el-menu-item :index="getFullPath(item.path)">
              <div class="menu-item-content">
                <i
                  :class="[preIcon, `${preIcon}-${item.meta.icon}`]"
                  :style="{ 'color': activeIndex == getFullPath(item.path) ? activeTextColor : textColor, fontSize: item.meta.fontSize || '16px'}"/>
                <span slot="title">{{ item.meta.title }}</span>
                <el-badge
                  v-if="item.meta.num && item.meta.num > 0"
                  :max="99"
                  :value="item.meta.num"/>
              </div>
            </el-menu-item>
          </el-tooltip>
        </router-link>
        <el-submenu
          v-else
          :key="index"
          :index="getFullPath(item.path)">
          <template
            v-if="!item.hidden"
            slot="title">
            <i
              :class="[preIcon, `${preIcon}-${item.meta.icon}`]"
              :style="{fontSize: item.meta.fontSize || '16px'}"/>
            <span slot="title">{{ item.meta.title }}</span>
          </template>
          <router-link
            v-for="(subitem, subindex) in item.children"
            v-if="!item.hidden"
            :key="subindex"
            :to="getFullPath(subitem.path)">
            <el-menu-item :index="getFullPath(subitem.path)">
              <div class="menu-item-content">
                {{ subitem.meta.title }}
              </div>
            </el-menu-item>
          </router-link>
        </el-submenu>
      </template>
    </el-menu>
    <div
      :style="{ 'background-color':backgroundColor }"
      class="sidebar-bottom">
      <div class="sidebar-container">
        <img
          :style="{ 'right': buttonCollapse ? '3px' : '0' }"
          class="collapse-button"
          src="@/assets/img/collapse_white.png"
          alt=""
          @click="toggleSideBarClick">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  data() {
    return {
      buttonCollapse: false
    }
  },
  watch: {
    collapse: function(val) {
      if (val) {
        this.buttonCollapse = val
      } else {
        setTimeout(() => {
          this.buttonCollapse = val
        }, 300)
      }
    }
  },
  computed: {
    ...mapGetters(['activeIndex', 'collapse']),
    preIcon() {
      return this.mainRouter == 'crm' ? 'wk' : 'wukong'
    },
    showTooltip() {
      return !this.collapse
    }
  },
  props: {
    mainRouter: {
      type: String,
      default: ''
    },
    addOffset: {
      type: Number,
      default: 70
    },
    /** 选择项目 */
    items: {
      type: Array,
      default: []
    },
    backgroundColor: {
      type: String,
      default: '#001529'
    },
    activeTextColor: {
      type: String,
      default: '#fff'
    },
    textColor: {
      type: String,
      default: '#bebec0'
    },
    selectLineColor: {
      type: String,
      default: '#2362FB'
    },
    selectBackgroundColor: {
      type: String,
      default: '#001529'
    },
    createButtonTitle: {
      type: String,
      default: ''
    },
    createButtonIcon: {
      type: String,
      default: 'el-icon-plus'
    }
  },
  mounted() {
    this.buttonCollapse = this.collapse
    // this.changeMenu()
  },
  methods: {
    // changeMenu() {
    //   this.$nextTick(() => {
    //     this.checkMenuInfo()
    //   })
    // },

    // checkMenuInfo() {
    //   setTimeout(() => {
    //     if (
    //       (this.$refs.menu.$children && !this.$refs.menu.$children.length) ||
    //       !this.$refs.menu.$children
    //     ) {
    //       this.checkMenuInfo()
    //     } else if (this.$refs.menu.$children) {
    //       this.changeMenuItemPadding(this.$refs.menu)
    //     }
    //   }, 0)
    // },

    // changeMenuItemPadding(menus) {
    //   for (let index = 0; index < menus.$children.length; index++) {
    //     const element = menus.$children[index]
    //     if (element.$options.name === 'router-link') {
    //       if (element.$children && element.$children.length) {
    //         const menuItem = element.$children[0]
    //         let paddingLeft = menuItem.$el.style.paddingLeft
    //         paddingLeft = paddingLeft.replace('px', '')
    //         if (parseFloat(paddingLeft) % 20 == 0) {
    //           paddingLeft = parseFloat(paddingLeft) * 0.7
    //           menuItem.$el.style.paddingLeft = paddingLeft + 'px'
    //         }
    //       }
    //     } else if (element.$options.name === 'ElSubmenu') {
    //       if (element.$el.children && element.$el.children.length) {
    //         if (element.$refs['submenu-title']) {
    //           let paddingLeft = element.$refs['submenu-title'].style.paddingLeft
    //           paddingLeft = paddingLeft.replace('px', '')
    //           if (parseFloat(paddingLeft) % 20 == 0) {
    //             paddingLeft = parseFloat(paddingLeft) * 0.7
    //             element.$refs['submenu-title'].style.paddingLeft =
    //               paddingLeft + 'px'
    //           }
    //         }
    //       }

    //       this.changeMenuItemPadding(element)
    //     }
    //   }
    // },
    toggleSideBarClick() {
      this.$store.commit('SET_COLLAPSE', !this.collapse)
    },

    // 快速创建
    quicklyCreate() {
      this.$emit('quicklyCreate')
    },

    handleSelect(key, keyPath) {
      this.$emit('select', key, keyPath)
    },

    getFullPath(path) {
      return `/${this.mainRouter}/${path}`
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-vertical {
  height: 100%;
  overflow: auto;
  padding-bottom: 48px;
}

.el-submenu__title {
  i:first-child {
    padding-left: 10px;
  }
}

.el-menu-vertical.el-menu--collapse {
  .el-menu-item {
    span {
      display: none;
    }
  }
}

.menu-item-icon-container {
  display: inline-block;
  margin-right: 10px;
  .menu-item-icon-flex {
    width: 22px;
    height: 22px;
    position: relative;
    .menu-item-icon {
      display: block;
    }
  }
}

.el-menu-item {
  height: auto;
  line-height: normal;
  padding: 0 14px;
  background-color: #001529 !important;
}

.el-menu-item.is-active {
  .menu-item-content {
    background-color: #2362fb !important;
    color: white;
  }
}

.el-menu-item:hover {
  .menu-item-content {
    background-color: rgba($color: #fff, $alpha: 0.1);
    color: white;
    .wukong {
      color: white !important;
    }
  }
}

.menu-item-content {
  width: 100%;
  border-radius: 4px;
  line-height: 36px;
  margin: 5px 0;
  padding-left: 10px;
  position: relative;
  cursor: pointer;
}

.el-submenu.is-active {
  .el-submenu__title {
    span,
    i:first-child {
      color: white;
    }
  }
}

.create-button-container {
  padding: 15px 14px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;

  .create-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 15px;
    height: 36px;
    border-radius: 4px;
    background-color: rgba($color: #fff, $alpha: 0.1);
    color: #999;

    .button-name {
      flex: 1;
    }

    .button-line {
      height: 10px;
      background-color: white;
      width: 1px;
      margin: 0 20px 0 10px;
      opacity: 0.3;
    }

    .button-mark {
      width: 12px;
    }
  }

  .create-button:hover {
    color: white !important;
    background-color: $xr-color-primary !important;
  }
}

.side-bar {
  height: 32px;
  padding: 0 16px 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #eee;
}

.sidebar-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;

  .sidebar-container {
    position: relative;
    height: 48px;
  }
}

.collapse-button {
  position: absolute;
  top: 0;
  padding: 18px 20px;
  cursor: pointer;
}

.wukong,
.wk {
  margin-right: 8px;
}

// 消息数
.el-badge {
  position: absolute;
  right: 8px;
  top: 6px;
  /deep/ .el-badge__content {
    border-width: 0;
  }
}
</style>
