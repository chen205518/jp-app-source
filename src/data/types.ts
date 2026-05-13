export interface CourseContent {
  grammar: string;
  vocabulary: { ja: string; zh: string }[];
  examples: { ja: string; zh: string }[];
  explanation: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  content: CourseContent;
}

export interface CourseProgress {
  [courseId: number]: number;
}
