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

export class addDictDataDto {
  @IsNotEmpty({
    message: '字典类型编码不能为空',
  })
  dictType: string;

  @IsNotEmpty({
    message: '字典标签不能为空',
  })
  label: string;

  @IsNotEmpty({
    message: '字典键值不能为空',
  })
  value: string;
}
