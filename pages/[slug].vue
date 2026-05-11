<script setup lang="ts">
const route = useRoute()
const site = useSite()

const project = computed(() =>
  site.selectedWork.find(p => p.slug === route.params.slug)
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useHead({ title: project.value?.title ?? '' })

const { data: raw } = await useFetch('/api/project-images', {
  query: { folder: project.value?.folder }
})

const VIDEO_EXT = ['.mp4', '.webm', '.mov']

const mediaList = computed<string[]>(() => (raw.value as any)?.images ?? [])

function isVideo(src: string) {
  return VIDEO_EXT.some(ext => src.toLowerCase().endsWith(ext))
}

const descriptionLines = computed<string[]>(() => {
  const desc = (project.value as any)?.description
  if (!desc) return []
  return desc.split('|').map((s: string) => s.trim()).filter(Boolean)
})

// Unlock autoplay on first interaction
function unlockVideos() {
  document.querySelectorAll('video[data-thumb]').forEach(v => {
    const vid = v as HTMLVideoElement
    vid.muted = true
    vid.play().catch(() => {})
  })
}

onMounted(() => {
  // Try immediately first
  nextTick(() => {
    document.querySelectorAll('video[data-thumb]').forEach(v => {
      const vid = v as HTMLVideoElement
      vid.muted = true
      vid.play().catch(() => {})
    })
  })
  // Fallback: unlock on first user interaction
  document.addEventListener('click', unlockVideos, { once: true })
  document.addEventListener('touchstart', unlockVideos, { once: true })
})

onUnmounted(() => {
  document.removeEventListener('click', unlockVideos)
  document.removeEventListener('touchstart', unlockVideos)
})

// Lightbox
const activeIndex = ref<number | null>(null)
const open = (i: number) => activeIndex.value = i
const close = () => activeIndex.value = null
const prev = () => {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value - 1 + mediaList.value.length) % mediaList.value.length
}
const next = () => {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + 1) % mediaList.value.length
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
    <h1 class="title">{{ project?.title }}</h1>
    <div v-if="descriptionLines.length" class="description">
      <p v-for="line in descriptionLines" :key="line">{{ line }}</p>
    </div>

    <div class="grid">
      <button
        v-for="(src, i) in mediaList"
        :key="src"
        :class="['cell', isVideo(src) ? 'cell--video' : 'cell--image']"
        :aria-label="`Open ${i + 1}`"
        @click="open(i)"
      >
        <video
          v-if="isVideo(src)"
          :src="src"
          data-thumb
          autoplay
          muted
          playsinline
          loop
          preload="auto"
        />
        <img
          v-else
          :src="src"
          :alt="`Image ${i + 1}`"
        />
        <span class="num">({{ i + 1 }})</span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="activeIndex !== null" class="lb" @click.self="close">
          <button class="lb-close" @click="close">✕</button>
          <span class="lb-count">
            {{ String((activeIndex ?? 0) + 1).padStart(2, '0') }} / {{ String(mediaList.length).padStart(2, '0') }}
          </span>
          <div class="lb-content">
            <video
              v-if="isVideo(mediaList[activeIndex ?? 0])"
              :src="mediaList[activeIndex ?? 0]"
              controls
              autoplay
              playsinline
              class="lb-media"
            />
            <img
              v-else
              :src="mediaList[activeIndex ?? 0]"
              class="lb-media"
            />
          </div>
          <button class="lb-prev" @click="prev">←</button>
          <button class="lb-next" @click="next">→</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.title {
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 6px;
}

.description {
  margin-bottom: 24px;
}

.description p {
  font-size: 0.7rem;
  font-weight: 400;
  opacity: 0.4;
  letter-spacing: 0.02em;
  margin: 0;
  line-height: 1.6;
}

/* Mobile: 2 columns */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  align-items: start;
}

/* Desktop: auto-fill */
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

.cell {
  position: relative;
  cursor: pointer;
  background: #111;
  border: none;
  padding: 0;
  display: block;
  overflow: hidden;
}

.cell--image {
  aspect-ratio: 3 / 4;
}

.cell--image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s;
}

/* Mobile: video full width */
.cell--video {
  grid-column: span 2;
  aspect-ratio: 16 / 9;
}

/* Desktop: video spans 4 columns */
@media (min-width: 640px) {
  .cell--video {
    grid-column: span 4;
  }
}

.cell--video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s;
}

.cell:hover img,
.cell:hover video {
  opacity: 0.75;
}

.num {
  position: absolute;
  bottom: 5px;
  left: 7px;
  font-size: 0.55rem;
  color: #fff;
  opacity: 0.5;
  pointer-events: none;
}

.lb {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0,0,0,0.96);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-media {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  display: block;
  background: #000;
}

.lb-close {
  position: fixed;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  opacity: 0.5;
  cursor: pointer;
  z-index: 2100;
  transition: opacity 0.15s;
}
.lb-close:hover { opacity: 1; }

.lb-count {
  position: fixed;
  top: 16px;
  left: 16px;
  font-size: 0.65rem;
  color: #fff;
  opacity: 0.4;
  z-index: 2100;
}

.lb-prev,
.lb-next {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  opacity: 0.35;
  cursor: pointer;
  padding: 12px 16px;
  z-index: 2100;
  transition: opacity 0.15s;
}
.lb-prev:hover,
.lb-next:hover { opacity: 1; }
.lb-prev { left: 12px; }
.lb-next { right: 12px; }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
