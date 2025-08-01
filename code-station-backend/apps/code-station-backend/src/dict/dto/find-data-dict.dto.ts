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

export class findAllDataDto {
  @IsNotEmpty({
    message: '字典类型不能为空',
  })
  dictType: string;
}
