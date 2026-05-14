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
    <div>
      <div class="max-w-[400px] mx-auto flex items-end justify-around py-4 px-4">
        <button
          @click="navigateTo('/home')"
          :class="[
            'flex flex-col items-center gap-1 transition-all',
          ]"
        >
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all',
              isActive('/home') 
                ? 'bg-white/40 text-[#4A6741] scale-110 shadow-xl' 
                : 'bg-white/20 text-white/80 hover:bg-white/30 hover:scale-105 active:scale-95'
            ]"
          ></div>
          <span class="text-[10px] font-bold text-white drop-shadow-md">五十音图</span>
        </button>

        <button
          @click="navigateTo('/course')"
          :class="[
            'flex flex-col items-center gap-1 transition-all',
          ]"
        >
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all',
              isActive('/course') 
                ? 'bg-white/40 text-[#4A6741] scale-110 shadow-xl' 
                : 'bg-white/20 text-white/80 hover:bg-white/30 hover:scale-105 active:scale-95'
            ]"
          ></div>
          <span class="text-[10px] font-bold text-white drop-shadow-md">课程</span>
        </button>

        <button
          @click="navigateTo('/my')"
          :class="[
            'flex flex-col items-center gap-1 transition-all',
          ]"
        >
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all',
              isActive('/my') 
                ? 'bg-white/40 text-[#4A6741] scale-110 shadow-xl' 
                : 'bg-white/20 text-white/80 hover:bg-white/30 hover:scale-105 active:scale-95'
            ]"
          ></div>
          <span class="text-[10px] font-bold text-white drop-shadow-md">我的</span>
        </button>
      </div>
    </div>
  </div>
</template>
