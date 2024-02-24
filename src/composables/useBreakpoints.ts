// src/composables/useBreakpoints.ts
import { ref, onMounted, onUnmounted, computed, ComputedRef, watch } from 'vue';
import { Breakpoints } from '../types/breakpoints';

export function useBreakpoints(breakpoints: Breakpoints) {
    const width = ref(window.innerWidth);

    const onWidthChange = () => {
        width.value = window.innerWidth;
    };

    onMounted(() => {
        window.addEventListener('resize', onWidthChange);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', onWidthChange);
    });

    const isMobile: ComputedRef<boolean> = computed(() => width.value <= breakpoints.mobile);
    const isTablet: ComputedRef<boolean> = computed(() => width.value > breakpoints.mobile && width.value <= breakpoints.tablet);
    const isLaptop: ComputedRef<boolean> = computed(() => width.value > breakpoints.tablet && width.value <= breakpoints.laptop);
    const isDesktop: ComputedRef<boolean> = computed(() => width.value > breakpoints.laptop);
    const updateCSSVariables = () => {
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--login-section-width', isMobile.value ? '90%' : isTablet.value ? '80%' : isLaptop.value ? '70%' : '35%');
    };

    watch([isMobile, isTablet, isLaptop, isDesktop], () => {
        updateCSSVariables();
    }, { immediate: true });

    return { width, isMobile, isTablet, isLaptop, isDesktop };
}