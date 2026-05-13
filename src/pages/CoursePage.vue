<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import GojuonChart from '@/components/GojuonChart.vue'
import BottomNav from '@/components/BottomNav.vue'
import { getCourseList, getCourseContent, updateSingleProgress, loadCourseProgress } from '@/data/dataManager'
import type { CourseContent } from '@/data/types'

const flippedVocabulary = ref<Record<number, boolean>>({})
const flippedExamples = ref<Record<number, boolean>>({})
const courses = ref(getCourseList())
const selectedCourse = ref<{
  id: number
  title: string
  description: string
  progress: number
  content: CourseContent
} | null>(null)
const showDetail = ref(false)
const showGojuon = ref(false)

const toggleVocabulary = (index: number) => {
  flippedVocabulary.value[index] = !flippedVocabulary.value[index]
}

const toggleExample = (index: number) => {
  flippedExamples.value[index] = !flippedExamples.value[index]
}

const refreshCourseList = () => {
  courses.value = getCourseList()
}

const openCourse = (courseId: number) => {
  const content = getCourseContent(courseId)
  if (!content) return
  
  const courseInfo = courses.value.find(c => c.id === courseId)
  if (!courseInfo) return
  
  selectedCourse.value = {
    ...courseInfo,
    content
  }
  showDetail.value = true
  flippedVocabulary.value = {}
  flippedExamples.value = {}
}

const closeDetail = () => {
  showDetail.value = false
  selectedCourse.value = null
  flippedVocabulary.value = {}
  flippedExamples.value = {}
  refreshCourseList()
}

const openGojuon = () => {
  showGojuon.value = true
}

const closeGojuon = () => {
  showGojuon.value = false
}

const updateProgress = (courseId: number, newProgress: number) => {
  updateSingleProgress(courseId, newProgress)
  if (selectedCourse.value && selectedCourse.value.id === courseId) {
    selectedCourse.value.progress = Math.max(0, Math.min(100, Math.round(newProgress)))
  }
  refreshCourseList()
}

const handleProgressClick = (event: MouseEvent, courseId: number) => {
  event.stopPropagation()
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const percentage = ((event.clientX - rect.left) / rect.width) * 100
  updateProgress(courseId, percentage)
}

const scrollContainer = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const detailScrollContainer = ref<HTMLElement | null>(null)
const detailScrollProgress = ref(0)
const detailProgressRef = ref<HTMLElement | null>(null)

const handleScroll = () => {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  scrollProgress.value = el.scrollHeight > el.clientHeight ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0
}

const handleDetailScroll = () => {
  if (!detailScrollContainer.value) return
  const el = detailScrollContainer.value
  detailScrollProgress.value = el.scrollHeight > el.clientHeight ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0
}

const handleDetailProgressClick = (event: MouseEvent) => {
  if (!selectedCourse.value) return
  const rect = detailProgressRef.value?.getBoundingClientRect()
  if (!rect) return
  const percentage = Math.max(0, Math.min(100, Math.round(((event.clientX - rect.left) / rect.width) * 100)))
  updateProgress(selectedCourse.value.id, percentage)
}

let isDragging = false

const handleDetailProgressTouchMove = (event: TouchEvent) => {
  if (!isDragging || !selectedCourse.value) return
  event.preventDefault()
  const touch = event.touches[0]
  const rect = detailProgressRef.value?.getBoundingClientRect()
  if (!rect) return
  const percentage = Math.max(0, Math.min(100, Math.round(((touch.clientX - rect.left) / rect.width) * 100)))
  updateProgress(selectedCourse.value.id, percentage)
}

const startDetailProgressTouch = (event: TouchEvent) => {
  isDragging = true
  const touch = event.touches[0]
  const rect = detailProgressRef.value?.getBoundingClientRect()
  if (!rect || !selectedCourse.value) return
  const percentage = Math.max(0, Math.min(100, Math.round(((touch.clientX - rect.left) / rect.width) * 100)))
  updateProgress(selectedCourse.value.id, percentage)
}

const handleDetailProgressDrag = (event: MouseEvent) => {
  if (!isDragging || !selectedCourse.value) return
  const rect = detailProgressRef.value?.getBoundingClientRect()
  if (!rect) return
  const percentage = Math.max(0, Math.min(100, Math.round(((event.clientX - rect.left) / rect.width) * 100)))
  updateProgress(selectedCourse.value.id, percentage)
}

const startDetailProgressDrag = (event: MouseEvent) => {
  isDragging = true
  handleDetailProgressClick(event)
}

const endDetailProgressDrag = () => {
  isDragging = false
}

onMounted(() => {
  scrollContainer.value?.addEventListener('scroll', handleScroll)
  detailScrollContainer.value?.addEventListener('scroll', handleDetailScroll)
  handleScroll()
  handleDetailScroll()
  document.addEventListener('mousemove', handleDetailProgressDrag)
  document.addEventListener('mouseup', endDetailProgressDrag)
  document.addEventListener('touchmove', handleDetailProgressTouchMove, { passive: false })
  document.addEventListener('touchend', endDetailProgressDrag)
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', handleScroll)
  detailScrollContainer.value?.removeEventListener('scroll', handleDetailScroll)
  document.removeEventListener('mousemove', handleDetailProgressDrag)
  document.removeEventListener('mouseup', endDetailProgressDrag)
  document.removeEventListener('touchmove', handleDetailProgressTouchMove)
  document.removeEventListener('touchend', endDetailProgressDrag)
})
</script>

<template>
  <div class="min-h-dvh bg-[#7BA05B] flex flex-col" :style="{ paddingBottom: `env(safe-area-inset-bottom, 0px)` }">
    <h1 class="text-lg font-bold text-white mt-2 mb-1 text-center shrink-0">课程</h1>

    <div ref="scrollContainer" class="flex-1 overflow-y-auto px-3 pb-24" @scroll="handleScroll">
      <div class="flex flex-col items-center gap-2 py-1">
        <div
          v-for="course in courses"
          :key="course.id"
          class="w-full max-w-[300px] bg-[#A8C686]/60 backdrop-blur-xl rounded-xl p-3 border border-white/20 cursor-pointer"
          @click="openCourse(course.id)"
        >
          <div class="text-base font-bold text-[#4A6741] mb-1">{{ course.title }}</div>
          <div class="text-xs text-[#5C7A52] mb-2">{{ course.description }}</div>
          <div 
            class="w-full bg-white/30 rounded-full h-2.5 relative"
            @click="handleProgressClick($event, course.id)"
          >
            <div
              class="bg-[#4A6741] h-2.5 rounded-full transition-all"
              :style="{ width: course.progress + '%' }"
            ></div>
          </div>
          <div class="text-[10px] text-[#5C7A52] mt-1 text-right">{{ course.progress }}%</div>
        </div>
      </div>
    </div>

    <div class="fixed right-2 top-1/2 -translate-y-1/2 w-1.5">
      <div class="w-1 bg-white/30 rounded-full h-32 relative">
        <div class="absolute top-0 left-0 w-full bg-white/80 rounded-full transition-all" :style="{ height: scrollProgress + '%' }"></div>
      </div>
    </div>

    <BottomNav />

    <div v-if="showDetail && selectedCourse" class="fixed inset-0 bg-[#7BA05B] z-50 flex flex-col">
      <div class="flex items-center justify-between px-4 py-3 bg-[#7BA05B]/80 border-b border-white/20">
        <button @click="closeDetail" class="flex items-center gap-2 text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>返回</span>
        </button>
        <h2 class="text-lg font-bold text-white">{{ selectedCourse.title }}</h2>
        <div class="w-16"></div>
      </div>

      <div ref="detailScrollContainer" class="flex-1 overflow-y-auto px-3 py-3 pb-20" @scroll="handleDetailScroll">
        <div class="max-w-[360px] mx-auto space-y-3">
          <div class="bg-[#6D5D4D]/80 rounded-xl p-2.5 mx-4 cursor-pointer hover:bg-[#6D5D4D]/90 transition-all" @click="openGojuon">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-[#F5F5DC] text-sm">五十音图</h3>
                <p class="text-[#F5F5DC]/70 text-[10px]">查看平假名和片假名</p>
              </div>
              <svg class="w-5 h-5 text-[#F5F5DC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <div class="bg-[#A8C686]/60 rounded-xl p-3">
            <h3 class="font-bold text-[#4A6741] mb-1 text-sm">核心语法</h3>
            <p class="text-lg font-bold text-[#4A6741]">{{ selectedCourse.content.grammar }}</p>
          </div>
          
          <div class="bg-[#A8C686]/60 rounded-xl p-3">
            <h3 class="font-bold text-[#4A6741] mb-1 text-sm">语法说明</h3>
            <p class="text-xs text-[#5C7A52]">{{ selectedCourse.content.explanation }}</p>
          </div>
          
          <div class="bg-[#A8C686]/60 rounded-xl p-3">
            <h3 class="font-bold text-[#4A6741] mb-2 text-sm">重点词汇</h3>
            <div class="grid grid-cols-2 gap-1.5">
              <div 
                v-for="(word, index) in selectedCourse.content.vocabulary" 
                :key="index"
                class="flip-card h-20"
                @click="toggleVocabulary(index)"
              >
                <div class="flip-card-inner" :class="{ 'flipped': flippedVocabulary[index] }">
                  <div class="flip-card-front bg-white/40 rounded-lg flex items-center justify-center text-xs font-bold text-[#4A6741]">
                    {{ word.ja }}
                  </div>
                  <div class="flip-card-back bg-[#4A6741]/80 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                    {{ word.zh }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-[#A8C686]/60 rounded-xl p-3">
            <h3 class="font-bold text-[#4A6741] mb-2 text-sm">例句</h3>
            <div class="space-y-1.5">
              <div 
                v-for="(example, index) in selectedCourse.content.examples" 
                :key="index"
                class="flip-card h-28"
                @click="toggleExample(index)"
              >
                <div class="flip-card-inner" :class="{ 'flipped': flippedExamples[index] }">
                  <div class="flip-card-front bg-white/40 rounded-lg p-3 flex items-center justify-center">
                    <p class="text-base font-bold text-[#4A6741] text-center">{{ example.ja }}</p>
                  </div>
                  <div class="flip-card-back bg-[#4A6741]/80 rounded-lg p-3 flex items-center justify-center">
                    <p class="text-base font-bold text-white text-center">{{ example.zh }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-[#A8C686]/60 rounded-xl p-3">
            <h3 class="font-bold text-[#4A6741] mb-1 text-sm">学习进度</h3>
            <div 
              ref="detailProgressRef"
              class="w-full bg-white/30 rounded-full h-6 relative cursor-pointer hover:bg-white/40 transition-all touch-manipulation"
              @mousedown="startDetailProgressDrag"
              @click="handleDetailProgressClick"
              @touchstart="startDetailProgressTouch"
            >
              <div class="bg-[#4A6741] h-6 rounded-full transition-all" :style="{ width: selectedCourse.progress + '%' }"></div>
              <div 
                class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-[#4A6741] flex items-center justify-center transition-transform active:scale-110"
                :style="{ left: Math.min(selectedCourse.progress, 98) + '%', transform: 'translateX(-50%)' }"
              >
                <svg class="w-2.5 h-2.5 text-[#4A6741]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"></path>
                </svg>
              </div>
            </div>
            <p class="text-[#5C7A52] mt-1 text-right text-base font-bold">{{ selectedCourse.progress }}%</p>
          </div>
        </div>
      </div>

      <div class="fixed right-2 top-1/2 -translate-y-1/2 w-1.5 z-[55]">
        <div class="w-1 bg-white/30 rounded-full h-32 relative">
          <div class="absolute top-0 left-0 w-full bg-white/80 rounded-full transition-all" :style="{ height: detailScrollProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="showGojuon" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-2" @click="closeGojuon">
      <div class="bg-[#7BA05B] rounded-xl shadow-lg w-full max-w-[360px] max-h-[85vh] overflow-hidden" @click.stop>
        <div class="flex items-center justify-between px-3 py-2 bg-[#7BA05B]/80 border-b border-white/20">
          <h2 class="text-base font-bold text-white">五十音图</h2>
          <button @click="closeGojuon" class="w-7 h-7 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white text-sm transition-all">
            ✕
          </button>
        </div>
        <div class="h-[60vh] overflow-y-auto p-2">
          <GojuonChart />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.flip-card-front {
  background-color: rgba(255, 255, 255, 0.4);
}

.flip-card-back {
  background-color: rgba(74, 103, 65, 0.8);
  transform: rotateY(180deg);
}
</style>
