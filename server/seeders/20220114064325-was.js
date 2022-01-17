'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          sgid: 'u=34',
          email: 'tan@public.opinions.sg',
          fullname: 'Tan Ah Wee',
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
          id: 1,
          title:
            'Petition to Reverse the Decision to Close Down Yale-NUS and #NoMoreTopDown',
          summary:
            'I would like three days of rest. Work life balance is important.',
          reason:
            'NUS recently revealed the decision to merge the Faculty of Engineering (FoE) and the School of Design and Environment (SDE) to form the College of Design and Engineering (CDE), as well as merge the University Scholars Programme (USP) and Yale-NUS College (YNC) to form New College. Students from various faculties of NUS have drafted this petition to voice our concerns with the policy and its implications. \n\n We contend that these mergers are not isolated events but are part of NUS’ standard operating procedure for years, as evidenced by the merging of the Faculty of Arts and Social Sciences (FASS) and the Faculty of Science (FoS) to form the College of Humanities and Sciences (CHS). These three mergers directly impact six faculties – FoE, SDE, USP, YNC, FASS and FoS, which constitute over half of NUS’ student body.',
          request:
            'As our full petition outlines*, NUS has had a history of concentrating power over major decisions and its processes to its upper management, with minimal regard for the members of NUS whom it claims to serve. NUS claims that its values include “[considering] students’ perspectives and needs”, “[providing] support, motivation, and recognition to [its] students”, and “[exercising] accountability to [its] stakeholders, [upholding its] integrity and [endorsing] fair practice”. However, NUS’ decision to impose these mergers directly contradicts its own values and endangers the wellbeing of its students and staff.\n\nThis petition aims to hold NUS accountable for its own contradictions. The mergers are symptoms born from NUS’ lack of care for its student and staff bodies. Students and staff who have collaborated tirelessly on this petition are but a small reflection of the wider sentiments held by students across all NUS faculties.\n\nWe therefore demand #NoMoreTopDown approaches across the whole NUS. We call for the creation of policies based on the close participation and consent of students, staff, and representatives in common agreement and for their collective wellbeing.',
          userId: 1,
          references: 'wikipedia.com',
          status: 'OPEN',
          fullname: 'Tan Ah Wee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
          fullname: 'Tan Ah Wee',
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
          fullname: null,
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
