import { defineStore } from 'pinia'
import { login } from '@/shared/services/jsonService'

export const useSession = defineStore('session', {
  state: () => ({
    token: undefined as string | undefined,
    schemaId: undefined as string | undefined,
  }),
  getters: {
    isAuthentificated: (state) => !!state.token,
  },
  actions: {
    async login(username: string, password: string) {
      this.token = await login({ username, password })
    },
    async logout() {
      this.$reset()
    },
  },
  persist: true,
})
