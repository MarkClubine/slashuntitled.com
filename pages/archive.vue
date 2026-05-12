<script setup lang="ts">
const site = useSite()
useSeoMeta({
  title: 'Archive',
  description: `Archive of older work by ${site.name}`
})
</script>

<template>
  <section>
    <h1 class="section-title">Personal Work</h1>
    <ul class="list">
      <li v-for="(item, i) in (site as any).personalWork" :key="item.slug">
        <NuxtLink :to="`/${item.slug}`" class="item">
          {{ String(i + 1).padStart(2, '0') }}
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.section-title {
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 12px;
}

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
