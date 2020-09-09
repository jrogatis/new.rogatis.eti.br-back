/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projects              ->  index
 * POST    /api/projects              ->  create
 * GET     /api/projects/:id          ->  show
 * PUT     /api/projects/:id          ->  upsert
 * PATCH   /api/projects/:id          ->  patch
 * DELETE  /api/projects/:id          ->  destroy
 */
import { Request, Response } from 'express';
import { Project } from './projects.model';
import {
  respondWithResult,
  createEntity,
  /* upsertEntity,
   */
  showEntitySlug,
  handleError,
  destroyEntity,
  // patchEntity,
} from '../utils/utils';

// Gets a list of Project
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const list = await Project.find().sort({ _id: -1 }).exec();
    respondWithResult(res)(list);
  } catch (err) {
    handleError(res)(err);
  }
};

// Gets a single Project from the DB from id or from slug...
const show = (req: Request, res: Response): Promise<void> =>
  showEntitySlug(req, res, Project);

// Creates a new Project in the DB
const create = (req: Request, res: Response) => createEntity(req, res, Project);

// Upserts the given Project in the DB at the specified ID
//const upsert = (req: Request, res: Response) => upsertEntity(req, res, Project);

// Updates an existing Project in the DB
// const patch = (req: Request, res: Response) => patchEntity(req, res, Project);

// Deletes a Project from the DB
const destroy = (req: Request, res: Response): Promise<void> =>
  destroyEntity(req, res, Project);

// export { show, create, upsert, patch, destroy };
export { index, destroy, show, create };
