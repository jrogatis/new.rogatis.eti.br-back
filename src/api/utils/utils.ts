import jsonpatch from 'fast-json-patch';
import { Request, Response } from 'express';
import { ProjectModel } from '../projects/projects.model';

const respondWithResult = (res: Response, statusCode = 200) => (
  entity: any,
): Response | null => {
  if (entity) return res.status(statusCode).json(entity);
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const handleError = (res: Response, statusCode = 500) => (err: unknown) => {
  res.status(statusCode).send(err);
};

const handleEntityNotFound = (res: Response) => (entity: unknown | null) => {
  if (!entity) {
    res.status(404).end();
    return null;
  }
  return entity;
};

const removeEntity = (res: Response) => (entity: any) => {
  if (entity) {
    return entity.remove().then(() => {
      res.status(204).end();
    });
  }
};

const destroyEntity = async (
  req: Request,
  res: Response,
  Entity: ProjectModel,
): Promise<void> => {
  try {
    const result = await Entity.findById(req.params.id);
    handleEntityNotFound(res)(result);
    removeEntity(res)(result);
  } catch (err) {
    handleError(res)(err);
  }
};

const showEntitySlug = async (
  req: Request,
  res: Response,
  Entity: ProjectModel,
): Promise<void> => {
  try {
    const result = await Entity.findById(req.params.id);
    handleEntityNotFound(res)(result);
    respondWithResult(res)(result);
  } catch (err) {
    handleError(res)(err);
  }
};

const createEntity = async (req: Request, res: Response, Entity: any) => {
  try {
    const result = await Entity.create(req.body);
    respondWithResult(res, 201)(result);
  } catch (err) {
    handleError(res)(err);
  }
};

export {
  respondWithResult,
  /* patchUpdates,
  removeEntity,
  handleEntityNotFound,*/
  handleError,
  destroyEntity,
  showEntitySlug,
  createEntity,
  /* patchEntity,
  showEntity,
  upsertEntity,*/
};
