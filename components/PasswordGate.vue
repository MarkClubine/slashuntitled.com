<script setup lang="ts">
const config = useAppConfig()
const gate = config.gate as { enabled: boolean; passwordHash: string }

const STORAGE_KEY = 'su-gate-v1'

const unlocked = ref(false)
const passwordInput = ref('')
const error = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

const isLocalhost = computed(() => {
  if (!import.meta.client) return false
  const h = location.hostname
  return h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0'
})

const isLocked = computed(() => {
  if (!gate.enabled) return false
  if (isLocalhost.value) return false
  return !unlocked.value
})

onMounted(() => {
  if (!gate.enabled) return
  if (localStorage.getItem(STORAGE_KEY) === '1') {
    unlocked.value = true
    return
  }
  inputEl.value?.focus()
})

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function submit() {
  const hash = await sha256Hex(passwordInput.value)
  if (hash === gate.passwordHash) {
    localStorage.setItem(STORAGE_KEY, '1')
    unlocked.value = true
    error.value = ''
    passwordInput.value = ''
  } else {
    error.value = 'Incorrect.'
    passwordInput.value = ''
    inputEl.value?.focus()
  }
}
</script>

<template>
  <div
    v-if="isLocked"
    class="fixed inset-0 z-[2000] bg-white p-[10px] flex items-start"
    role="dialog"
    aria-modal="true"
    aria-labelledby="gate-label"
  >
    <form class="w-fit" @submit.prevent="submit">
      <label id="gate-label" for="gate-pw" class="block mb-[5px]">Password</label>
      <input
        id="gate-pw"
        ref="inputEl"
        v-model="passwordInput"
        type="password"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        class="block border border-black px-[5px] py-[2px] w-[200px] outline-none"
      />
      <div class="mt-[5px] min-h-[1.4em] text-neutral-500" role="status" aria-live="polite">
        {{ error }}
      </div>
    </form>
  </div>
</template>
