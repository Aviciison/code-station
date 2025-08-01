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

export class removeDataDto {
  @IsNotEmpty({
    message: 'dictCode不能为空',
  })
  dictCode: number;
}
