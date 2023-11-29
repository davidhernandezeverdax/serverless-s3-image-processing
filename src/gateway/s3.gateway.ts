import { S3 } from 'aws-sdk';

const s3 = new S3();

export const s3Gateway = {
  async uploadFile(bucketName: string, key: string, body: Buffer, contentType: string) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };

    return s3.upload(params).promise();
  },

  async getFile(bucketName: string, key: string) {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    return s3.getObject(params).promise();
  },
  getPresignedUrl(bucketName: string, key: string, expiresIn: number = 300) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn, // Tiempo en segundos antes de que la URL expire
    };

    return s3.getSignedUrlPromise('getObject', params);
  },

};
