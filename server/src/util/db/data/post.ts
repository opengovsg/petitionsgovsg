import { PostStatus } from '~shared/types/base'

export const mockPost = {
  id: '395ac6ec-dea2-4f78-8dc4-1234cafaff87',
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
  signatureOptions: ['support', 'oppose'],
  createdAt: '2022-01-01T00:00:00+00:00',
  updatedAt: '2022-01-01T00:00:00+00:00',
}

export const mockPosts = [
  {
    id: 'af7b6aa9-7c6e-4ea5-b536-4e55bc506847',
    title: 'Basic petition without optional items',
    reason: 'reason for',
    request: 'request',
    status: PostStatus.Open,
    fullname: 'John Doe',
    salt: '$2b$10$72TKINiR4.ZMaJZmuN5tW.',
    hashedUserSgid:
      '$2b$10$72TKINiR4.ZMaJZmuN5tW.uCuGZcA0TzLUo4qly55GyDndAYG8BSW',
    email: 'John@email.com',
    addresseeId: 1,
    summary: null,
    references: null,
    profile: null,
    signatureOptions: ['support', 'oppose'],
    createdAt: '2022-01-01T00:00:00+00:00',
    updatedAt: '2022-01-01T00:00:00+00:00',
  },
  {
    id: 'aaaaaaaa-dea2-4f78-8dc4-5542cafaff87',
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
    signatureOptions: ['support', 'oppose'],
    createdAt: '2022-01-01T00:00:00+00:00',
    updatedAt: '2022-01-01T00:00:00+00:00',
  },
]
