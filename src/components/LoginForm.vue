<script setup lang="ts">
import { ref, type Ref } from 'vue'

import type { FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useSession } from '@/store/session'
import { useRouter } from 'vue-router'

const session = useSession()
const router = useRouter()
const isInvalid: Ref<Boolean> = ref(false)

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: 'Укажите логин' }),
    password: z.string().min(1, { message: 'Укажите пароль ' }),
  }),
)

const onFormSubmit = async (e: FormSubmitEvent) => {
  if (!e.valid) {
    isInvalid.value = true
    const timer = setInterval(() => {
      isInvalid.value = false
      clearTimeout(timer)
    }, 500)

    return
  }

  const { username, password } = e.values

  await session.login(username, password)
  router.push({ name: 'track' })
}
</script>

<template>
  <Card class="m-auto lg:w-80 sm:w-64" :class="{ shake: isInvalid }">
    <template #title>
      <div class="flex gap-2 items-center justify-center">
        <i class="pi pi-spin pi-cog" />
        <p>Auto Graph</p>
        <i class="pi pi-spin pi-cog" />
      </div>
    </template>
    <template #content>
      <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-2 w-full">
        <div class="flex flex-col gap-1">
          <InputText name="username" type="text" placeholder="Логин" fluid />
          <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
            $form.username.error.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <Password name="password" placeholder="Пароль" :feedback="false" toggle-mask fluid />
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple"
            >{{ $form.password.error.message }}
          </Message>
        </div>

        <Button class="mt-2" type="submit" severity="secondary" label="Войти" />
      </Form>
    </template>
  </Card>
</template>
2

<style scoped lang="scss">
.shake {
  animation: horizontal-shaking 0.5s ease infinite;
}

@keyframes horizontal-shaking {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(5px);
  }
  50% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
