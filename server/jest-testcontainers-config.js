/* eslint-disable */
module.exports = {
  postgres: {
    image: 'postgres',
    tag: '11-alpine',
    ports: [5432],
    env: {
      POSTGRES_USER: 'test_user',
      POSTGRES_PASSWORD: 'test_password',
    },
    wait: {
      type: 'text',
      text: 'server started',
    },
  },
}
