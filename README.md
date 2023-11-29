# Serverless Image Processing 

## Description

This project, *Serverless Image Processing API*, leverages AWS Lambda, S3 and SHARP for image processing. Built with Node.js and TypeScript, it offers an API for uploading and processing images, featuring operations such as resizing and format conversion.

## Features

- Upload images to AWS S3 using a serverless API endpoint.
- Dynamically process images based on user input (resize, change format, etc.).
- Secure image storage and access using AWS S3.
- Utilize AWS Lambda for efficient, on-demand image processing.

## Installation

Ensure you have Node.js, npm, and the Serverless Framework installed. AWS CLI should be configured with appropriate AWS credentials.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/serverless-s3-image-processing.git

2. Navigate to the project directory:
   ```bash
   cd serverless-s3-image-processing

3. Install dependencies
   ```bash
   npm install

## Deployment
Deploy the service using the Serverless Framework. Ensure you have AWS credentials configured.
   ```bash
   npm install
   ```
## Usage
Uploading an Image
- Endpoint: POST /upload
- Use tools like Postman or cURL to send a POST request to the upload endpoint.
- Include the image file in the request body.
- The function will upload the image to an S3 bucket.

Processing an Image
- Endpoint: POST /process-image
- Send a POST request to this endpoint with JSON payload specifying imageName, width, height, format, and outputName.
- The function will process the image as per the request and upload it to S3.
- A presigned URL of the processed image will be returned in the response.
