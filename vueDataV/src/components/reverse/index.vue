<!--
 描述: 反转
 -->
<template>
  <div class="wrap-container sn-container">
    <div class="sn-content">
      <div class="sn-title">反转</div>

      <div class="main">
        <div class="main-left">
          <div class="completion">
            <div class="completion-content">
              <div class="rate">
                <h5><span>完成率</span></h5>
                <p>67%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "reverse",
  data() {
    return {
      option: null,
    };
  },
  mounted() {},
  methods: {},
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.sn-container {
  left: 880px;
  top: 3300px;
  width: 432px;
  height: 600px;
}

.main {
  width: 100%;
  height: 100%;
  padding: 5%;
  position: relative;
}
.main .main-left .completion {
  width: 100%;
  height: 30%;
  position: relative;
  padding: 15%;
}

.main .main-left .completion .completion-content {
  width: 17rem;
  height: 17rem;
  background: url(../../assets/img/reverse/border.png) no-repeat center;
  background-size: contain;
}

.main .main-left .completion .completion-content .rate {
  width: 14rem;
  height: 14rem;
  position: absolute;
  left: 13%;
  top: 51%;
  transform: translateY(-50%);
  background: url(../../assets/img/reverse/cricle.png) no-repeat center;
  background-size: contain;
  animation: rotate1 5s linear infinite;
}

.main .main-left .completion .completion-content .rate h5 {
  text-align: center;
  height: 50%;
  width: 100%;
  color: #fff;
  display: table;
}

.main .main-left .completion .completion-content .rate h5 span {
  display: table-cell;
  vertical-align: bottom;
  font-size: 1.2rem;
}

.main .main-left .completion .completion-content .rate p {
  text-align: center;
  height: 50%;
  width: 100%;
  color: #fff;
  display: table;
}

.main .main-left .completion .completion-content .rate p span {
  display: table-cell;
  vertical-align: middle;
}

@keyframes animate1 {
  0% {
    left: 50%;
  }
  100% {
    left: 50%;
  }
}

@keyframes rotate1 {
  0% {
    transform: translateY(-50%) rotateY(0);
  }
  100% {
    transform: translateY(-50%) rotateY(360deg);
  }
}
</style>
