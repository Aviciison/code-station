import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  Length,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class findTypeDictDto {
  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsNotEmpty()
  @IsNumber()
  pageNo: number;

  @IsOptional()
  dictName: string;

  @IsOptional()
  dictType: string;
}
