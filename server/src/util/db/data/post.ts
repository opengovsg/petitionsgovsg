import { PostStatus } from '~shared/types/base'

export const mockPost = {
  title: 'Basic petition without optional items',
  reason: 'reason for',
  request: 'request',
  status: PostStatus.Open,
  fullname: 'John Doe',
  salt: '$2b$10$72TKINiR4.ZMaJZmuN5tW.',
  hashedUserSgid: 'wxyz',
  email: 'John@email.com',
  addresseeId: 1,
  summary: null,
  references: null,
  profile: null,
}

export const mockPosts = [
  {
    id: 1,
    title: 'Basic petition without optional items',
    reason: 'reason for',
    request: 'request',
    status: PostStatus.Open,
    fullname: 'John Doe',
    salt: '$2b$10$72TKINiR4.ZMaJZmuN5tW.',
    hashedUserSgid: 'wxyz',
    email: 'John@email.com',
    addresseeId: 1,
    summary: null,
    references: null,
    profile: null,
  },
  {
    id: 2,
    title: 'Petition with summary, references, profile',
    reason: 'reason',
    request: 'request',
    status: PostStatus.Open,
    fullname: 'John Doe',
    salt: '$2b$10$72TKINiR4.ZMaJZmuN5tX.',
    hashedUserSgid: 'wxyz',
    email: 'John@email.com',
    addresseeId: 1,
    summary: 'petition summary',
    references: 'wikipedia.com',
    profile: 'OGP',
  },
]
