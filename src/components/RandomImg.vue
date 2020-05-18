<template>
  <div class="body">
    <img :src="img.url" alt />
    <CENTER class="comment">
      <div>{{img.copyright}}</div>
    </CENTER>
  </div>
</template>

<script>
import { randomSentence, randomImg } from "../common/api";
export default {
  data() {
    return {
      img: {},
      sentence: {}
    };
  },
  created() {
    // randomSentence()
    //   .then(resp => {
    //     if (resp.resCode == 0) {
    //       this.sentence = resp.resVal;
    //       console.log(this.sentence);
    //     } else {
    //       this.$message.error(resp.resMes);
    //     }
    //   })
    //   .catch(e => {
    //     log.error(e);
    //   });

    randomImg()
      .then(resp => {
        if (resp.resCode == 0) {
          this.img = resp.resVal;
          console.log(this.img);
        } else {
          this.$message.error(resp.resMes);
        }
      })
      .catch(e => {
        log.error(e);
      });
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
  width: 90%;
  height: 100%;
  left: 5%;
}
.comment {
  position: absolute;
  font-size: 13px;
  background-color: rgba(0, 0, 0, 0.493);
  width: 100%;
  height: 15%;
  color: rgb(255, 255, 255);
  bottom: 0px;
  font-size: 14px;
}
</style>