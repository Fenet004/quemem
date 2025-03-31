import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class MinioService {
  private s3: S3Client;
  private bucket = process.env.MINIO_BUCKET;

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY as string,
        secretAccessKey: process.env.MINIO_SECRET_KEY as string,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(buffer: Buffer, filename: string, mimeType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filename,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3.send(command);

    return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${this.bucket}/${filename}`;
  }

  async getFileStream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const { Body } = await this.s3.send(command);
    return Body as Readable;
  }

  async getObject(command: GetObjectCommand) {
    return this.s3.send(command);
  }
}
