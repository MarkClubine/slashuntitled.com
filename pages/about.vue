<script setup lang="ts">
const site = useSite()

useSeoMeta({
  title: 'About',
  description: site.about.replace(/^TODO:.*/, '').trim() || `About ${site.name}`
})
</script>

<template>
  <article class="max-w-[600px]">
    <h1 class="sr-only">About</h1>
    <p class="whitespace-pre-line">{{ site.about }}</p>

    <footer class="mt-[30px]">
      <a
        v-if="site.instagram.url"
        :href="site.instagram.url"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-fit"
      >{{ site.instagram.handle }}</a>
      <a
        v-if="site.email"
        :href="`mailto:${site.email}`"
        class="block w-fit"
      >{{ site.email }}</a>
    </footer>
  </article>
</template>
