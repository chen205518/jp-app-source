<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isActive = (path: string) => route.path === path

const navigateTo = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-40" :style="{ paddingBottom: `env(safe-area-inset-bottom, 0px)` }">
    <div class="bg-white/20 backdrop-blur-xl border-t border-white/30">
      <div class="max-w-[400px] mx-auto flex items-center justify-around py-4 px-4">
        <button
          @click="navigateTo('/home')"
          :class="[
            'w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all shadow-lg',
            isActive('/home') 
              ? 'bg-white/40 text-[#4A6741] scale-110 shadow-xl' 
              : 'bg-white/20 text-white/80 hover:bg-white/30 hover:scale-105 active:scale-95'
          ]"
        >
          <span class="text-xs font-bold">五十音图</span>
        </button>

        <button
          @click="navigateTo('/course')"
          :class="[
            'w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all shadow-lg',
            isActive('/course') 
              ? 'bg-white/40 text-[#4A6741] scale-110 shadow-xl' 
              : 'bg-white/20 text-white/80 hover:bg-white/30 hover:scale-105 active:scale-95'
          ]"
        >
          <span class="text-xs font-bold">课程</span>
        </button>

        <button
          @click="navigateTo('/my')"
          :class="[
            'w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all shadow-lg',
            isActive('/my') 
              ? 'bg-white/40 text-[#4A6741] scale-110 shadow-xl' 
              : 'bg-white/20 text-white/80 hover:bg-white/30 hover:scale-105 active:scale-95'
          ]"
        >
          <span class="text-xs font-bold">我的</span>
        </button>
      </div>
    </div>
  </div>
</template>
