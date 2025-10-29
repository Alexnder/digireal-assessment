import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { User } from '../entities/user.entity';
import { TransactionHistory } from '../entities/transaction-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TransactionHistory])],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}

