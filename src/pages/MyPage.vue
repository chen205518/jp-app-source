<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { getCourseList } from '@/data/dataManager'
import BottomNav from '@/components/BottomNav.vue'

const courses = ref(getCourseList())
const totalProgress = ref(0)

onMounted(() => {
  const total = courses.value.reduce((sum, course) => sum + course.progress, 0)
  totalProgress.value = Math.round(total / courses.value.length)
})
</script>

<template>
  <div class="min-h-dvh bg-[#7BA05B] flex flex-col" :style="{ paddingBottom: `env(safe-area-inset-bottom, 0px)` }">
    <h1 class="text-lg font-bold text-white mt-2 mb-1 text-center shrink-0">我的</h1>

    <div class="flex-1 overflow-y-auto px-3 pb-24">
      <div class="max-w-[300px] mx-auto space-y-3 py-1">
        <div class="bg-[#A8C686]/60 backdrop-blur-xl rounded-xl p-3 border border-white/20">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-[#4A6741] flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-bold text-[#4A6741]">日语学习者</h2>
              <p class="text-xs text-[#5C7A52]">开始学习日语吧！</p>
            </div>
          </div>
        </div>

        <div class="bg-[#A8C686]/60 backdrop-blur-xl rounded-xl p-3 border border-white/20">
          <h3 class="text-sm font-bold text-[#4A6741] mb-2">学习统计</h3>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-white/40 rounded-lg p-2 text-center">
              <div class="text-lg font-bold text-[#4A6741]">{{ courses.length }}</div>
              <div class="text-[10px] text-[#5C7A52]">课程总数</div>
            </div>
            <div class="bg-white/40 rounded-lg p-2 text-center">
              <div class="text-lg font-bold text-[#4A6741]">{{ totalProgress }}%</div>
              <div class="text-[10px] text-[#5C7A52]">总进度</div>
            </div>
          </div>
        </div>

        <div class="bg-[#A8C686]/60 backdrop-blur-xl rounded-xl p-3 border border-white/20">
          <h3 class="text-sm font-bold text-[#4A6741] mb-2">课程进度</h3>
          <div class="space-y-1.5">
            <div v-for="course in courses" :key="course.id" class="flex items-center gap-2">
              <div class="text-xs text-[#4A6741] w-16 truncate">{{ course.title }}</div>
              <div class="flex-1 bg-white/30 rounded-full h-2">
                <div class="bg-[#4A6741] h-2 rounded-full transition-all" :style="{ width: course.progress + '%' }"></div>
              </div>
              <div class="text-[10px] text-[#5C7A52] w-8 text-right">{{ course.progress }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>
