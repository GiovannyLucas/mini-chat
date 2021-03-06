import { Injectable } from '@nestjs/common';
import { User } from '../../shared/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from  '../../shared/dtos';
import { isUuid } from '../../shared/functions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    return await this.repo.save(this.repo.create(user))
  }

  async index(id: string): Promise<User> {
    return await this.repo.findOne(id)
  }

  async indexByNicknameOrID(nicknameOrID: string): Promise<User> {
    const caseNicknameOrID = `
      CASE
        WHEN (id::text = '${nicknameOrID}') THEN TRUE
        WHEN (nickname = '${nicknameOrID}') THEN TRUE
        ELSE id = '00000000-0000-0000-0000-000000000000'
      END
    `

    return await this.repo.findOne({ where: caseNicknameOrID })
  }
}