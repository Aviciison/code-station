import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuMenagerDto } from './create-menu-menager.dto';

export class UpdateMenuMenagerDto extends PartialType(CreateMenuMenagerDto) {}
