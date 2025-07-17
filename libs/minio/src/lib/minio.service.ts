import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { Multer } from 'multer';
import { Request, Express } from 'express';
import { MODULE_OPTIONS_TOKEN } from './minio.module-definition';
import { MinioModuleOptions } from './minio-module-options.interface';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import * as path from 'path';

@Injectable()
export class MinioService {

  constructor(@Inject('MINIO_CLIENT') private readonly minioClient: Client,
    private readonly httpService: HttpService,) { }

  async uploadFile(buffer: Buffer, fileName: string, bucketName: string, mimeType: string, fileExt: string, assetId: string) {
    try {
      // Ensure the bucket exists
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }

      const metadata = {
        'x-amz-meta-file-extension': fileExt, // Store the file extension in the metadata
        'x-amz-meta-asset-id': assetId, // Store the asset ID in the metadata
      };

      // Upload the file with metadata
      const fileSize = buffer.length;  // Get the size of the file
      const options = {
        'Content-Type': 'application/octet-stream', // Set content type as needed
        ...metadata, // Include the metadata with the file
      };

      const file = await this.minioClient.putObject(bucketName, fileName, buffer, fileSize, options);

      console.log(`File uploaded successfully: ${JSON.stringify(file)}`);
      return { fileName, bucketName };
    } catch (error) {
      console.error(`Error uploading file:`, error);
      throw error;
    }
  }

  async updateFile(buffer: Buffer, fileName: string, bucketName: string, mimeType: string, fileExt: string) {
    try {
      // Find the file in the bucket with the same fileId
      const objectsStream = this.minioClient.listObjectsV2(bucketName);
      let latestFile = null;

      for await (const obj of objectsStream) {

        const objStat = await this.minioClient.statObject(bucketName, obj.name);
        if (objStat.metaData['asset-id']) {
          latestFile = obj; // Get latest file with matching fileId
        }
      }
      if (!latestFile) {
        throw new Error("No existing file found to update!");
      }

      const prevStat = await this.minioClient.statObject(bucketName, latestFile.name);
      const prevFileId = prevStat.metaData['asset-id'];

      const metadata = {
        'x-amz-meta-file-extension': fileExt,
        'x-amz-meta-asset-id': prevFileId, // Keep same file ID
      };

      await this.minioClient.putObject(bucketName, fileName, buffer, buffer.length, {
        'Content-Type': mimeType || 'application/octet-stream',
        ...metadata,
      });

      console.log(`Updated file: ${fileName}`);

      return { fileName, bucketName };

    } catch (error) {
      console.error(`Error uploading file:`, error);
      throw error;
    }
  }

  async getFileUrl(objectName: string, bucketName: string) {
    const stat = await this.minioClient.statObject(bucketName, objectName);
    return await this.minioClient.presignedUrl('GET', bucketName, objectName);
  }

  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
      console.log(`File ${objectName} deleted successfully from ${bucketName}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async retrieveFile(data: any, fileExt: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(decodeURI(data.presignedUrl), {
            responseType: 'arraybuffer', // Ensure we get binary data
          })
          .pipe(
            map((res) => res.data), // Extract data from response
            catchError((error) => {
              console.error('Error fetching file from pre-signed URL:', error);
              return of(null); // Return null or handle error gracefully
            }),
          ),
      );
      if (!response) {
        throw new Error('Failed to fetch file from the pre-signed URL');
      }
      // Ensure the bucket exists
      const bucketExists = await this.minioClient.bucketExists(data.bucket);
      if (!bucketExists) {
        await this.minioClient.makeBucket(data.bucket, 'us-east-1');
      }

      const fileSize = response.length;  // Get the size of the file
      const metadata = {
        'x-amz-meta-file-extension': fileExt, // Store the file extension in the metadata
      };

      const options = {
        'Content-Type': 'application/octet-stream', // Set content type as needed
        ...metadata, // Include the metadata with the file
      };

      // Upload the file to your MinIO instance
      await this.minioClient.putObject(data.bucket, data.fileName, response, fileSize, options);

      console.log(`File '${data.fileName}' downloaded from URL and uploaded to 'test1'`);
    } catch (error) {
      console.error('Error fetching or uploading file:', error);
      throw new Error('Failed to fetch and upload file');
    }
  }

  async getCorrectUrl(bucketName: string, fileName: string) {
    const metadata = await this.getMetadata(bucketName, fileName)
    const contentDisposition = `attachment; filename="${fileName}.${metadata?.metaData['file-extension']}"`;

    const url = await this.minioClient.presignedGetObject(bucketName, fileName, 60 * 60, {
      'response-content-disposition': contentDisposition,
    });

    return url;
  }

  async getMetadata(bucketname: string, filename: string) {
    let metadata
    try {
      metadata = await this.minioClient.statObject(bucketname, filename);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
    return metadata
  }
}
