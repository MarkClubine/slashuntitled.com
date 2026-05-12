<script setup lang="ts">
const site = useSite()
useSeoMeta({
  title: '',
  ogTitle: site.name,
  description: `${site.name} — selected work, archive, contact`
})

const sounds = computed(() => (site as any).sounds ?? [])
const playing = useState<string | null>('playing')

function toggle(filename: string) {
  if (playing.value === filename) {
    playing.value = null
  } else {
    playing.value = filename
  }
}
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
      <ul class="flex flex-col gap-[3px]">
        <li v-for="track in sounds" :key="track.file" class="flex items-center gap-[8px]">
          <button class="play-btn" @click="toggle(track.file)">{{ playing === track.file ? '◼' : '▶' }}</button>
          <span class="track-name">{{ track.name }}</span>
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
}
.play-btn:hover { opacity: 1; }

.track-name {
  font-size: 0.85rem;
  font-weight: 400;
}
</style>
