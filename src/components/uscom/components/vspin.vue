<style lang="less">
@keyframes v-spin-rotate {
  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
@keyframes v-spin-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  to {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}
@keyframes v-spin-color {
  0%,
  to {
    stroke: #d62d20;
  }
  40% {
    stroke: #0057e7;
  }
  66% {
    stroke: #008744;
  }
  80%,
  90% {
    stroke: #ffa700;
  }
}
.v-spin-loader {
  width: 30px;
  height: 30px;
  position: relative;
  margin: 0 auto;
}
.v-spin-circular {
  animation: v-spin-rotate 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.v-spin-path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: v-spin-dash 1.5s ease-in-out infinite,
    v-spin-color 6s ease-in-out infinite;
  stroke-linecap: round;
}
</style>
<template>
  <Spin fix v-if="loading">
    <div class="v-spin-loader">
      <svg class="v-spin-circular" viewBox="25 25 50 50">
        <circle
          class="v-spin-path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke-width="5"
          stroke-miterlimit="10"
        />
      </svg>
    </div>
  </Spin>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  }
};
</script>