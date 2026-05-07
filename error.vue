<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string } }>()

const site = useSite()

useSeoMeta({
  title: props.error.statusCode === 404 ? 'Not found' : 'Error',
  robots: 'noindex'
})

const handleHome = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <PasswordGate />

    <div class="p-[10px]">
      <header class="mb-[30px]">
        <NuxtLink to="/" class="block w-fit link" @click="handleHome">{{ site.name }}</NuxtLink>
      </header>

      <main>
        <h1 class="font-normal mb-[5px]">{{ props.error.statusCode === 404 ? 'Not found' : 'Something went wrong' }}</h1>
        <p class="text-neutral-500 mb-[15px]">
          {{ props.error.statusCode === 404
            ? 'This page does not exist.'
            : (props.error.statusMessage || 'Please try again.') }}
        </p>
        <button type="button" class="link underline" @click="handleHome">Back to home</button>
      </main>
    </div>
  </div>
</template>
