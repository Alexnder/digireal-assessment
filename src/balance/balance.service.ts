import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '../entities/user.entity';
import { TransactionHistory, TransactionAction } from '../entities/transaction-history.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TransactionHistory)
    private transactionRepository: Repository<TransactionHistory>,
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  private getCacheKey(userId: number): string {
    return `user_balance_${userId}`;
  }

  async getUserBalance(userId: number): Promise<{ userId: number; balance: number }> {
    const cacheKey = this.getCacheKey(userId);

    const cachedBalance = await this.cacheManager.get<number>(cacheKey);
    if (cachedBalance !== null && cachedBalance !== undefined) {
      return { userId, balance: cachedBalance };
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const balance = Number(user.balance);
    await this.cacheManager.set(cacheKey, balance, 60000);

    return { userId, balance };
  }

  async debitBalance(userId: number, amount: number): Promise<{
    userId: number;
    newBalance: number;
    transactionId: number;
  }> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager
        .createQueryBuilder(User, 'user')
        .setLock('pessimistic_write')
        .where('user.id = :userId', { userId })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (Number(user.balance) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const transaction = manager.create(TransactionHistory, {
        user_id: userId,
        action: TransactionAction.DEBIT,
        amount,
      });
      await manager.save(transaction);

      const result = await manager
        .createQueryBuilder(TransactionHistory, 'th')
        .select('SUM(CASE WHEN th.action = :credit THEN th.amount ELSE -th.amount END)', 'total')
        .where('th.user_id = :userId', { userId })
        .setParameters({ credit: TransactionAction.CREDIT })
        .getRawOne();

      const newBalance = Number(result.total) || 0;

      user.balance = newBalance;
      await manager.save(user);

      await this.cacheManager.del(this.getCacheKey(userId));

      return {
        userId,
        newBalance,
        transactionId: transaction.id,
      };
    });
  }

  async getTransactionHistory(userId: number): Promise<TransactionHistory[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.transactionRepository.find({
      where: { user_id: userId },
      order: { ts: 'DESC' },
    });
  }
}

