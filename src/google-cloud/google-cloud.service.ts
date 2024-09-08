import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GoogleCloudService {
  private logger = new Logger(GoogleCloudService.name);
  private readonly region: string;
  private readonly bucket: any;
  private readonly storage: any;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      projectId: configService.get<string>('PROJECT_ID'),
      //keyFilename: configService.get<string>('KEY_FILENAME'),
    });

    this.bucket = this.storage.bucket(this.configService.get<string>('BUCKET_NAME'));
  }

  // private getFileUrl(fileName: string) {
  //   return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}`;
  // }

  async uploadFile(path, file) {
    try {
      const blob = this.bucket.file(`${path}/${file.originalname}`);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        console.error('Error blobStream:', err);
      });

      blobStream.end(file.buffer);
      return `https://storage.cloud.google.com/${this.bucket.name}/${blob.name}`;
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async deleteFile(fileName: string) {
    try {
      const res = await this.bucket.file(fileName).delete();
      console.log(res);
      // if (response.$metadata.httpStatusCode === HttpStatus.NO_CONTENT) {
      //   return `Successfully removed ${this.getFileUrl(fileName)} or file doesn't exist`;
      // }
      // throw new Error('Image not removed from google cloud bucket!');
    } catch (err) {
      this.logger.error('Cannot removed file from google cloud bucket,', err);
      throw err;
    }
  }
}
