// useBreakpoints.ts
import { ref, onMounted, onUnmounted, computed, ComputedRef } from 'vue'

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
}

type Breakpoint = keyof typeof breakpoints

export function useBreakpoints() {
  const width = ref(window.innerWidth)

  const onWidthChange = () => {
    width.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', onWidthChange)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onWidthChange)
  })

  /**
   * Checks if the current width is greater than or equal to a specific breakpoint.
   * @param breakpoint The breakpoint to compare against.
   * @returns A computed boolean indicating if the width is greater than or equal to the breakpoint.
   * @example
   * const isLgOrAbove = greaterThan('lg')
   * // In <script>: if (isLgOrAbove.value) { ... }
   * // In <template>: <div v-if="isLgOrAbove">...</div>
   */
  const greaterThan = (breakpoint: Breakpoint): ComputedRef<boolean> =>
    computed(() => width.value >= breakpoints[breakpoint])


  /**
   * Checks if the current width is less than a specific breakpoint.
   * @param breakpoint The breakpoint to compare against.
   * @returns A computed boolean indicating if the width is less than the breakpoint.
   * @example
   * const isBelowMd = lessThan('md')
   * // In <script>: if (isBelowMd.value) { ... }
   * // In <template>: <div v-if="isBelowMd">...</div>
   */
  const lessThan = (breakpoint: Breakpoint): ComputedRef<boolean> =>
    computed(() => width.value < breakpoints[breakpoint])


  /**
   * Checks if the current width is between two breakpoints (inclusive of min, exclusive of max).
   * @param minBreakpoint The minimum breakpoint.
   * @param maxBreakpoint The maximum breakpoint.
   * @returns A computed boolean indicating if the width is between the breakpoints.
   * @example
   * const isBetweenSmAndLg = between('sm', 'lg')
   * // In <script>: if (isBetweenSmAndLg.value) { ... }
   * // In <template>: <div v-if="isBetweenSmAndLg">...</div>
   */
  const between = (minBreakpoint: Breakpoint, maxBreakpoint: Breakpoint): ComputedRef<boolean> =>
    computed(
      () => width.value >= breakpoints[minBreakpoint] && width.value < breakpoints[maxBreakpoint]
    )


  /**
   * The current breakpoint based on the window width.
   * @returns A computed breakpoint value.
   * @example
   * const currentBreakpoint = current
   * // In <script>: if (currentBreakpoint.value === 'lg') { ... }
   * // In <template>: <div :class="current">...</div>
   * // In <style>: .lg .my-component { ... }
   */
  const current = computed<Breakpoint>(() => {
    const breakpointEntries = Object.entries(breakpoints)
    const currentBreakpoint = breakpointEntries.reverse().find(([_, value]) => width.value >= value)
    return currentBreakpoint ? (currentBreakpoint[0] as Breakpoint) : 'xs'
  })


  /**
   * Checks if the current breakpoint is 'xs'.
   * @returns A computed boolean indicating if the current breakpoint is 'xs'.
   * @example
   * const isXs = xs
   * // In <script>: if (isXs.value) { ... }
   * // In <template>: <div v-if="isXs">...</div>
   * // In <style>: .xs .my-component { ... }
   */
  const xs: ComputedRef<boolean> = computed(() => current.value === 'xs')


  /**
   * Checks if the current breakpoint is 'sm'.
   * @returns A computed boolean indicating if the current breakpoint is 'sm'.
   * @example
   * const isSm = sm
   * // In <script>: if (isSm.value) { ... }
   * // In <template>: <div v-if="isSm">...</div>
   * // In <style>: .sm .my-component { ... }
   */
  const sm: ComputedRef<boolean> = computed(() => current.value === 'sm')


  /**
   * Checks if the current breakpoint is 'md'.
   * @returns A computed boolean indicating if the current breakpoint is 'md'.
   * @example
   * const isMd = md
   * // In <script>: if (isMd.value) { ... }
   * // In <template>: <div v-if="isMd">...</div>
   * // In <style>: .md .my-component { ... }
   */
  const md: ComputedRef<boolean> = computed(() => current.value === 'md')


  /**
   * Checks if the current breakpoint is 'lg'.
   * @returns A computed boolean indicating if the current breakpoint is 'lg'.
   * @example
   * const isLg = lg
   * // In <script>: if (isLg.value) { ... }
   * // In <template>: <div v-if="isLg">...</div>
   * // In <style>: .lg .my-component { ... }
   */
  const lg: ComputedRef<boolean> = computed(() => current.value === 'lg')


  /**
   * Checks if the current breakpoint is 'xl'.
   * @returns A computed boolean indicating if the current breakpoint is 'xl'.
   * @example
   * const isXl = xl
   * // In <script>: if (isXl.value) { ... }
   * // In <template>: <div v-if="isXl">...</div>
   * // In <style>: .xl .my-component { ... }
   */
  const xl: ComputedRef<boolean> = computed(() => current.value === 'xl')


  /**
   * Checks if the current breakpoint is 'xxl'.
   * @returns A computed boolean indicating if the current breakpoint is 'xxl'.
   * @example
   * const isXxl = xxl
   * // In <script>: if (isXxl.value) { ... }
   * // In <template>: <div v-if="isXxl">...</div>
   * // In <style>: .xxl .my-component { ... }
   */
  const xxl: ComputedRef<boolean> = computed(() => current.value === 'xxl')

  
  return {
    width,
    current,
    greaterThan,
    lessThan,
    between,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl
  }
}