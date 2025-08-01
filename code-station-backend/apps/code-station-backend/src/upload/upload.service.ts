import { HttpException, Inject, Injectable, HttpStatus } from '@nestjs/common';
import { WINSTON_LOGGER_TOKEN } from '../winston/winston.module';
import { ConfigService } from '@nestjs/config';
import * as COS from 'cos-nodejs-sdk-v5';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  // 使用腾讯cos存储桶
  private readonly cos = new COS({});
  private readonly bucket: string = 'code-station-1306955988';
  private readonly region: string = 'ap-shanghai';
  private readonly baseParams: COS.PutObjectAclParams = {
    Bucket: this.bucket,
    Region: this.region,
    Key: '',
  };

  // 打印日志
  @Inject(WINSTON_LOGGER_TOKEN)
  private logger;

  async minioUpload(file: Express.Multer.File) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    const metaData = {
      'Content-Type': file.mimetype,
    };
    const params = Object.assign(this.baseParams, {
      Body: file.buffer,
      Key: uniqueSuffix,
    });
    try {
      const res = await this.cos.putObject(params);
      // 返回地址
      return `https://${res.Location}`;
    } catch (e) {
      this.logger.log(e, '上传图片报错');
      throw new HttpException(
        '图片上传失败，请稍后再试',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
