import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2({
  body,
  key,
  contentType,
}: {
  body: Buffer;
  key: string;
  contentType: string;
}): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME!;

  try {
    //Uploading file
    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );

    return `${process.env.R2_PUBLIC_URL}/${key}`;
  } catch (error) {
    return error as string;
  }
}
