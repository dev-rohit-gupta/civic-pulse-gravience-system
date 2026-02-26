import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function createS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadToS3(file: Express.Multer.File, key: string) {
  const s3 = createS3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  return await s3.send(command);
}

export async function deleteFromS3(key: string) {
  const s3 = createS3Client();
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  return await s3.send(command);
}
export function getS3Object(key: string, range?: string) {
  const s3 = createS3Client();
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ...(range && { Range: range }),
  });

  return s3.send(command);
}

