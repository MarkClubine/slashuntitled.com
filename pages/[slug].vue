<script setup lang="ts">
const route = useRoute()
const site = useSite()

const item = computed(() => {
  const slug = route.params.slug as string
  return (
    site.selectedWork.find(w => w.slug === slug) ||
    site.archive.find(w => w.slug === slug)
  )
})

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}

useHead({ title: `${item.value!.title} — ${site.name}` })

const { data } = await useFetch<{ images: string[] }>('/api/project-images', {
  query: { folder: item.value!.folder ?? '' }
})
</script>

<template>
  <div v-if="item">
    <div class="mb-[15px]">{{ item.title }}</div>
    <div v-if="data?.images?.length" class="space-y-[10px] max-w-[900px]">
      <img
        v-for="src in data.images"
        :key="src"
        :src="src"
        :alt="item.title"
        class="block w-full h-auto"
        loading="lazy"
      />
    </div>
    <p v-else class="text-neutral-500">No images yet.</p>
  </div>
</template>
