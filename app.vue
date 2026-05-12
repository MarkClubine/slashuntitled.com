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
const wsInstance = useState<any>('wsInstance', () => null)

function stopAudio() {
  if (wsInstance.value) {
    wsInstance.value.stop()
  }
  playing.value = null
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

    <!-- Mini player shown on other pages -->
    <Transition name="player">
      <div v-if="playing" class="mini-player">
        <span class="mini-track">{{ playing.replace('.mp3', '').replace(/-/g, ' ') }}</span>
        <button class="mini-stop" @click="stopAudio">◼</button>
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

.mini-track {
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  opacity: 0.4;
}

.mini-stop {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.45rem;
  opacity: 0.4;
  padding: 0;
  transition: opacity 0.15s;
}
.mini-stop:hover { opacity: 1; }

.player-enter-active,
.player-leave-active { transition: opacity 0.3s ease; }
.player-enter-from,
.player-leave-to { opacity: 0; }
</style>
