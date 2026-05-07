<script setup lang="ts">
const site = useSite()
useHead({ title: `About — ${site.name}` })
</script>

<template>
  <div class="max-w-[600px]">
    <p class="whitespace-pre-line">{{ site.about }}</p>

    <div class="mt-[30px]">
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
    </div>
  </div>
</template>
