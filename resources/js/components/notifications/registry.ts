import NotificationImportReport from './import-report'
import NotificationPostLiked from './post-liked'
import NotificationSurveySubmitted from './survey-submitted'
import NotificationUserMention from './user-mention'

export const notificationRegistry = {
  'App\\Notifications\\ImportReportNotification': NotificationImportReport,
  'App\\Notifications\\PostLikedNotification': NotificationPostLiked,
  'App\\Notifications\\EmploymentSurveySubmittedNotification': NotificationSurveySubmitted,
  'App\\Notifications\\UserMentionNotification': NotificationUserMention,
} as const
