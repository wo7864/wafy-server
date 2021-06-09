import fs from 'fs';
import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import {
  paramMissingError,
  notFoundError,
  meximumExceededError,
} from '@shared/constants';


import User from '../models/User'
import Project from '../models/Project'

const {
  BAD_REQUEST,
  CREATED,
  OK,
  NOT_FOUND
} = StatusCodes;


export async function getAllAssetImages(req: Request, res: Response) {
  const { id, project_key } = req.params;
  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_key);
      return res.status(OK).json(project.assets.images)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}


export async function addAssetImage(req: Request, res: Response, next: any) {
  const { id, project_key } = req.params;
  const images = req.files as any;

  if (!(images && id && project_key)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_key);
      project.assets.images.push(images[0].filename);
      user.save()
      return res.status(CREATED).json(images[0].filename)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}


export async function deleteAssetImage(req: Request, res: Response) {
  const { id, project_key, filename } = req.params;
  if (!(id && project_key && filename)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  fs.unlink(`./src/public/assets/images/${filename}`,(err)=>{ 
    if(!err) return;
    console.error(`${filename} delete fail`);
    return res.status(BAD_REQUEST).json({
      error:notFoundError
    })
  });

  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_key);
      project.assets.images = project.assets.images.filter((image:string) => image != filename);
      user.save();
      return res.status(CREATED).end();
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

  //await projectDao.delete(Number(id));
  return res.status(OK).end();
}



export async function getAllAssetVideos(req: Request, res: Response) {
  const { id, project_key } = req.params;
  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_key);
      return res.status(OK).json(project.assets.videos)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}


export async function addAssetVideos(req: Request, res: Response) {
  const { id, project_key } = req.params;
  const videos = req.files as any;

  if (!(videos && id && project_key)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_key);
      project.assets.videos.push(videos[0].filename);
      user.save()
      return res.status(CREATED).json(videos[0].filename)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}

export async function deleteAssetVideos(req: Request, res: Response) {
  const { id, project_key, filename } = req.params;
  if (!(id && project_key && filename)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  fs.unlink(`./src/public/assets/videos/${filename}`,(err)=>{ 
    if(!err) return;
    console.error(`${filename} delete fail`);
    return res.status(BAD_REQUEST).json({
      error:notFoundError,
      detail:err
    })
  });

  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_key);
      project.assets.videos = project.assets.videos.filter((image:string) => image != filename);
      user.save();
      return res.status(CREATED).end();
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

}



export async function splitAssetVideo(req: Request, res: Response) {
  const { id, project_key, filename } = req.params;
  if (!(id && project_key && filename)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  
}