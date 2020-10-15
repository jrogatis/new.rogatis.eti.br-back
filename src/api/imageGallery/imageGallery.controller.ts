/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/imageGallery              ->  index
 * POST    /api/imageGallery              ->  create
 * GET     /api/imageGallery/:id          ->  show
 * DELETE  /api/imageGallery/:id          ->  destroy
 */
import AWS from 'aws-sdk';
import { Request, Response } from 'express';
import { respondWithResult, handleError } from '../utils/utils';

const params = {
  Bucket: 'rogatis',
};

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const s3 = new AWS.S3();

// Gets a list of images
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await s3.listObjects(params).promise();
    respondWithResult(res)(result.Contents?.map((item) => item.Key));
  } catch (err) {
    handleError(res)(err);
  }
};

export { index };
