import type { CourseContent, CourseProgress } from './types';
import { courseContents } from './courseData';

const STORAGE_KEY = 'jp-progress';
const DATA_VERSION = '1.0';

// 安全的 JSON 解析函数
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn('Failed to parse JSON, using fallback', e);
    return fallback;
  }
}

// 安全的 localStorage 访问
export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('Failed to get from localStorage', e);
    return null;
  }
}

export function safeLocalStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('Failed to set to localStorage', e);
  }
}

// 加载学习进度
export function loadCourseProgress(): CourseProgress {
  const saved = safeLocalStorageGet(STORAGE_KEY);
  if (!saved) return {};
  return safeJsonParse<CourseProgress>(saved, {});
}

// 保存学习进度
export function saveCourseProgress(progress: CourseProgress): void {
  safeLocalStorageSet(STORAGE_KEY, JSON.stringify(progress));
}

// 获取课程数量
export function getCourseCount(): number {
  return courseContents.length;
}

// 按索引获取单个课程内容（懒加载）
export function getCourseContent(index: number): CourseContent | null {
  if (index < 0 || index >= courseContents.length) {
    return null;
  }
  return courseContents[index];
}

// 获取所有课程的基本信息（不包含详细内容，减少内存使用）
export function getCourseList() {
  const progress = loadCourseProgress();
  return courseContents.map((content, index) => ({
    id: index,
    title: `第${index + 1}课`,
    description: content.examples[0]?.ja || '',
    progress: progress[index] || 0
  }));
}

// 更新单个课程进度
export function updateSingleProgress(courseId: number, progress: number): void {
  const currentProgress = loadCourseProgress();
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  currentProgress[courseId] = clampedProgress;
  saveCourseProgress(currentProgress);
}
