/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/posts              ->  index
 * POST    /api/posts              ->  create
 * GET     /api/posts/:id          ->  show
 * PUT     /api/posts/:id          ->  upsert
 * PATCH   /api/posts/:id          ->  patch
 * DELETE  /api/posts/:id          ->  destroy
 */

import { Request, Response } from 'express';
import { Posts } from './posts.model';
import {
  createEntity,
  respondWithResult,
  showEntitySlug,
  handleError,
  patchEntity,
  destroyEntity,
  upsertEntity,
} from '../utils/utils';

// Gets a list of Posts
const index = (req: Request, res: Response) =>
  Posts.find()
    .sort([['date', 'descending']])
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

// Gets a single Posts from the DB from id or from slug...
const show = (req: Request, res: Response) => showEntitySlug(req, res, Posts);
// Creates a new Posts in the DB
const create = (req: Request, res: Response) => createEntity(req, res, Posts);

// Upserts the given Posts in the DB at the specified ID
const upsert = (res: Response, req: Request) => upsertEntity(req, res, Posts);

// Updates an existing Posts in the DB
const patch = (req: Request, res: Response) => patchEntity(req, res, Posts);

// Deletes a Posts from the DB
const destroy = (req: Request, res: Response) => destroyEntity(req, res, Posts);

export { index, destroy, show, create, patch, upsert };
