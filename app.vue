<script setup lang="ts">
const site = useSite()
const config = useAppConfig()
const gate = config.gate as { enabled: boolean; passwordHash: string }

useSeoMeta({
  titleTemplate: title => (title ? `${title} — ${site.name}` : site.name),
  description: site.about.replace(/^TODO:.*/, '').trim() || `${site.name} — selected work`,
  ogSiteName: site.name,
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary',
  // Keep the staging site out of search indexes while gated.
  robots: gate.enabled ? 'noindex, nofollow' : null
})
</script>

<template>
  <div>
    <PasswordGate />

    <div class="p-[10px]">
      <header class="mb-[30px]">
        <NuxtLink to="/" class="block w-fit link">{{ site.name }}</NuxtLink>
      </header>

      <main>
        <NuxtPage />
      </main>
    </div>

    <button
      class="fixed bottom-[5px] right-[10px] z-[1100]"
      aria-label="Accessibility options"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M23 14v-2H9v2h5v2.734l-3.868 6.77l1.736.992L15.58 18h.84l3.712 6.496l1.736-.992L18 16.734V14z"
        />
        <circle cx="16" cy="9" r="2" fill="currentColor" />
        <path
          fill="currentColor"
          d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14m0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4"
        />
      </svg>
    </button>
  </div>
</template>
