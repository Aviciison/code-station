import { FileValidator } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileSizeValidator extends FileValidator {
  static options = 0;
  constructor(options) {
    FileSizeValidator.options = options.maxSize;

    super(options);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    // 5 * 1024 * 1024
    console.log(file.size, '大小');

    if (file.size > FileSizeValidator.options) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `文件 ${file.originalname} 大小超出 200k`;
  }
}

export class FileTypeValidationPipe extends FileValidator {
  static allowedTypes: string[];
  constructor(allowedTypes: string[]) {
    FileTypeValidationPipe.allowedTypes = allowedTypes;
    super(allowedTypes);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    if (!FileTypeValidationPipe.allowedTypes.includes(file.mimetype)) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `文件 ${file.originalname} 格式错误，请重新上传`;
  }
}
