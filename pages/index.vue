<script setup lang="ts">
const site = useSite()

useSeoMeta({
  title: '',
  ogTitle: site.name,
  description: `${site.name} — selected work, archive, contact`
})

const { data: projectImages } = await useFetch<Record<string, string[]>>('/api/all-project-images')

const expandedSlug = useState<string | null>('expandedSlug', () => null)
const expandedImages = ref<string[]>([])

const expandedItem = computed(() =>
  (site.selectedWork as any[]).find((p: any) => p.slug === expandedSlug.value) ?? null
)

const descriptionLines = computed<string[]>(() => {
  const desc = expandedItem.value?.description
  if (!desc) return []
  return desc.split('|').map((s: string) => s.trim()).filter(Boolean)
})

const credits = computed(() => expandedItem.value?.credits ?? {})

const VIDEO_EXT = ['.mp4', '.webm', '.mov']
function isVideo(src: string) {
  return VIDEO_EXT.some(ext => src.toLowerCase().endsWith(ext))
}

function toggleProject(item: any) {
  if (expandedSlug.value === item.slug) {
    expandedSlug.value = null
    expandedImages.value = []
    activeIndex.value = null
    return
  }
  expandedSlug.value = item.slug
  activeIndex.value = null
  expandedImages.value = projectImages.value?.[item.folder] ?? []
}

const activeIndex = ref<number | null>(null)
const open = (i: number) => activeIndex.value = i
const close = () => activeIndex.value = null
const prev = () => {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value - 1 + expandedImages.value.length) % expandedImages.value.length
}
const next = () => {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + 1) % expandedImages.value.length
}

const activeCredit = computed(() => {
  if (activeIndex.value === null) return null
  return credits.value[String(activeIndex.value)] ?? null
})

function onKey(e: KeyboardEvent) {
  if (activeIndex.value === null) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

let touchStartX = 0
function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) < 50) return
  if (diff > 0) next()
  else prev()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <section class="mb-[30px]">
      <Transition name="heading">
        <h2 v-if="!expandedSlug" class="mb-[5px] font-normal">Selected work</h2>
      </Transition>
      <ul class="flex flex-col gap-[3px]">
        <li
          v-for="item in (site.selectedWork as any[])"
          :key="item.slug"
          class="project-item"
          :class="{ 'project-item--hidden': expandedSlug && expandedSlug !== item.slug }"
        >
          <button
            class="block w-fit text-left project-btn"
            :class="{ dimmed: expandedSlug === item.slug }"
            @click="toggleProject(item)"
          >
            {{ item.title }}
          </button>

          <Transition name="expand">
            <div v-if="expandedSlug === item.slug" class="expand-wrap">
              <div v-if="descriptionLines.length" class="description">
                <p v-for="line in descriptionLines" :key="line">{{ line }}</p>
              </div>
              <div class="grid">
                <div
                  v-for="(src, i) in expandedImages"
                  :key="src"
                  :class="['cell-wrap', isVideo(src) ? 'cell-wrap--video' : 'cell-wrap--image']"
                >
                  <button class="cell" :aria-label="`Open ${i + 1}`" @click="open(i)">
                    <video v-if="isVideo(src)" :src="src" muted playsinline autoplay loop preload="auto" class="thumb-img" />
                    <img v-else :src="src" :alt="`Image ${i + 1}`" class="thumb-img" />
                  </button>
                  <span class="num">({{ i + 1 }})</span>
                </div>
              </div>
            </div>
          </Transition>
        </li>
      </ul>
    </section>

    <Transition name="fade-nav">
      <div v-if="!expandedSlug">
        <nav class="mb-[30px]" aria-label="Site sections">
          <NuxtLink to="/archive" class="block w-fit">Archive</NuxtLink>
          <NuxtLink to="/sound" class="block w-fit">Sound</NuxtLink>
          <NuxtLink to="/about" class="block w-fit">About</NuxtLink>
        </nav>
        <footer>
          <a v-if="site.instagram.url" :href="site.instagram.url" target="_blank" rel="noopener noreferrer" class="block w-fit">{{ site.instagram.handle }}</a>
          <a v-if="site.email" :href="`mailto:${site.email}`" class="block w-fit">{{ site.email }}</a>
        </footer>
      </div>
    </Transition>

    <Teleport to="body">
      <Transition name="lb-fade">
        <div
          v-if="activeIndex !== null"
          class="lb"
          @click.self="close"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <button class="lb-close" @click="close">✕</button>
          <span class="lb-count">
            {{ String((activeIndex ?? 0) + 1).padStart(2, '0') }} / {{ String(expandedImages.length).padStart(2, '0') }}
          </span>
          <div class="lb-content">
            <div class="lb-media-wrap">
              <video
                v-if="isVideo(expandedImages[activeIndex ?? 0])"
                :src="expandedImages[activeIndex ?? 0]"
                controls autoplay playsinline
                class="lb-media"
              />
              <img v-else :src="expandedImages[activeIndex ?? 0]" class="lb-media" />
              <span v-if="activeCredit" class="lb-credit">{{ activeCredit }}</span>
            </div>
          </div>
          <button class="lb-prev" @click="prev">←</button>
          <button class="lb-next" @click="next">→</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Project items — stay in DOM, only opacity changes (no layout thrash) */
.project-item {
  transition: opacity 0.5s ease-in-out;
}
.project-item--hidden {
  opacity: 0;
  pointer-events: none;
}

/* Project button dimmed when its section is open */
.project-btn {
  transition: opacity 0.4s ease-in-out;
}
.project-btn.dimmed {
  opacity: 0.4;
}

/* Heading fade */
.heading-enter-active,
.heading-leave-active { transition: opacity 0.5s ease-in-out; }
.heading-enter-from,
.heading-leave-to { opacity: 0; }

/* Expand content */
.expand-wrap { overflow: hidden; }
.expand-enter-active { transition: opacity 0.65s ease-in-out 0.3s; }
.expand-leave-active { transition: opacity 0.3s ease-in-out; }
.expand-enter-from,
.expand-leave-to { opacity: 0; }

/* Nav/footer fade */
.fade-nav-enter-active { transition: opacity 0.5s ease-in-out 0.15s; }
.fade-nav-leave-active { transition: opacity 0.3s ease-in-out; }
.fade-nav-enter-from,
.fade-nav-leave-to { opacity: 0; }

/* Description */
.description {
  margin-top: 4px;
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

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 12px;
  align-items: start;
  margin-top: 20px;
}
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
}

.cell-wrap { display: flex; flex-direction: column; gap: 6px; }
.cell-wrap--image .cell { aspect-ratio: 3 / 4; }
.cell-wrap--video { grid-column: span 2; }
.cell-wrap--video .cell { aspect-ratio: 16 / 9; }
@media (min-width: 640px) {
  .cell-wrap--video { grid-column: span 4; }
}

.cell {
  position: relative;
  cursor: pointer;
  background: #111;
  border: none;
  padding: 0;
  display: block;
  overflow: hidden;
  width: 100%;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s;
}
.cell:hover .thumb-img { opacity: 0.75; }

.num {
  font-size: 0.55rem;
  color: #000;
  opacity: 0.4;
  letter-spacing: 0.02em;
}

/* Lightbox */
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
.lb-media-wrap {
  position: relative;
  display: inline-flex;
}
.lb-media {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  display: block;
  background: #000;
}
.lb-credit {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: 0.65rem;
  color: #fff;
  opacity: 0.5;
  letter-spacing: 0.03em;
  pointer-events: none;
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

.lb-fade-enter-active,
.lb-fade-leave-active { transition: opacity 0.2s ease; }
.lb-fade-enter-from,
.lb-fade-leave-to { opacity: 0; }
</style>
