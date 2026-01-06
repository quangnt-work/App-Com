// src/lib/constants.ts

export const APP_CONFIG = {
  NAME: 'E-Learning Hub',
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    EXAM_PAGE_SIZE: 20,
  },
  UPLOAD: {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_DOC_TYPES: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'video/mp4'
    ],
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  STORAGE: {
    BUCKETS: {
      COURSE_MATERIALS: 'course-materials',
      COURSE_ASSETS: 'course-assets',
      LESSON_IMAGES: 'lesson-images',
    }
  },
  DATE_FORMAT: {
    VI: 'vi-VN', // Locale
    DEFAULT: { year: 'numeric', month: '2-digit', day: '2-digit' } as const
  }
};