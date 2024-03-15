import { ref, onMounted, onUnmounted, computed, ComputedRef } from 'vue';

// Updated breakpoints
const breakpoints = {
    xs: 360,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
};

export function useBreakpoints() {
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

    const breakpoint = computed(() => {
        if (width.value <= breakpoints.xs) return 'xs';
        if (width.value <= breakpoints.sm) return 'sm';
        if (width.value <= breakpoints.md) return 'md';
        if (width.value <= breakpoints.lg) return 'lg';
        if (width.value <= breakpoints.xl) return 'xl';
        return 'xxl';
    });

    const xs: ComputedRef<boolean> = computed(() => breakpoint.value === 'xs');
    const sm: ComputedRef<boolean> = computed(() => breakpoint.value === 'sm');
    const md: ComputedRef<boolean> = computed(() => breakpoint.value === 'md');
    const lg: ComputedRef<boolean> = computed(() => breakpoint.value === 'lg');
    const xl: ComputedRef<boolean> = computed(() => breakpoint.value === 'xl');
    const xxl: ComputedRef<boolean> = computed(() => breakpoint.value === 'xxl');

    return { width, breakpoint, xs, sm, md, lg, xl, xxl };
}