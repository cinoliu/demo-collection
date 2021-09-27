<!--
 描述: 悬浮球
 -->
<template>
  <div class="wrap-container sn-container">
    <div class="sn-content">
      <div class="sn-title">悬浮球</div>
      <div class="xuanfudata">
        <div class="qiu">
          <p>70%</p>
        </div>
        <span>成功率</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "suspendedBall",
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
  left: 974px;
  top: 2838px;
  width: 432px;
  height: 400px;
}

.xuanfudata {
  color: #fff;
  text-align: center;
  position: absolute;
  width: 16rem;
  height: 16rem;
  background: url(../../assets/img/suspendedBall/di.png) no-repeat bottom center;
  background-size: contain;
  padding-top: 12%;
  box-sizing: border-box;
}

.xuanfudata .qiu {
  position: relative;
  width: 8rem;
  height: 8rem;
  margin: auto;
  display: table;
}

.xuanfudata .qiu p {
  display: table-cell;
  vertical-align: middle;
  font-size: 1.8rem;
}

.xuanfudata .qiu::before {
  content: "";
  display: block;
  width: 8rem;
  height: 8rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.5);
  animation: scale 2s linear infinite;
}

.xuanfudata span {
  font-size: 1.2rem;
}

.xuanfudata {
  left: 20%;
  top: 10%;
}

.xuanfudata .qiu {
  background: url(../../assets/img/suspendedBall/cicle02.png) no-repeat center;
  background-size: 100%;
}

@keyframes scale {
  0% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}
</style>
