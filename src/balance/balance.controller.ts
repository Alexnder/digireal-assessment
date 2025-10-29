import { Controller, Get, Post, Body, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DebitBalanceDto } from './dto/debit-balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':userId')
  async getBalance(@Param('userId', ParseIntPipe) userId: number) {
    return this.balanceService.getUserBalance(userId);
  }

  @Post(':userId/debit')
  async debitBalance(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) debitDto: DebitBalanceDto,
  ) {
    return this.balanceService.debitBalance(userId, debitDto.amount);
  }

  @Get(':userId/history')
  async getHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.balanceService.getTransactionHistory(userId);
  }
}

