import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'

import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { LineupModule } from './lineup/lineup.module';
import { RecruitModule } from './recruit/recruit.module';
import { PayrollModule } from './payroll/payroll.module';


@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
        dbName: configService.get<string>('DATABASE_NAME')
      }),
    }),
    AuthModule, EmployeeModule, LineupModule, RecruitModule, PayrollModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}



