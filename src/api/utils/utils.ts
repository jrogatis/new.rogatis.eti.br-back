/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyPatch } from 'fast-json-patch';
import { Request, Response } from 'express';

const respondWithResult = (res: Response, statusCode = 200) => (
  entity: any,
): Response | null => {
  if (entity) return res.status(statusCode).json(entity);
  return null;
};

const patchEntity = async (req: Request, res: Response, Entity: any) => {
  if (req.body._id) {
    delete req.body._id;
  }
  try {
    const result = await Entity.findById(req.params.id);
    handleEntityNotFound(res)(result);
    const patched = await patchUpdates(req.body)(result);
    respondWithResult(res)(patched);
  } catch (err) {
    handleError(res)(err);
  }
};

const patchUpdates = (patches: any) => (entity: any) => {
  try {
    applyPatch(entity, patches, /*validate*/ true);
  } catch (err) {
    console.error('ERROR at patchUpdates', err);
    return Promise.reject(err);
  }
  return entity.save();
};

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
  Entity: any,
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
  Entity: any,
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
const upsertEntity = async (req: Request, res: Response, Entity: any) => {
  if (req.body._id) delete req.body._id;
  try {
    const result = await Entity.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
        useFindAndModify: false,
      },
    );
    respondWithResult(res)(result);
  } catch (err) {
    console.log({ err });
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
  patchEntity,
  upsertEntity,
  /*showEntity*/
};
