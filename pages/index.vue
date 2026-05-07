<script setup lang="ts">
const site = useSite()

useSeoMeta({
  title: '',
  ogTitle: site.name,
  description: `${site.name} — selected work, archive, contact`
})
</script>

<template>
  <div>
    <section class="mb-[30px]" aria-labelledby="selected-work-heading">
      <h2 id="selected-work-heading" class="mb-[5px] font-normal">Selected work</h2>
      <ul>
        <li v-for="item in site.selectedWork" :key="item.slug">
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

    <nav aria-label="Site sections">
      <a
        v-if="site.blog.url"
        :href="site.blog.url"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-fit"
      >{{ site.blog.label }}</a>
      <NuxtLink to="/about" class="block w-fit link">About</NuxtLink>
      <NuxtLink to="/archive" class="block w-fit link">Archive</NuxtLink>
    </nav>

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
  </div>
</template>
