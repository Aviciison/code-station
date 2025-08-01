/*
 * @Author: zwz
 * @Date: 2024-03-27 16:24:18
 * @LastEditors: zwz
 * @LastEditTime: 2024-03-28 15:53:47
 * @Description: 请填写简介
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModules } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { LoginGuard } from '@app/common';
import { User } from './user/entities/user.entity';
import { webUser } from './user/entities/webUser.eneity';
import { UserModule } from './user/user.module';
import { WinstonModule } from './winston/winston.module';
import { transports, format } from 'winston';
import { UploadModule } from './upload/upload.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { DictModule } from './dict/dict.module';
import 'winston-daily-rotate-file';
import * as chalk from 'chalk';
import * as path from 'path';
import { DictTypeEntity } from './dict/entities/dict.type.entity';
import { DictDataEntity } from './dict/entities/dict.data.entity';
import { label } from './article/entities/label.entity';
import { RedisModule } from './redis/redis.module';
import { articleExtra } from './article/entities/articleExtra.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { articleLike } from './article/entities/articleLike.entity';
import { articleCollect } from './article/entities/articleCollect.entity';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { webUserPermission } from './permission/entities/permission.entity';
import { Role } from './role/entities/role.entity';
import { roleUserRelation } from './user/entities/role_user_relation.entity';
import { rolePermissionRelation } from './role/entities/role_permission_relation.entity';
import { MenuMenagerModule } from './menu-menager/menu-menager.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 定时任务
    JwtModules,
    // JwtModule.registerAsync({
    //   global: true,
    //   useFactory(configService: ConfigService) {
    //     return {
    //       secret: configService.get('jwt_secret'),
    //       signOptions: {
    //         expiresIn: '30m', // 默认 30 分钟
    //       },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.RUNNING_ENV === 'dev'
          ? '.env'
          : path.join(__dirname, '.production.env'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: process.env.RUNNING_ENV === 'dev' ? true : false,
          logging: true,
          entities: [
            User,
            webUser,
            Article,
            DictTypeEntity,
            DictDataEntity,
            label,
            articleExtra,
            articleLike,
            articleCollect,
            webUserPermission,
            Role,
            roleUserRelation,
            rolePermissionRelation,
          ],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    ArticleModule,
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST]`);
              const contextStr = chalk.yellow(`[${context}]`);

              return `${appStr} ${time} ${level} ${contextStr} ${message} `;
            }),
          ),
        }),
        new transports.DailyRotateFile({
          format: format.combine(format.timestamp(), format.json()),
          dirname: 'log',
          filename: 'code-station-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
        }),
        // new transports.File({
        //   format: format.combine(format.timestamp(), format.json()),
        //   filename: 'code_station.log',
        //   dirname: 'log',
        // }),
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 窗口时间（秒）
        limit: 10, // 在窗口内允许最大请求数
      },
    ]),
    UploadModule,
    DictModule,
    RedisModule,
    TaskModule,
    RoleModule,
    PermissionModule,
    MenuMenagerModule,
    // ClientsModule.register([
    //   {
    //     name: 'CHAT_ROOM_SERVICE',
    //     transport: Transport.TCP,
    //     options: {
    //       port: 8888,
    //     },
    //   },
    // ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
