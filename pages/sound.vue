<script setup lang="ts">
definePageMeta({ ssr: false })

const site = useSite()
const sounds = computed(() => (site as any).sounds ?? [])
const playing = useState<string | null>('playing')

function toggle(filename: string) {
  playing.value = playing.value === filename ? null : filename
}
</script>

<template>
  <section>
    <ul class="list">
      <li v-for="sound in sounds" :key="(sound as any).file">
        <button class="block w-fit text-left" @click="toggle((sound as any).file)">
          {{ (sound as any).name }}<span v-if="playing === (sound as any).file"> ◼</span>
        </button>
      </li>
    </ul>
  </section>
</template>
