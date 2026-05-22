<script setup lang="ts">
const site = useSite()

useSeoMeta({
  title: 'Archive',
  description: `Archive of older work by ${site.name}`
})

const archiveItems = computed(() => (site as any).archive ?? [])
const photography = computed(() => (site as any).photography ?? null)
</script>

<template>
  <section>
    <ul class="list">
      <li v-for="item in archiveItems" :key="item.slug">
        <NuxtLink :to="`/${item.slug}`" class="item">
          {{ item.title ?? item.slug }}
        </NuxtLink>
      </li>
      <li v-if="photography">
        <NuxtLink :to="`/${photography.slug}`" class="item">Photography</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  display: block;
  width: fit-content;
}
</style>
