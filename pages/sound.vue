<script setup>
const site = useSite()
const sounds = computed(() => site.sounds ?? [])
const playing = ref(null)

function toggle(filename) {
  playing.value = playing.value === filename ? null : filename
}
</script>

<template>
  <section>
    <audio
      v-if="playing"
      :src="`/sounds/${playing.value}`"
      autoplay
      @ended="playing.value = null"
    />
    <ul class="list">
      <li v-for="sound in sounds" :key="sound.file">
        <button class="block w-fit text-left" @click="toggle(sound.file)">
          {{ sound.name }}<span v-if="playing.value === sound.file"> ◼</span><span v-else> ▶</span>
        </button>
      </li>
    </ul>
  </section>
</template>
