<script setup lang="ts">
const site = useSite()

useSeoMeta({
  title: 'Archive',
  description: `Archive of older work by ${site.name}`
})
</script>

<template>
  <section aria-labelledby="archive-heading">
    <h1 id="archive-heading" class="mb-[5px] font-normal">Archive</h1>
    <p v-if="!site.archive.length" class="text-neutral-500">Nothing here yet.</p>
    <ul v-else>
      <li v-for="item in site.archive" :key="item.slug">
        <a
          v-if="item.url"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-fit"
        >{{ item.title }}</a>
        <NuxtLink
          v-else
          :to="`/${item.slug}`"
          class="block w-fit"
        >{{ item.title }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>
