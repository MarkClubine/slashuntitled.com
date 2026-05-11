<script setup lang="ts">
const route = useRoute()
const site = useSite()

const project = computed(() =>
  site.selectedWork.find(p => p.slug === route.params.slug)
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useHead({
  title: project.value?.title ?? ''
})

const { data: images } = await useFetch('/api/project-images', {
  query: { folder: project.value?.folder }
})

const imageList = computed<string[]>(() => (images.value as any)?.images ?? [])

// Lightbox state
const activeIndex = ref<number | null>(null)

function open(i: number) {
  activeIndex.value = i
}

function close() {
  activeIndex.value = null
}

function prev() {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value - 1 + imageList.value.length) % imageList.value.length
}

function next() {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + 1) % imageList.value.length
}

function onKey(e: KeyboardEvent) {
  if (activeIndex.value === null) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <!-- Project title -->
    <h1 class="project-title">{{ project?.title }}</h1>

    <!-- Thumbnail grid -->
    <div class="grid">
      <button
        v-for="(src, i) in imageList"
        :key="src"
        class="thumb-wrap"
        :aria-label="`Open image ${i + 1}`"
        @click="open(i)"
      >
        <img :src="src" :alt="`Image ${i + 1}`" class="thumb-img" />
        <span class="thumb-number">({{ i + 1 }})</span>
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lb">
        <div
          v-if="activeIndex !== null"
          class="lightbox"
          @click.self="close"
        >
          <!-- Close -->
          <button class="lb-close" aria-label="Close" @click="close">&#x2715;</button>

          <!-- Counter -->
          <span class="lb-counter">
            {{ String((activeIndex ?? 0) + 1).padStart(2, '0') }} / {{ String(imageList.length).padStart(2, '0') }}
          </span>

          <!-- Image -->
          <div class="lb-img-wrap" @click.self="close">
            <img
              :src="imageList[activeIndex ?? 0]"
              :alt="`Image ${(activeIndex ?? 0) + 1}`"
              class="lb-img"
            />
          </div>

          <!-- Prev / Next -->
          <button class="lb-arrow lb-prev" aria-label="Previous" @click="prev">&#x2190;</button>
          <button class="lb-arrow lb-next" aria-label="Next" @click="next">&#x2192;</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Title ── */
.project-title {
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 24px;
  opacity: 0.5;
}

/* ── Thumbnail grid ── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 6px;
}

.thumb-wrap {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  cursor: pointer;
  background: #111;
  border: none;
  padding: 0;
  display: block;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s ease;
}

.thumb-wrap:hover .thumb-img {
  opacity: 0.75;
}

.thumb-number {
  position: absolute;
  bottom: 5px;
  left: 7px;
  font-size: 0.55rem;
  letter-spacing: 0.02em;
  color: #fff;
  opacity: 0.5;
  pointer-events: none;
}

/* ── Lightbox ── */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.96);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-img-wrap {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  display: block;
}

.lb-close {
  position: fixed;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s;
  z-index: 2100;
}
.lb-close:hover { opacity: 1; }

.lb-counter {
  position: fixed;
  top: 16px;
  left: 16px;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: #fff;
  opacity: 0.4;
  font-variant-numeric: tabular-nums;
  z-index: 2100;
}

.lb-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.35;
  transition: opacity 0.15s;
  padding: 12px 16px;
  z-index: 2100;
}
.lb-arrow:hover { opacity: 1; }
.lb-prev { left: 12px; }
.lb-next { right: 12px; }

/* ── Transition ── */
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.2s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
</style>
