/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/imageGallery              ->  index
 * POST    /api/imageGallery              ->  create
 * GET     /api/imageGallery/:id          ->  show
 * DELETE  /api/imageGallery/:id          ->  destroy
 */
import AWS from 'aws-sdk';
import crypto from 'crypto';
import moment from 'moment';
import { Request, Response } from 'express';
import { handleError } from '../utils/utils';

const expiration = moment().add(5, 'm').toDate(); //15 minutes
const s3Url = 'https://s3.amazonaws.com/rogatis';
const readType = 'public-read';

const credentials = (
  base64Policy: string,
  signature: string,
  req: Request,
) => ({
  url: s3Url,
  fields: {
    key: req.body.filename,
    AWSAccessKeyId: process.env.aws_access_key_id,
    acl: readType,
    policy: base64Policy,
    signature,
    'Content-Type': req.body.type,
    success_action_status: 201,
  },
});

const s3Policy = (req: Request) => ({
  expiration,
  conditions: [
    {
      bucket: 'rogatis',
    },
    ['starts-with', '$key', req.body.filename],
    {
      acl: readType,
    },
    {
      success_action_status: '201',
    },
    ['starts-with', '$Content-Type', req.body.type],
    ['content-length-range', 2048, 10485760], //min and max
  ],
});

const params = {
  Bucket: 'rogatis',
};

AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: 'us-east-1',
});
const s3 = new AWS.S3();

exports.signing = (req: Request, res: Response) => {
  const stringPolicy = JSON.stringify(s3Policy(req));
  const base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign policy
  const signature = crypto
    .createHmac('sha1', process.env.aws_secret_access_key!)
    .update(new Buffer(base64Policy, 'utf-8'))
    .digest('base64');

  res.jsonp(credentials(base64Policy, signature, req));
};

// Gets a list of images
const index = (req: Request, res: Response): Promise<unknown> => {
  console.log('aqui');
  return s3
    .listObjects(params)
    .promise()
    .then((data) => {
      const images: string[] = [];
      if (data.Contents) {
        data.Contents.map((image) => {
          if (image.Key) {
            images.push(image.Key);
          }
        });
      }

      return res.status(200).json(images);
    })
    .catch((err) => {
      console.log(err);
      return handleError(res);
    });
};
// Deletes a image from the s3
/*export const destroy = (req: Request, res: Response) => {
  const paramsToDelete = {
    Bucket: 'rogatis',
    Key: req.params.id,
  };
  s3.deleteObject(paramsToDelete)
    .promise()
    .then((result) => {
      console.log(result);
      return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      return handleError(res);
    });
};*/

export { index };
