import express from 'express'
import passport from 'passport'
import { User } from '../../models'
import { ModelCtor } from 'sequelize'
import { sgidStrategy } from './sgid.strategy'
import { AuthUserDto } from '~shared/types/api'

const privateKeyPem = (process.env.SGID_PRIV_KEY ?? '').replace(/\\n/g, '\n')

export const passportConfig = (
  app: express.Application,
  User: ModelCtor<User>,
): void => {
  sgidStrategy(User, privateKeyPem)
  app.use(passport.initialize())
  app.use(passport.session())

  // stores user to session
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  // retrieves user from session
  passport.deserializeUser((user: AuthUserDto, done) => {
    done(null, user)
  })
}
