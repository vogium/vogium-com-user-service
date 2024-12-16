export const COLLECTION_NAMES = {
  USERS_COLLECTION: 'users',
  USER_PREVIEWS_COLLECTION: 'userPreviews',
};

export const FIREBASE_ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  MULTIPLE_USERS: 'Multiple users found',
  UNAUTHORIZED: 'Unauthorized access',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
} as const;
