import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

const ALLOWED_MIME_TYPES: Record<FileType, string[]> = {
  [FileType.AUDIO]: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  [FileType.IMAGE]: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

const MIME_TO_EXT: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/mp4': 'mp4',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_FILE_SIZE: Record<FileType, number> = {
  [FileType.AUDIO]: 50 * 1024 * 1024, // 50 MB
  [FileType.IMAGE]: 5 * 1024 * 1024,  // 5 MB
};

@Injectable()
export default class FileService {
  createFile(type: FileType, file): string {
    try {
      if (!ALLOWED_MIME_TYPES[type].includes(file.mimetype)) {
        throw new HttpException(
          `Invalid file type: ${file.mimetype}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (file.size > MAX_FILE_SIZE[type]) {
        throw new HttpException(
          `File too large (max ${MAX_FILE_SIZE[type] / 1024 / 1024} MB)`,
          HttpStatus.PAYLOAD_TOO_LARGE,
        );
      }

      const fileExtension = MIME_TO_EXT[file.mimetype];
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(fileName: string) {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
