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

const { data } = await useFetch<{ images: string[] }>('/api/project-images', {
  query: { folder: item.value!.folder ?? '' },
  key: `images-${item.value!.slug}`
})

useSeoMeta({
  title: item.value!.title,
  description: `${item.value!.title} — work by ${site.name}`,
  ogImage: data.value?.images?.[0]
})
</script>

<template>
  <article v-if="item">
    <h1 class="mb-[15px] font-normal">{{ item.title }}</h1>
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
  </article>
</template>
