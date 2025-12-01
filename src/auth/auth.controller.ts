import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthService, AccountService } from './auth.service';
import { CreateAccountDto, UpdateAccountDto } from 'src/auth/dto/account.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('auth')
export class AuthController {
    constructor (
    private readonly authService:AuthService,
    private readonly accountService:AccountService){}

    @Post('login')
    async login(@Req() req:Request, @Res() res:Response){
        const email = req.body?.email
        const password = req.body?.password

        if (!email || !password) throw new UnauthorizedException('Missing email or password')
        
        const accessToken = await this.authService.authenticate(email, password)
        res.cookie('accessToken', accessToken)

        return res.send('Logged in')
    }

    @Get('logout')
    logout(@Res() res:Response){
        res.clearCookie('accessToken')
        return res.send('logged out')
    }

    @Post('signup')
    async signup(@Req() req:Request ){
        
        const newAccount:CreateAccountDto = plainToInstance(CreateAccountDto, req.body)
        
        let error:any = await validate(newAccount)
        if (error.length > 0) throw new BadRequestException('Required field(s) is missing')
        
        error = this.accountService.isExisted(newAccount.email)
        if (error.length > 0) throw new BadRequestException(error)

        return this.accountService.create(newAccount)    
    }
}


@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly configService: ConfigService) {}

  @Post()
  async create(@Body(ValidationPipe) createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.accountService.findOneById(id);
  }

  @Patch('id/:id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete('id/:id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.accountService.remove(id);
  }

  @Patch('id/:id/restore')
  restore(@Param('id', ParseObjectIdPipe) id:string){
    return this.accountService.restore(id)
  }
}

