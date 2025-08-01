import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidator, FileTypeValidationPipe } from './MyFileValidator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('img')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileSizeValidator({ maxSize: 200 * 1024 }),
          new FileTypeValidationPipe(['image/jpeg', 'image/png']),
        ],
        errorHttpStatusCode: 400,
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() body,
  ) {
    console.log(file, 'file');

    return await this.uploadService.minioUpload(file);
  }
}
