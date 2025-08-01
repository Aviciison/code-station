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

export class addDictTypeDto {
  @IsNotEmpty({
    message: '字典名称不能为空',
  })
  dictName: string;

  @IsNotEmpty({
    message: '字典类型不能为空',
  })
  dictType: string;
}
