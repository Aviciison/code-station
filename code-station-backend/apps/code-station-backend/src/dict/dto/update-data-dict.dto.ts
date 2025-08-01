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

export class updateDateDto {
  @IsNotEmpty({
    message: 'dictCode不能为空',
  })
  dictCode: number;

  @IsOptional()
  label: string;

  @IsOptional()
  value: string;
}
