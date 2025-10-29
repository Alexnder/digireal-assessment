import { IsNumber, IsPositive, Min } from 'class-validator';

export class DebitBalanceDto {
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;
}

