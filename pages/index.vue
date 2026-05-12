<script setup lang="ts">
const site = useSite()
useSeoMeta({
  title: '',
  ogTitle: site.name,
  description: `${site.name} — selected work, archive, contact`
})

const sounds = computed(() => (site as any).sounds ?? [])
const playing = useState<string | null>('playing')
const wsInstance = useState<any>('wsInstance')

const waveformRefs = ref<Record<string, HTMLElement | null>>({})
const wavesurfers = ref<Record<string, any>>({})
const durations = ref<Record<string, number>>({})
const currentTimes = ref<Record<string, number>>({})

async function initWaveSurfer(filename: string) {
  if (wavesurfers.value[filename]) return

  const el = waveformRefs.value[filename]
  if (!el) return

  const WaveSurfer = (await import('wavesurfer.js')).default

  const ws = WaveSurfer.create({
    container: el,
    waveColor: '#ff0000',
    progressColor: '#880000',
    cursorColor: 'transparent',
    barWidth: 1.5,
    barGap: 1.5,
    barRadius: 1,
    height: 28,
    normalize: true,
    interact: true,
    url: `/sounds/${filename}`,
  })

  ws.on('ready', () => {
    durations.value[filename] = ws.getDuration()
  })

  ws.on('audioprocess', () => {
    currentTimes.value[filename] = ws.getCurrentTime()
  })

  ws.on('finish', () => {
    playing.value = null
    wsInstance.value = null
  })

  wavesurfers.value[filename] = ws
  wsInstance.value = ws
}

async function toggle(filename: string) {
  if (playing.value === filename) {
    wavesurfers.value[filename]?.pause()
    playing.value = null
    wsInstance.value = null
    return
  }

  // Stop previous
  if (playing.value && wavesurfers.value[playing.value]) {
    wavesurfers.value[playing.value].stop()
  }

  playing.value = filename

  await nextTick()
  await initWaveSurfer(filename)

  await nextTick()
  wavesurfers.value[filename]?.play()
  wsInstance.value = wavesurfers.value[filename]
}

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  Object.values(wavesurfers.value).forEach((ws: any) => ws?.destroy())
})
</script>

<template>
  <div>
    <section class="mb-[30px]" aria-labelledby="selected-work-heading">
      <h2 id="selected-work-heading" class="mb-[5px] font-normal">Selected work</h2>
      <ul class="flex flex-col gap-[3px]">
        <li v-for="item in site.selectedWork" :key="item.slug">
          <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer" class="block w-fit">{{ item.title }}</a>
          <NuxtLink v-else :to="`/${item.slug}`" class="block w-fit">{{ item.title }}</NuxtLink>
        </li>
      </ul>
    </section>

    <nav class="mb-[30px]" aria-label="Site sections">
      <a v-if="site.blog.url" :href="site.blog.url" target="_blank" rel="noopener noreferrer" class="block w-fit">{{ site.blog.label }}</a>
      <NuxtLink to="/about" class="block w-fit">About</NuxtLink>
      <NuxtLink to="/archive" class="block w-fit">Archive</NuxtLink>
    </nav>

    <section v-if="sounds.length" class="mb-[30px]">
      <h2 class="mb-[5px] font-normal">Sound</h2>
      <ul class="track-list">
        <li v-for="track in sounds" :key="track.file" class="track-item">
          <div class="track-top">
            <button class="play-btn" @click="toggle(track.file)">
              {{ playing === track.file ? '◼' : '▶' }}
            </button>
            <span class="track-name">{{ track.name }}</span>
            <span v-if="playing === track.file" class="track-time">
              {{ formatTime(currentTimes[track.file]) }}
            </span>
          </div>

          <!-- Waveform -->
          <Transition name="wave">
            <div v-if="playing === track.file" class="wave-wrap">
              <div
                :ref="el => waveformRefs[track.file] = el as HTMLElement"
                class="waveform"
              />
            </div>
          </Transition>
        </li>
      </ul>
    </section>

    <footer>
      <a v-if="site.instagram.url" :href="site.instagram.url" target="_blank" rel="noopener noreferrer" class="block w-fit">{{ site.instagram.handle }}</a>
      <a v-if="site.email" :href="`mailto:${site.email}`" class="block w-fit">{{ site.email }}</a>
    </footer>
  </div>
</template>

<style scoped>
.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.5rem;
  opacity: 0.5;
  padding: 0;
  line-height: 1;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.play-btn:hover { opacity: 1; }

.track-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.track-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.track-name {
  font-size: 0.85rem;
  font-weight: 400;
}

.track-time {
  font-size: 0.6rem;
  opacity: 0.35;
  letter-spacing: 0.04em;
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

.wave-wrap {
  padding-left: 16px;
  overflow: hidden;
}

.waveform {
  width: 100%;
  max-width: 400px;
}

/* Waveform slide-in animation */
.wave-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.wave-leave-active {
  transition: opacity 0.2s ease;
}
.wave-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.wave-leave-to {
  opacity: 0;
}
</style>
