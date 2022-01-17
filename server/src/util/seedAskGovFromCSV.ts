import sequelize, { Post, Signature, User } from '../bootstrap/sequelize'
import { PostStatus } from '~shared/types/base'

import neatCsv from 'neat-csv'
import { promises as fs } from 'fs'

// This is a script that will automate seeding AskGov DB from a CSV. It is aligned with what a user can do on a
// website, so it will not exceed 150 characters for title, or create tags if they do not exist yet.

// Prerequisites:
// User has permissions to add agencyTag and tags for all rows.

// Procedure:
// The CSV should have three columns titled 'topic', 'question', 'answer'. Other columns will
// be ignored. From each row, it will create a question and answer and link them to each other.
// Then it will link the agency and topic to the post.
// It will not alter agencies, tags, or users. Those have to be created first
// It will alter tables posts, answers.

// To run:
// Install ts-node if not done so, change directory to /util and run
// ts-node seedAskGovFromCSV.ts

// **********************************
// CHANGE THESE SETTINGS:
// User ID is id of user that creates the form
// Agency ID is the id of the agency that the user belongs to
const agencyId = 5
const user = { id: 4, agencyId }
const fileName = 'example_data.csv'
// **********************************

;(async () => {
  const csvString = await fs.readFile(fileName)
  const data = await neatCsv(csvString)

  await sequelize.transaction(async (t) => {
    // PRE-UPDATE CHECKS
    const userCount = await User.count()

    // UPDATE
    const processOneRow = async (question: string, signatureInput: string) => {
      // console.log('Creating: ', tagname, question, answer)

      // Create post
      // If title length exceeds 147 char, cut at 147 and add it to description
      let title = question
      let summary = ''
      if (title.length > 147) {
        title = question.slice(0, 147) + '...'
        summary = question
      }
      const post = await Post.create(
        {
          title: title,
          summary: summary,
          status: PostStatus.Open,
          userId: user.id,
        },
        { transaction: t },
      )

      // Create answer
      const signature = await Signature.create(
        {
          comment: signatureInput,
          userId: user.id,
          postId: post.id,
        },
        { transaction: t },
      )
    }

    // Run it for every row
    for (const row of data) {
      await processOneRow(row.question, row.signature)
    }

    // POST-UPDATE CHECKS
    if (userCount !== (await User.count())) throw new Error()
  })
})()
