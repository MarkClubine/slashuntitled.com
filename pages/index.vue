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
const currentTimes = ref<Record<string, number>>({})
const waveReady = ref<Record<string, boolean>>({})

async function initWaveSurfer(filename: string) {
  if (wavesurfers.value[filename]) return

  const el = waveformRefs.value[filename]
  if (!el) return

  const WaveSurfer = (await import('wavesurfer.js')).default

  const ws = WaveSurfer.create({
    container: el,
    waveColor: '#ff0000',
    progressColor: '#7a0000',
    cursorColor: 'transparent',
    barWidth: 1.5,
    barGap: 1.5,
    barRadius: 1,
    height: 20,
    normalize: true,
    interact: true,
    url: `/sounds/${filename}`,
  })

  ws.on('ready', () => {
    waveReady.value[filename] = true
  })

  ws.on('audioprocess', () => {
    currentTimes.value[filename] = ws.getCurrentTime()
  })

  ws.on('finish', () => {
    playing.value = null
    wsInstance.value = null
    waveReady.value[filename] = false
  })

  wavesurfers.value[filename] = ws
  wsInstance.value = ws
}

async function toggle(filename: string) {
  if (playing.value === filename) {
    wavesurfers.value[filename]?.pause()
    playing.value = null
    wsInstance.value = null
    waveReady.value[filename] = false
    return
  }

  if (playing.value && wavesurfers.value[playing.value]) {
    wavesurfers.value[playing.value].stop()
    waveReady.value[playing.value] = false
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
          <!-- Single row: button + name + waveform + time -->
          <div class="track-row">
            <button class="play-btn" @click="toggle(track.file)">
              {{ playing === track.file ? '◼' : '▶' }}
            </button>
            <span class="track-name">{{ track.name }}</span>

            <!-- Waveform inline -->
            <div
              v-if="playing === track.file"
              class="wave-container"
              :class="{ 'wave-visible': waveReady[track.file] }"
            >
              <div
                :ref="el => waveformRefs[track.file] = el as HTMLElement"
                class="waveform"
              />
            </div>

            <span v-if="playing === track.file" class="track-time">
              {{ formatTime(currentTimes[track.file]) }}
            </span>
          </div>
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
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.track-item {
  display: flex;
  flex-direction: column;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 20px;
}

.track-name {
  font-size: 0.85rem;
  font-weight: 400;
  flex-shrink: 0;
}

/* Waveform grows in smoothly */
.wave-container {
  flex: 1;
  overflow: hidden;
  opacity: 0;
  transform: scaleX(0.6);
  transform-origin: left;
  transition: opacity 0.5s ease, transform 0.5s ease;
  max-width: 300px;
}

.wave-container.wave-visible {
  opacity: 1;
  transform: scaleX(1);
}

.waveform {
  width: 100%;
}

.track-time {
  font-size: 0.6rem;
  opacity: 0.35;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}
</style>
