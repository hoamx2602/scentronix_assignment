export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export enum UrlStatus {
  ONLINE = 'online',
  WARNING = 'warning',
  OFFLINE = 'offline',
}

export enum AlertMethodTypes {
  SMS = 'sms',
  GOOGLE_CHAT = 'google_chat',
  SLACK = 'slack',
  EMAIL = 'email',
}

export enum AlertHistoryStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}
