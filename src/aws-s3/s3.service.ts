import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private readonly region: string;
  private readonly bucket: string;
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.region = configService.get<string>('AWS_BUCKET_REGION');
    this.bucket = this.configService.get<string>('AWS_BUCKET_NAME');
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  private getFileUrl(fileName: string) {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}`;
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: this.bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(new PutObjectCommand(input));
      if (response.$metadata.httpStatusCode === HttpStatus.OK) {
        return this.getFileUrl(key);
      }
      throw new Error('Image not saved in s3!');
    } catch (err) {
      this.logger.error('Cannot save file to s3,', err);
      throw err;
    }
  }

  async deleteFile(fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    });
    try {
      const response: PutObjectCommandOutput = await this.s3.send(command);
      if (response.$metadata.httpStatusCode === HttpStatus.NO_CONTENT) {
        return `Successfully removed ${this.getFileUrl(fileName)} or file doesn't exist`;
      }
      throw new Error('Image not removed from s3!');
    } catch (err) {
      this.logger.error('Cannot removed file from s3,', err);
      throw err;
    }
  }
}
