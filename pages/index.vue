<script setup lang="ts">
const site = useSite()
</script>

<template>
  <div>
    <section class="mb-[30px]">
      <div class="mb-[5px]">Selected work</div>
      <ul>
        <li v-for="item in site.selectedWork" :key="item.slug">
          <NuxtLink
            v-if="!item.url"
            :to="`/${item.slug}`"
            class="block w-fit"
          >{{ item.title }}</NuxtLink>
          <a
            v-else
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-fit"
          >{{ item.title }}</a>
        </li>
      </ul>
    </section>

    <a
      v-if="site.blog.url"
      :href="site.blog.url"
      target="_blank"
      rel="noopener noreferrer"
      class="block w-fit"
    >{{ site.blog.label }}</a>

    <NuxtLink to="/about" class="block w-fit link">About</NuxtLink>
    <NuxtLink to="/archive" class="block w-fit link">Archive</NuxtLink>

    <a
      v-if="site.instagram.url"
      :href="site.instagram.url"
      target="_blank"
      rel="noopener noreferrer"
      class="block w-fit mt-[30px]"
    >{{ site.instagram.handle }}</a>

    <a
      v-if="site.email"
      :href="`mailto:${site.email}`"
      class="block w-fit"
    >{{ site.email }}</a>
  </div>
</template>
