<template>
  <button
    class="btn"
    :class="{ 'btn-loading': loading }"
    :style="computedStyle"
    @click="handleClick"
  >
    <img v-if="icon" :src="icon" :alt="label" class="btn-icon" />
    <span v-else class="btn-text">
      <span class="btn-text-inner">{{ loading ? loadingText : label }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: 'Button'
  },
  icon: {
    type: String,
    default: ''
  },
  btnStyle: {
    type: Object,
    default: () => ({})
  },
  onClick: {
    type: Function,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  }
});

const handleClick = (event: MouseEvent) => {
  if (!props.loading && props.onClick) {
    props.onClick(event);
  }
};

const computedStyle = computed(() => {
  return {
    '--button-height': '70px',
    ...props.btnStyle
  };
});
</script>

<style scoped>
@font-face {
  font-family: 'Poppins';
  src: url('@/assets/fonts/Poppins/Poppins-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

.btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  height: 70px;
  padding: 16px 46px;
  margin: auto;
  font-family: 'Poppins', sans-serif;
  font-size: 30px;
  font-weight: 300;
  
  text-align: center;
  text-decoration: none;
  background-color: transparent;
  border: 2px solid #181c1c;
  border-radius: 15px;
  overflow: hidden;
  user-select: none;
  touch-action: manipulation;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  box-shadow: 1px 1px 25px 10px rgba(22, 22, 22, 0.4);
  outline: 0;
  background-color: #000000;
  transform: translateY(-2px);
}

.btn:active {
  background-color: #000000;
  transform: translateY(0);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(167, 165, 165, 0.664), transparent);
  transition: left 0.65s ease;
  z-index: -1;
}

.btn:hover::before {
  left: 100%;
}

.btn::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -1px;
  width: 100%;
  height: 70px;
  background-color: transparent;
  border-radius: 15px;
  transform: translate(-1px, -5px);
  transition: transform 0.2s ease-out;
  z-index: -1;
}

.btn:hover::after {
  transform: translate(0, 0);
}

.btn-text {
  position: relative;
  z-index: 1;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-weight: normal;
  letter-spacing: 0.05em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.btn-text-inner {
  position: relative;
  display: inline-block;
  background: linear-gradient(to right, #302f2f, #c4c4c4 50%, #d1d1d1 50%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
  background-position: 100%;
  transition: background-position 0.7s ease;
}

.btn:hover .btn-text-inner {
  background-position: 0 100%;
}

.btn-loading {
  pointer-events: none;
  opacity: 0.7;
}

.btn-icon {
  width: auto;
  height: 50px;
  max-width: 100%;
  object-fit: contain;
  
}

.xs .btn {
  font-size: 20px;
  padding: 12px 32px;
}

.sm .btn {
  font-size: 20px;
  padding: 14px 40px;
}

.md .btn {
  font-size: 20px;
  padding: 16px 46px;
}

.lg .btn,
.xl .btn,
.xxl .btn {
  font-size: 26px;
  padding: 18px 52px;
}
</style>