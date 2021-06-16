import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import {
  paramMissingError,
  notFoundError,
  meximumExceededError,
} from '@shared/constants';
import { converter } from '@shared/converter'
import User, { IUser } from '../models/User'
import Project from '../models/Project'

const {
  BAD_REQUEST,
  CREATED,
  OK,
  NOT_FOUND
} = StatusCodes;


export async function getAllProjects(req: Request, res: Response) {

  const { id } = req.params;
  if (!id) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user:any) => {
      return res.status(OK).send(user.projects)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}

export async function getProject(req: Request, res: Response) {


  const { id, project_key } = req.params;
  if (!(id && project_key)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      return res.status(OK).send(user.projects.id(project_key))
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

  return;

}

export async function createProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { project } = req.body;

    if (!(project && id)) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError,
      });
    }

    const project_ = await new Project(project);
    const user = await User.findOne({ _id: id })
    if (!user) {
      return res.status(NOT_FOUND).json({
        error: notFoundError,
      })
    }
    if (user.projects.length >= 3) {
      return res.status(BAD_REQUEST).json({
        error: meximumExceededError,
      })
    }

    user.projects.push(project_);
    user.save()
  } catch (e) {
    console.error(e)
  }


  return res.status(CREATED).end();
}


/**
* Update one project.
* 
* @param req 
* @param res 
* @returns 
*/
export async function updateProject(req: Request, res: Response) {
  const { id, project_key } = req.params;
  const { project } = req.body;
  if (!(id && project_key && project)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await User.findById(id)
    .then((user: any) => {
      const originProject = user.projects.id(project_key);
      originProject.set(project)
      return user.save()
    })
    .then((user) => {
      return res.status(OK).send({ user })
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

  return;
}


/**
* Delete one project.
* 
* @param req 
* @param res 
* @returns 
*/
export async function deleteProject(req: Request, res: Response) {
  const { id, project_key } = req.params;
  const { project } = req.body;

  if (!(project && id && project_key)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      user.projects.id(project_key).remove();
      return user.save()
    })
    .then((user) => {
      return res.status(OK).send({ user })
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

  return;
}


export async function downloadProject(req: Request, res: Response) {
  const { id, project_key } = req.params;
  if (!(id && project_key)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      if (!user) {
        return res.status(NOT_FOUND).json({
          error: notFoundError,
        })
      }
      
      const project = user.projects.id(project_key);
      converter(project);
      //const {html, css, js} = converter(project.data);
    })
    .then((user) => {
      return res.status(OK).send({ user })
    })
    .catch(e => res.status(BAD_REQUEST).json({
      error: 'findError or promise Error',
      contents: e
    }))

  //return res.status(OK).end();
}
