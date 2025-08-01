import { PartialType } from '@nestjs/mapped-types';
import { addPermissionDto } from './add-permission.dto';

export class UpdatePermissionDto extends PartialType(addPermissionDto) {}
