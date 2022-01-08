import fs from 'fs';
import StatusCodes from 'http-status-codes';
import { Request, Response, } from 'express';
import {
  paramMissingError,
  notFoundError,
} from '@shared/constants';

import User from '../models/User'

const {
  BAD_REQUEST,
  CREATED,
  OK,
  NOT_MODIFIED
} = StatusCodes;


export async function getAllAssetImages(req: Request, res: Response) {
  const { id, project_id } = req.params;
  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_id);
      return res.status(OK).json(project.assets.images)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}


export async function addAssetImage(req: Request, res: Response, next: any) {
  const { id, project_id } = req.params;
  const images = req.files as any;

  if (!(images && id && project_id)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_id);
      project.assets.images.push(images[0].filename);
      user.save()
      return res.status(CREATED).json(images[0].filename)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}


export async function deleteAssetImage(req: Request, res: Response) {
  const { id, project_id, filename } = req.params;
  if (!(id && project_id && filename)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  fs.unlink(`./src/public/assets/images/${filename}`, (err) => {
    if (!err) return;
    console.error(`${filename} delete fail`);
    return res.status(BAD_REQUEST).json({
      error: notFoundError
    })
  });

  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_id);
      project.assets.images = project.assets.images.filter((image: string) => image != filename);
      user.save();
      return res.status(CREATED).end();
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

  //await projectDao.delete(Number(id));
  return res.status(OK).end();
}



export async function getAllAssetVideos(req: Request, res: Response) {
  const { id, project_id } = req.params;
  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_id);
      return res.status(OK).json(project.assets.videos)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}


export async function addAssetVideos(req: Request, res: Response) {
  const { id, project_id } = req.params;
  const videos = req.files as any;

  if (!(videos && id && project_id)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  const videoPath = `./src/public/assets/videos/${videos[0].filename}`
  const videoOutputPath = `./src/public/assets/videos/thumbnail`
  if (!fs.existsSync(videoOutputPath)) {
    fs.mkdirSync(videoOutputPath)
  }

  const cap = new VideoCapture(videoPath);

  let frame;
  frame = cap.read();
  imwrite(`${videoOutputPath}/${videos[0].filename.split('.')[0]}.jpg`, frame);



  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_id);
      project.assets.videos.push({
        filename:videos[0].filename
      });
      user.save()
      return res.status(CREATED).json({
        filename:videos[0].filename,
        isSplited:false,
        maxFrmae:-1
      })
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}

export async function deleteAssetVideos(req: Request, res: Response) {
  const { id, project_id, filename } = req.params;
  if (!(id && project_id && filename)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  fs.unlink(`./src/public/assets/videos/${filename}`, (err) => {
    if (!err) return;
    console.error(`${filename} delete fail`);
    return res.status(BAD_REQUEST).json({
      error: notFoundError,
      detail: err
    })
  });

  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_id);
      project.assets.videos = project.assets.videos.filter((image: string) => image != filename);
      user.save();
      return res.status(CREATED).end();
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

}



export async function splitAssetVideo(req: Request, res: Response) {
  const { id, project_id, filename } = req.params;
  if (!(id && project_id && filename)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }


  const videoPath = `./src/public/assets/videos/${filename}`
  const videoOutputPath = `./src/public/assets/videos/${filename.split('.')[0]}`
  if (!fs.existsSync(videoOutputPath)) {
    fs.mkdirSync(videoOutputPath)
  } else {
    return res.status(NOT_MODIFIED).json({
      message: 'already splited video'
    })
  }

  const cap = new VideoCapture(videoPath);

  let cnt = 0;
  let frame;
  frame = cap.read();
  while (frame.step) {
    imwrite(`${videoOutputPath}/${cnt}.jpg`, frame);
    frame = cap.read();
    cnt += 1
  }


  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_id);
      project.assets.videos.forEach((video:any) => {
        if(video.filename === filename)
          video.maxFrame = cnt;
      });
      
      user.save()
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

  return res.status(OK).json({
    filename: filename,
    count: cnt,
  })
}