import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';

import { Account } from './schema/account.schema';

@Injectable()
export class AccountService {

  constructor(@InjectModel('Account') private readonly accountModel:Model<Account>) {}  

  create(createAccountDto: CreateAccountDto) {    
    const created = new this.accountModel(createAccountDto);
    created.password = bcrypt.hashSync(createAccountDto.password, 10)
    return created.save();
  }

  findAll() {
    return this.accountModel.find();
  }

  findOneById(id: string) {
    return this.accountModel.findById(id);
  }

  findOneByEmail(email: string) {
    return this.accountModel.findOne({email: email});
  }

  async isExisted(email:any):Promise<null | string>{
    if (await this.findOneByEmail(email)) return 'Email is used'
      
    return null
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return this.accountModel.updateOne({_id: id}, updateAccountDto);
  }

  remove(id: string) {
    return this.accountModel.updateOne({_id: id}, {isDeleted: true});
  }
  
  restore(id: string){
    return this.accountModel.updateOne({_id: id}, {isDeleted: false});
  }
  
}


@Injectable()
export class AuthService {    
    constructor(
        private readonly accountService: AccountService,
        private readonly JwtService:JwtService,
        private readonly ConfigService:ConfigService,
    ) {}

    // Login
    async authenticate(email:string, password:string){
        const target = await this.accountService.findOneByEmail(email)

        if (!target) throw new NotFoundException('Account not found')
        
        const isMatched = bcrypt.compareSync(password, target.password)
        if (!isMatched) throw new UnauthorizedException('Wrong password')

        const isDeleted = target.isDeleted
        
        if (isDeleted) throw new ForbiddenException('Account is not activated')

        const payload = { sub: target._id, email: target.email };

        return this.JwtService.signAsync(payload, {secret: this.ConfigService.get<string>('MYSECRET')})
    }

    async verifyToken(token:any){
        const verified = this.JwtService.verifyAsync(token, {secret: this.ConfigService.get<string>('MYSECRET')})
        if (!verified) throw new UnauthorizedException('Token is not accepted')

        return verified
    }

    //Sign up
    async signup(payload:any){
        const email = payload.email

        this.accountService.isExisted(email)

        this.accountService.create(payload)
    }

}