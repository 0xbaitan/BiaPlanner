import { ParseFilePipeBuilder } from '@nestjs/common';

export const ImageFileValidationPipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /\/(jpg|jpeg|png|gif|avif)$/,
  })
  .addMaxSizeValidator({
    maxSize: 1024 * 1024, // 1MB
    message: 'File size must be less than 1MB',
  })
  .build({
    fileIsRequired: false, // Allow the file to be optional
  });
