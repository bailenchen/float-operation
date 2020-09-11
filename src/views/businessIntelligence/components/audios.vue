<template>
  <div>
    <!-- 此处的ref属性，可以很方便的在vue组件中通过 this.$refs.audio获取该dom元素 -->
    <audio
      ref="audio"
      :src="audioUrl"
      controls="controls"
      style="display:none;"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"/>

    <!-- 音频播放控件 -->
    <div style="display: flex">
      <div class="slider-icon">
        <i v-if="!audio.playing" class="iconfont" @click="startPlayOrPause">&#xe600;</i>
        <i v-else class="iconfont" @click="startPlayOrPause">&#xe6ad;</i>
      </div>
      <!--      <button @click="startPlayOrPause">{{ audio.playing | transPlayPause }}</button>-->
      <div class="slider" @mousedown="handleTouchStart">
        <div class="slider-track"/>
        <div :style="'width:'+sliderTime+'%'" class="slider-fill"/>
        <div :style="'left:'+sliderTime+'%'" class="slider-thumb"/>
      </div>
      <div style="width: 100px;" class="slider-time">
        <div v-if="defaultTime">{{ defaultTime }}</div>
        <div v-else-if="!audio.currentTime">{{ audio.maxTime | formatSecond }}</div>
        <div v-else>{{ audio.currentTime | formatSecond }}</div>
      </div>
    </div>
  </div>
</template>
<script>
// import { downloadFileAPI } from '@/api/common'
// import { crmCallDownload } from '@/api/businessIntelligence/callCenter'
// import { conversionFileToUrl } from '@/utils'
// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = Math.ceil(second)

    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60

    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}
export default {
  name: 'Audios',
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    transPlayPause(value) {
      return value ? '暂停' : '播放'
    },
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second)
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      sliderTime: 0,
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      },
      defaultTime: '',
      audioUrl: ''
    }
  },
  computed: {
  },
  watch: {
    item() {
      if (!this.item.filePath) {
        this.audio.maxTime = 0
      }
      this.defaultTime = realFormatSecond(this.item.talkTime)
    }
  },
  mounted() {
    this.defaultTime = realFormatSecond(this.item.talkTime)
  },
  methods: {
    /** 获取文件路径 */
    // filePath() {
    //   if (!this.audioUrl) {
    //     conversionFileToUrl(this.item.filePath).then(res => {
    //       this.audioUrl = res
    //       this.defaultTime = ''
    //       this.$nextTick(() => {
    //         this.$refs.audio.play()
    //       })
    //     })
    //   } else {
    //     this.$refs.audio.play()
    //   }
    // },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      return this.audio.playing ? this.pause() : this.play()
    },
    // 播放音频
    play() {
      console.log(this.item.path, 888)
      if (this.defaultTime === '0:00:00') {
        return false
      }
      // const demoUrl = 'http://192.168.1.65:8084' + '/' + this.item.path
      const demoUrl = `${WKConfig.getLocationOrigin()}/${this.item.path}`
      console.log(demoUrl)
      window.ReportApi.fetchAndDecodeData(demoUrl)
        .then(data => {
          var url = URL.createObjectURL(data)
          this.audioUrl = url
          this.defaultTime = ''
          this.$nextTick(() => {
            this.$refs.audio.play()
          })
          URL.revokeObjectURL(data)
        })
        .catch(err => {
          console.log(err)
        })
      // crmCallDownload({ id: this.item.callRecordId }).then(res => {
      //   if (res.code && res.code === 500) {
      //     this.$message.error('没有录音文件')
      //     return
      //   } else {
      //     console.log(res)
      //     const blob = new Blob([res.data], {
      //       type: 'audio/x-wav'
      //     })
      //     this.audioUrl = URL.createObjectURL(blob)
      //     this.defaultTime = ''
      //     // this.audioUrl = 'https://audio04.dmhmusic.com/71_53_T10056627847_128_4_1_0_sdk-cpm/cn/0412/M00/33/D1/ChAKEV9V75-APywOAEXkqkt4Th4774.mp3?xcode=cce7931994df0d326efa1251ab18d6180137a5b'
      //     if (this.audioUrl) {
      //       this.$nextTick(() => {
      //         this.$refs.audio.play()
      //       })
      //     }
      //   }
      // }).catch(() => {

      // })
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause()
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false
    },
    handleFocus() {
      console.log('focues')
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      // console.log(res)
      this.audio.maxTime = Math.ceil(res.target.duration)
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate(res) {
      // console.log(res)
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = Math.ceil(this.audio.currentTime / this.audio.maxTime * 100)
    },

    // 进度条格式化toolTip
    formatProcessToolTip(index = 0) {
      index = Math.ceil(this.audio.maxTime / 100 * index)
      return '进度条: ' + realFormatSecond(index)
    },

    handleTouchStart(e) {
      document.addEventListener('mousemove', this.handleTouchMove)
      document.addEventListener('mouseup', this.handleTouchEnd)
      document.addEventListener('mouseover', this.handleTouchEnd)
      document.addEventListener('mouseleave', this.handleTouchEnd)

      // e.preventDefault();
      // this.onDragStart(e);
    },
    handleTouchMove(e) {
      this.setValue(e)
    },
    handleTouchEnd(e) {
      this.setValue(e)
      document.removeEventListener('mousemove', this.handleTouchMove)
      document.removeEventListener('mouseup', this.handleTouchEnd)
      document.removeEventListener('mouseover', this.handleTouchEnd)
      document.removeEventListener('mouseleave', this.handleTouchEnd)
      // this.onDragStop(e);
    },
    // 从点击位置更新 value
    setValue(e) {
      const $el = this.$el
      const {
        maxTime,
        minTime,
        step
      } = this.audio
      let value = (e.screenX - $el.getBoundingClientRect().left - 36) / 154 * (maxTime - minTime)
      console.log(e.screenX, $el.getBoundingClientRect().left, value, 'value-==')
      value = Math.round(value / step) * step + minTime
      value = parseFloat(value.toFixed(5))

      if (value > maxTime) {
        value = maxTime
      } else if (value < minTime) {
        value = minTime
      }
      this.$refs.audio.currentTime = value
    },
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime(index) {
      // this.audio.playing && this.pause();
      // console.log('拖动了',index,this.sliderTime,this.audio.maxTime,parseInt(index / 100 * this.audio.maxTime))
      // !this.audio.playing && this.play();
      this.$refs.audio.currentTime = Math.floor(index / 100 * this.audio.maxTime)
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'iconfont';  /* project id 1336392 */
  src: url('//at.alicdn.com/t/font_1336392_gv2eli7nq6j.eot');
  src: url('//at.alicdn.com/t/font_1336392_gv2eli7nq6j.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1336392_gv2eli7nq6j.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1336392_gv2eli7nq6j.woff') format('woff'),
  url('//at.alicdn.com/t/font_1336392_gv2eli7nq6j.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1336392_gv2eli7nq6j.svg#iconfont') format('svg');
}
.iconfont{
  font-family:"iconfont" !important;
  font-size:16px;font-style:normal;
  color: #3e84e9;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;}
.slider {
  width: 100%;
  position: relative;
  margin-left: 10px;
}

.slider-track {
  position: absolute;
  height: 2px;
  left: 0;
  right: 0;
  top: 50%;
  margin-top: -1px;
  width: 160px;
  background-color: #bec2c1;
}

.slider-fill {
  position: absolute;
  height: 2px;
  width: 100%;
  background-color: #3e84e9;
  left: 0;
  top: 50%;
  margin-top: -1px;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background-color: #3e84e9;
  color: #e92e35;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
  .slider-time{
    margin-left: 20px;
  }
  .slider-icon{
    width: 30px;
    cursor: pointer;
  }
</style>
