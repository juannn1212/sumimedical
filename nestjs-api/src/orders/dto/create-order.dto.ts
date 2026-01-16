import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  order_number: string;

  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
