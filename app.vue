<script setup lang="ts">
const site = useSite()
const config = useAppConfig()
const gate = config.gate as { enabled: boolean; passwordHash: string }
useSeoMeta({
  titleTemplate: title => (title ? `${title} — ${site.name}` : site.name),
  description: site.about.replace(/^TODO:.*/, '').trim() || `${site.name} — selected work`,
  ogSiteName: site.name,
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary',
  robots: gate.enabled ? 'noindex, nofollow' : null
})

const playing = useState<string | null>('playing', () => null)
const waveReady = useState<boolean>('waveReady', () => false)
const currentTime = useState<number>('currentTime', () => 0)

// WaveSurfer instance kept outside of reactive state to avoid proxy issues
let ws: any = null
const waveformEl = ref<HTMLElement | null>(null)

async function initWaveSurfer(filename: string) {
  if (ws) {
    ws.destroy()
    ws = null
  }
  waveReady.value = false
  currentTime.value = 0

  await nextTick()
  if (!waveformEl.value) return

  const WaveSurfer = (await import('wavesurfer.js')).default
  ws = WaveSurfer.create({
    container: waveformEl.value,
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
    waveReady.value = true
    ws.play()
  })

  ws.on('audioprocess', () => {
    currentTime.value = ws.getCurrentTime()
  })

  ws.on('finish', () => {
    playing.value = null
    waveReady.value = false
    currentTime.value = 0
  })
}

// Watch for play requests from any page
watch(playing, async (newTrack) => {
  if (!newTrack) {
    ws?.stop()
    ws?.destroy()
    ws = null
    waveReady.value = false
    currentTime.value = 0
    return
  }
  await nextTick()
  await initWaveSurfer(newTrack)
})

function stopAudio() {
  playing.value = null
}

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}
</script>

<template>
  <div>
    <PasswordGate />
    <div class="p-[10px]">
      <header class="mb-[30px]">
        <NuxtLink to="/" class="block w-fit link">{{ site.name }}</NuxtLink>
      </header>
      <main>
        <NuxtPage />
      </main>
    </div>

    <!-- Persistent player — always mounted, shown when playing -->
    <Transition name="player">
      <div v-if="playing" class="mini-player">
        <button class="mini-stop" @click="stopAudio">◼</button>
        <span class="mini-track">{{ playing.replace('.mp3', '').replace(/-/g, ' ') }}</span>
        <div
          class="mini-wave"
          :class="{ 'mini-wave--visible': waveReady }"
        >
          <div ref="waveformEl" class="mini-waveform" />
        </div>
        <span class="mini-time">{{ formatTime(currentTime) }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.mini-player {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
}

.mini-stop {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.45rem;
  opacity: 0.4;
  padding: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.mini-stop:hover { opacity: 1; }

.mini-track {
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  opacity: 0.4;
  flex-shrink: 0;
}

.mini-wave {
  width: 120px;
  overflow: hidden;
  opacity: 0;
  transform: scaleX(0.4);
  transform-origin: left;
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.mini-wave--visible {
  opacity: 1;
  transform: scaleX(1);
}

.mini-waveform {
  width: 100%;
}

.mini-time {
  font-size: 0.6rem;
  opacity: 0.3;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.player-enter-active,
.player-leave-active { transition: opacity 0.3s ease; }
.player-enter-from,
.player-leave-to { opacity: 0; }
</style>
