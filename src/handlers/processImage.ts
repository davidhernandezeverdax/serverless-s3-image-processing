import { APIGatewayProxyHandler } from 'aws-lambda';
import { s3Gateway } from '../gateway/s3.gateway';
import sharp from 'sharp';


interface ProcessImageRequest {
    imageName: string;
    width: number;
    height: number;
    format: 'jpeg' | 'png' | 'webp';
    outputName: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const bucketName = process.env.IMAGES_BUCKET_NAME;
    const { imageName, width, height, format, outputName }: ProcessImageRequest = JSON.parse(event.body!);

    if (!bucketName) {
        return { statusCode: 500, body: 'S3 bucket name is not configured.' };
    }

    try {
        const originalImage = await s3Gateway.getFile(bucketName, `uploads/${imageName}`);
        const outputKey = `processed/${outputName}`;
        console.log("originalImage", {ori: originalImage})
        console.log("data", {format: format})
        const processedImage = await sharp(originalImage.Body as Buffer)
            .resize(width, height)
            .toFormat(format)
            .toBuffer();

        await s3Gateway.uploadFile(bucketName, outputKey, processedImage, `image/${format}`);
        const signedUrl = await s3Gateway.getPresignedUrl(bucketName, outputKey);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image processed successfully', url: `s3://${bucketName}/processed/${outputName}`, signedUrl }),
        };
    } catch (error) {
        console.error('Error processing image:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing the image' }),
        };
    }
};