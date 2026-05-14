<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const hiraganaData = [
  { row: ['あ', 'い', 'う', 'え', 'お'], romanji: ['a', 'i', 'u', 'e', 'o'] },
  { row: ['か', 'き', 'く', 'け', 'こ'], romanji: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { row: ['さ', 'し', 'す', 'せ', 'そ'], romanji: ['sa', 'shi', 'su', 'se', 'so'] },
  { row: ['た', 'ち', 'つ', 'て', 'と'], romanji: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { row: ['な', 'に', 'ぬ', 'ね', 'の'], romanji: ['na', 'ni', 'nu', 'ne', 'no'] },
  { row: ['は', 'ひ', 'ふ', 'へ', 'ほ'], romanji: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { row: ['ま', 'み', 'む', 'め', 'も'], romanji: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { row: ['や', '', 'ゆ', '', 'よ'], romanji: ['ya', '', 'yu', '', 'yo'] },
  { row: ['ら', 'り', 'る', 'れ', 'ろ'], romanji: ['ra', 'ri', 'ru', 're', 'ro'] },
  { row: ['わ', '', '', '', 'を'], romanji: ['wa', '', '', '', 'wo'] },
]

const katakanaData = [
  { row: ['ア', 'イ', 'ウ', 'エ', 'オ'], romanji: ['a', 'i', 'u', 'e', 'o'] },
  { row: ['カ', 'キ', 'ク', 'ケ', 'コ'], romanji: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { row: ['サ', 'シ', 'ス', 'セ', 'ソ'], romanji: ['sa', 'shi', 'su', 'se', 'so'] },
  { row: ['タ', 'チ', 'ツ', 'テ', 'ト'], romanji: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { row: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'], romanji: ['na', 'ni', 'nu', 'ne', 'no'] },
  { row: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'], romanji: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { row: ['マ', 'ミ', 'ム', 'メ', 'モ'], romanji: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { row: ['ヤ', '', 'ユ', '', 'ヨ'], romanji: ['ya', '', 'yu', '', 'yo'] },
  { row: ['ラ', 'リ', 'ル', 'レ', 'ロ'], romanji: ['ra', 'ri', 'ru', 're', 'ro'] },
  { row: ['ワ', '', '', '', 'ヲ'], romanji: ['wa', '', '', '', 'wo'] },
]

const selectedChar = ref<{ hiragana: string; katakana: string; romanji: string } | null>({ hiragana: 'あ', katakana: 'ア', romanji: 'a' })
const isSpeaking = ref(false)
let currentAudio: HTMLAudioElement | null = null
const audioCache = new Map<string, HTMLAudioElement>()
let preloadTimer: ReturnType<typeof setTimeout> | null = null

const getAudioPath = (char: string) => {
  const isHiragana = /[\u3040-\u309F]/.test(char)
  const encoded = encodeURIComponent(char)
  return isHiragana
    ? `/audio/hiragana/${encoded}.mp3`
    : `/audio/katakana/${encoded}.mp3`
}

const preloadAudio = () => {
  const allChars = new Set<string>()
  for (const item of hiraganaData) {
    for (const char of item.row) {
      if (char) allChars.add(char)
    }
  }
  for (const item of katakanaData) {
    for (const char of item.row) {
      if (char) allChars.add(char)
    }
  }

  const chars = Array.from(allChars)
  let index = 0

  const loadNext = () => {
    if (index >= chars.length) return
    const char = chars[index]
    if (!audioCache.has(char)) {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.src = getAudioPath(char)
      audio.load()
      audioCache.set(char, audio)
    }
    index++
    preloadTimer = setTimeout(loadNext, 30)
  }

  loadNext()
}

onMounted(() => {
  preloadTimer = setTimeout(preloadAudio, 100)
})

onUnmounted(() => {
  if (preloadTimer) clearTimeout(preloadTimer)
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  audioCache.clear()
})

const selectChar = (hiragana: string, katakana: string, romanji: string) => {
  if (hiragana || katakana) {
    selectedChar.value = { hiragana, katakana, romanji }
  }
}

const handleCharClick = (hiragana: string, katakana: string, romanji: string) => {
  selectChar(hiragana, katakana, romanji)
  const textToSpeak = hiragana || katakana
  if (textToSpeak) {
    speakJapanese(textToSpeak)
  }
}

const speakJapanese = (text: string) => {
  if (!text) return

  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
  }

  isSpeaking.value = true

  let audio = audioCache.get(text)
  if (!audio) {
    audio = new Audio(getAudioPath(text))
    audio.preload = 'auto'
    audioCache.set(text, audio)
  }

  audio.currentTime = 0
  currentAudio = audio

  audio.onended = () => {
    isSpeaking.value = false
    currentAudio = null
  }

  audio.onerror = () => {
    isSpeaking.value = false
    currentAudio = null
  }

  audio.play().catch(() => {
    isSpeaking.value = false
    currentAudio = null
  })
}
</script>

<template>
  <div class="flex flex-col gap-y-2 px-1">
    <div class="flex items-start justify-center">
      <div class="bg-[#A8C686]/60 backdrop-blur-xl rounded-xl shadow-lg p-2 w-full max-w-[340px] border border-white/20 self-center">
        <div class="grid grid-cols-5 gap-1.5">
          <template v-for="(item, rowIndex) in hiraganaData" :key="rowIndex">
            <div
              v-for="(char, colIndex) in item.row"
              :key="`${rowIndex}-${colIndex}`"
              @click="handleCharClick(char, katakanaData[rowIndex].row[colIndex], item.romanji[colIndex])"
              :class="[
                'aspect-square rounded-md flex flex-col items-center justify-center transition-all duration-200 cursor-pointer border border-white/30 backdrop-blur-md relative',
                char || katakanaData[rowIndex].row[colIndex]
                  ? 'bg-[#C5D99A]/40 hover:bg-[#D4E7B0]/50 hover:border-white/40 hover:shadow-lg active:scale-95'
                  : 'bg-[#8FB36D]/25 cursor-default'
              ]"
            >
              <div
                v-if="(char || katakanaData[rowIndex].row[colIndex]) && isSpeaking && (
                  (selectedChar?.hiragana === char && selectedChar?.katakana === katakanaData[rowIndex].row[colIndex]) ||
                  (!char && selectedChar?.katakana === katakanaData[rowIndex].row[colIndex]) ||
                  (!katakanaData[rowIndex].row[colIndex] && selectedChar?.hiragana === char)
                )"
                class="absolute inset-0 bg-[#4A6741]/30 flex items-center justify-center animate-pulse rounded-md"
              >
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
                </svg>
              </div>
              <span v-if="char || katakanaData[rowIndex].row[colIndex]" class="text-[12px] font-bold text-[#4A6741] leading-tight">
                {{ char }}<span v-if="char && katakanaData[rowIndex].row[colIndex]" class="text-[9px]">/</span>{{ katakanaData[rowIndex].row[colIndex] }}
              </span>
              <span v-if="char || katakanaData[rowIndex].row[colIndex]" class="text-[8px] text-[#5C7A52] leading-none mt-0.5">{{ item.romanji[colIndex] }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center">
      <div class="bg-[#6D5D4D]/80 backdrop-blur-xl rounded-xl shadow-lg p-1.5 text-center border border-white/20 w-[min(65%,_230px)]">
        <div class="text-sm font-bold text-[#F5F5DC] mb-0.5">
          {{ selectedChar?.hiragana || selectedChar?.katakana }}
        </div>
        <div class="text-[7px] text-[#F5F5DC]/80 mb-0.5">
          {{ selectedChar?.hiragana || '—' }} / {{ selectedChar?.katakana || '—' }}
        </div>
        <div class="text-[10px] text-[#F5F5DC] mb-1">{{ selectedChar?.romanji }}</div>
        <button
          @click="speakJapanese(selectedChar?.hiragana || selectedChar?.katakana || '')"
          :disabled="!selectedChar || isSpeaking"
          class="w-full bg-[#4A6741] hover:bg-[#3A5731] disabled:bg-[#4A6741]/50 text-white rounded-lg py-1.5 px-2 flex items-center justify-center gap-1 transition-all active:scale-95 text-[10px]"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"></path>
          </svg>
          <span>{{ isSpeaking ? '发音中...' : '点击发音' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
