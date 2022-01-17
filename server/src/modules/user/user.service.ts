import { User } from '~shared/types/base'
import { ModelDef } from '../../types/sequelize'
import { LoadPublicUserDto } from '~shared/types/api'
export class UserService {
  private User: ModelDef<User>

  constructor({ User }: { User: ModelDef<User> }) {
    this.User = User
  }

  loadUser = async (userId: number): Promise<LoadPublicUserDto> => {
    return this.User.findByPk(userId) as Promise<LoadPublicUserDto>
  }

  loadFullUser = async (userId: number): Promise<User> => {
    return this.User.findByPk(userId) as Promise<User>
  }

  loadUserBySgid = async (sgid: string): Promise<LoadPublicUserDto> => {
    return this.User.findOne({ where: { sgid: sgid } })
  }
}
