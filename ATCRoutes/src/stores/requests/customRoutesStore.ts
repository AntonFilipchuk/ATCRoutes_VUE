import { defineStore } from 'pinia'
import { ref } from 'vue'

export const customRoutesStore = defineStore('customRoutesStore', () => {
  const customRoutes = ref(0)
  const loading = ref(true)
  const errorMessage = ref<string | null>(null)

  async function fetchCustomRoutes(url : string){
    try {
        const result = await fetch(url)

        

    } catch (error) {
        
    }
  }
})
