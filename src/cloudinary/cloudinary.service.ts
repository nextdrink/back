import { Injectable } from '@nestjs/common';

import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly storage: any;

  constructor(private readonly configService: ConfigService) {
    this.storage = cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(path: string, file) {
    try {
      const result = await new Promise<{ url?: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: `next-drink/${path}` }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
          .end(file.buffer);
      });
      return result?.url || '';
    } catch (err) {
      throw err;
    }
  }

  async deleteFile(fileName: string) {
    try {
      console.log('//TODO: will be implemented after changes on the front-end side');
    } catch (err) {
      throw err;
    }
  }
}
