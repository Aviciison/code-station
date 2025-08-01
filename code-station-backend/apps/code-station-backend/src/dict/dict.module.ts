import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictDataEntity } from './entities/dict.data.entity';
import { DictTypeEntity } from './entities/dict.type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictDataEntity, DictTypeEntity])],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
