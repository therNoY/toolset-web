<template>
  <div>
    {{hash}}
  </div>
</template>

<script>
import { getKuGouMusic } from "@/config/getData";
export default {
  data() {
    return {
      hash:null
    }
  },
  methods: {
    async getMusicDate(hash) {
      let args = {};
      args.hash = hash;
      let res = await getKuGouMusic(this, args);
      this.hash = res.data;
    }
  },
  created() {
    this.getMusicDate(this.$route.query.hash);
  },
};
</script>

<style lang="css" scoped>
</style>