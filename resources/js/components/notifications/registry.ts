import NotificationImportReport from './import-report'
import NotificationUserMention from './user-mention'

export const notificationRegistry = {
  'App\\Notifications\\ImportReportNotification': NotificationImportReport,
  'App\\Notifications\\UserMentionNotification': NotificationUserMention,
} as const