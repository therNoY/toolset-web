<template>
  <div>
    {{hash}}
  </div>
</template>

<script>
import { getKuGouMusic } from "../../common/api";
export default {
  data() {
    return {
      hash:null
    }
  },
  methods: {
    getMusicDate(hash) {
      let args = {};
      args.hash = hash;
      getKuGouMusic(args).then(resp=>{
        this.hash = res
      });
    }
  },
  created() {
    this.getMusicDate(this.$route.query.hash);
  },
};
</script>

<style lang="css" scoped>
</style>