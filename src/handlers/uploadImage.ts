import { APIGatewayProxyHandler } from 'aws-lambda';
import middy from '@middy/core';
import multipartBodyParser from '@middy/http-multipart-body-parser';
import { s3Gateway } from '../gateway/s3.gateway';


interface MultipartFile {
  content: Buffer;
  filename: string;
  contentType: string;
  encoding: string;
  fieldname: string;
}

interface MultipartBody {
  [key: string]: MultipartFile | MultipartFile[];
}

const baseHandler: APIGatewayProxyHandler = async (event) => {
  const body = event.body as unknown as MultipartBody;
  const bucketName = process.env.IMAGES_BUCKET_NAME;

  if (!body || !bucketName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No file provided or S3 bucket not configured.' }),
    };
  }

  const file = body.file as MultipartFile;
  if (!file || !file.content) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'File is missing in the request.' }),
    };
  }

  try {
    const key = `uploads/${Date.now()}_${file.filename}`;
    const uploadResult = await s3Gateway.uploadFile(bucketName, key, file.content, file.contentType);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File uploaded successfully!',
        uploadResult,
      }),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading the file.' }),
    };
  }
};

export const handler = middy().use(multipartBodyParser()).handler(baseHandler);
