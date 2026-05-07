<script setup lang="ts">
const site = useSite()
useHead({ title: `Archive — ${site.name}` })
</script>

<template>
  <div>
    <div class="mb-[5px]">Archive</div>
    <ul>
      <li v-for="item in site.archive" :key="item.slug">
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
  </div>
</template>
