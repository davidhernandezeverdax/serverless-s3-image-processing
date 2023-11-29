import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverless-s3-image-processing',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      IMAGES_BUCKET_NAME: '${self:provider.stage}-${self:service}-image',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          's3:GetObject',
          's3:PutObject',
          's3:DeleteObject',
        ],
        Resource: 'arn:aws:s3:::${self:provider.environment.IMAGES_BUCKET_NAME}/*',
      },
    ],
  },
  functions: {
    uploadImage: {
      handler: 'src/handlers/uploadImage.handler',
      events: [{ http: { method: 'post', path: 'image/upload' } }],
    },
    processImage: {
      handler: 'src/handlers/processImage.handler',
      layers: [
        'arn:aws:lambda:us-east-1:381569619823:layer:sharp-layer:1'
      ],
      events: [
        {
          http: {
            method: 'post',
            path: 'image/process',
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'sharp'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      ImagesBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.IMAGES_BUCKET_NAME}',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
