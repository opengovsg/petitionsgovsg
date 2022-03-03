'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'addressees',
      [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Communications and Information',
          shortName: 'MCI',
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Culture, Community and Youth',
          shortName: 'MCCY',
        },
        {
          id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Defence',
          shortName: 'MINDEF',
        },
        {
          id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Education',
          shortName: 'MOE',
        },
        {
          id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Finance',
          shortName: 'MOF',
        },
        {
          id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Foreign Affairs',
          shortName: 'MFA',
        },
        {
          id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Health',
          shortName: 'MOH',
        },
        {
          id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Home Affairs',
          shortName: 'MHA',
        },
        {
          id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Law',
          shortName: 'MINLAW',
        },
        {
          id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Manpower',
          shortName: 'MOM',
        },
        {
          id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of National Development',
          shortName: 'MND',
        },
        {
          id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Social and Family Development',
          shortName: 'MSF',
        },
        {
          id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Sustainability and the Environment',
          shortName: 'MSE',
        },
        {
          id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Trade and Industry',
          shortName: 'MTI',
        },
        {
          id: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Ministry of Transport',
          shortName: 'MOT',
        },
        {
          id: 16,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: "Prime Minister's Office",
          shortName: 'PMO',
        },
        {
          id: 17,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'General',
          shortName: 'General',
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
          hashedUserSgid: '1',
          references: 'wikipedia.com',
          status: 'OPEN',
          fullname: 'Tan Ah Wee',
          createdAt: new Date(),
          updatedAt: new Date(),
          salt: '$2b$10$/CLHEWPCyDlPV.fKamXZ4u',
          addresseeId: 1,
          profile: 'OGP',
          email: 'tanahwee@petitions.gov.sg',
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
          hashedUserSgid: '1',
          references: 'wikipedia.com',
          status: 'OPEN',
          fullname: 'Tan Ah Wee',
          createdAt: new Date(),
          updatedAt: new Date(),
          salt: '$2b$10$6fmiowNimP6XWg4siTzYVO',
          addresseeId: 1,
          profile: 'OGP',
          email: 'tanahwee@petitions.gov.sg',
        },
      ],
      {},
    )
    await queryInterface.bulkInsert(
      'signatures',
      [
        {
          postId: 2,
          hashedUserSgid: '1',
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
      [
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          postId: 2,
          email: 'tanahwee@petitions.gov.sg',
        },
      ],
      {},
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('subscriptions', null, {})
    await queryInterface.bulkDelete('signatures', null, {})
    await queryInterface.bulkDelete('posts', null, {})
    await queryInterface.bulkDelete('addressees', null, {})
  },
}
