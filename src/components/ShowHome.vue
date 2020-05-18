<template>
  <div class="body" v-if="music!=null">
    <audio
      :src="music.mp3Url"
      ref="audio"
      autoplay="ture"
      @play="onPlay"
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
    ></audio>
    <img :src="music.images" />

    <CENTER class="comment">
      <div>网易热评：</div>
      <div>{{music.commentNickname}} ： {{music.commentContent}}</div>
    </CENTER>
    <CENTER class="show_font">
      <div
        v-if="!play"
        @click="startPlay"
        @mouseover="readPlay = !readPlay"
        @mouseleave="readPlay = !readPlay"
      >
        <img class="play_button" v-show="readPlay" src="../assets/icon/play.png" />
        <img class="play_button" v-show="!readPlay" src="../assets/icon/play1.png" />
      </div>
      <div
        v-if="play"
        @click="pausePlay"
        @mouseover="readPause = !readPause"
        @mouseleave="readPause = !readPause"
      >
        <img class="pause_button" v-show="readPause" src="../assets/icon/pause.png" />
        <img class="pause_button" v-show="!readPause" src="../assets/icon/pause1.png" />
      </div>
      <div
        @click="getNewMusic"
        @mouseover="readNext = !readNext"
        @mouseleave="readNext = !readNext"
      >
        <img class="next_button" v-show="!readNext" src="../assets/icon/next.png" />
        <img class="next_button" v-show="readNext" src="../assets/icon/next1.png" />
      </div>
      <div class="start_time">{{formatSecond(audio.currentTime)}}</div>
      <el-slider
        v-model="sliderTime"
        :format-tooltip="formatProcessToolTip"
        @change="changeCurrentTime"
        class="slider"
      ></el-slider>
      <div class="end_time">{{formatSecond(audio.maxTime)}}</div>

      <div class="music_info">{{music.author}} - {{music.title}}</div>
    </CENTER>
  </div>
</template>

<script>
import { RandomMusic } from "../common/api";
import { realFormatSecond } from "../common/util";

export default {
  data() {
    return {
      music: null,
      audio: {
        currentTime: 0,
        maxTime: 0,
        playing: true, //是否自动播放
        muted: false, //是否静音
        speed: 1,
        waiting: true,
        preload: "auto"
      },
      play: true,
      readPlay: false,
      readPause: false,
      sliderTime: 0,
      readNext: false
    };
  },

  methods: {
    getNewMusic() {
      let asyncRes = RandomMusic();
      asyncRes.then(data => {
        if (data.resCode == 0) {
          console.log(data.resVal);
          this.music = data.resVal;
        }
      });
    },
    // 进度条toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt((this.audio.maxTime / 100) * index);
      return "进度条: " + realFormatSecond(index);
    },
    // 播放跳转
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = parseInt(
        (index / 100) * this.audio.maxTime
      );
    },
    // 开始播放
    startPlay() {
      this.$refs.audio.play();
      this.play = !this.play;
    },
    // 暂停
    pausePlay() {
      this.$refs.audio.pause();
      this.play = !this.play;
    },
    // 当音频暂停
    onPause() {
      console.log("暂停");
      this.audio.playing = false;
    },
    // 当发生错误, 就出现loading状态
    onError() {
      console.error("错误");
      this.$message({
        showClose: true,
        message: "资源错误，自动切换下一首",
        type: "error"
      });
      this.getNewMusic();
    },
    // 当音频开始等待
    onWaiting(res) {
      console.log("等待。。。");
    },
    // 当音频开始播放
    onPlay(res) {
      console.log("播放" + res);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime;
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      );
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.audio.maxTime = parseInt(res.target.duration);
    },

    formatSecond(second = 0) {
      return realFormatSecond(second);
    }
  },

  created() {
    this.getNewMusic();
  }
};
</script>

<style lang="css" scoped>
.body {
  position: relative;
  width: 100%;
  height: 100%;
}
img {
  position: absolute;
  width: 50%;
  height: 100%;
  left: 25%;
}
.show_font {
  position: absolute;
  font-size: 13px;
  background-color: rgba(0, 0, 0, 0.493);
  width: 100%;
  height: 15%;
  color: rgb(255, 255, 255);
  bottom: 0px;
  font-size: 14px;
}
.play_button,
.next_button,
.pause_button {
  width: 40px;
  height: 40px;
  left: 0px;
  top: 20%;
  cursor: pointer;
}
.next_button {
  left: 60px;
}
.el-slider {
  position: absolute;
  width: 500px;
  left: 160px;
  top: 22%;
  cursor: pointer;
}
.start_time {
  position: absolute;
  left: 110px;
  top: 30%;
}
.end_time {
  position: absolute;
  left: 690px;
  top: 30%;
}
.music_info {
  position: absolute;
  left: 750px;
  top: 30%;
}
.comment {
  position: absolute;
  top: 30%;
  color: rgb(255, 255, 255);
  width: 100%;
  height: 15%;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.493);
}
</style>