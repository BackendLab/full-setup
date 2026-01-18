// Enums for Business state

// User Status
export enum UserState {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  DELETED = "DELETED",
}

// Channel Status
export enum ChannelState {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

// Video Status
export enum VideoState {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
  DELETED = "DELETED",
}

// Playlist Status
export enum PlaylistState {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}
