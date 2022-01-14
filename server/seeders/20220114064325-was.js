'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          sgid: 'u=34',
          displayname: 'Mr. Tan',
          fullname: 'Tan Ah Wee',
          email: 'tan@public.opinions.sg',
          createdAt: new Date(),
          updatedAt: new Date(),
          active: true,
        },
      ],
      {},
    )
    await queryInterface.bulkInsert(
      'posts',
      [
        {
          id: 2,
          title: 'Petition for 4 day work week',
          summary:
            'I would like three days of rest. Work life balance is important.',
          reason:
            '78% of people are happier and less stressed working a 4 day week. 64% of companies saw increased productivity with a 4 day week',
          request:
            'Petition for Ministry of Work Life Balance to enforce a 4 day work week.',
          userId: 1,
          references: 'wikipedia.com',
          status: 'OPEN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )
    await queryInterface.bulkInsert(
      'signatures',
      [
        {
          postId: 2,
          userId: 1,
          comment: 'I support this petition!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )

    await queryInterface.bulkInsert(
      'subscriptions',
      [{ createdAt: new Date(), updatedAt: new Date(), postId: 2, userId: 1 }],
      {},
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('subscriptions', null, {})
    await queryInterface.bulkDelete('signatures', null, {})
    await queryInterface.bulkDelete('posts', null, {})
    await queryInterface.bulkDelete('users', null, {})
  },
}
