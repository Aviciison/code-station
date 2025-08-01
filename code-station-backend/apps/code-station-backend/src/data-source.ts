import { DataSource } from 'typeorm';
import { Article } from './article/entities/article.entity';
import { webUser } from './user/entities/webUser.eneity';
import { User } from './user/entities/user.entity';
import { config } from 'dotenv';
import * as path from 'path';
import { DictTypeEntity } from './dict/entities/dict.type.entity';
import { DictDataEntity } from './dict/entities/dict.data.entity';
import { label } from './article/entities/label.entity';
import { articleExtra } from './article/entities/articleExtra.entity';
import { articleLike } from './article/entities/articleLike.entity';
import { articleCollect } from './article/entities/articleCollect.entity';

console.log(User);

// config({ path: path.join(__dirname, '.production.env') });
config({ path: 'src/.data_source.env' });

export default new DataSource({
  type: 'mysql',
  host: `${process.env.mysql_server_host}`,
  port: +`${process.env.mysql_server_port}`,
  username: `${process.env.mysql_server_username}`,
  password: `${process.env.mysql_server_password}`,
  database: `${process.env.mysql_server_database}`,
  synchronize: false,
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
  ],
  poolSize: 10,
  migrations: ['src/migrations/**.ts'],
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
});
