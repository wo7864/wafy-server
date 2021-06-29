import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import {
  paramMissingError,
  notFoundError,
  meximumExceededError,
} from '@shared/constants';
import { converter } from '@shared/converter'
import User, { IUser } from '../models/User'
import Project, { ISimpleProject } from '../models/Project'

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
    .then((user: any) => {
      return res.status(OK).send(user.projects)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}


export async function getSimpleProjects(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      const projects = user.projects.map((project: ISimpleProject) => {
        return {
          _id: project._id,
          title: project.title,
          thumbnail: project.thumbnail,
          create_date: project.create_date,
          update_date: project.update_date,
        }
      })
      return res.status(OK).json(projects)
    })
    .catch(e => res.status(BAD_REQUEST).send(e))
}


export async function getProject(req: Request, res: Response) {
  const { id, project_id } = req.params;
  if (!(id && project_id)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      const project = user.projects.id(project_id);
      if (!project) return res.status(NOT_FOUND).json({
        error: notFoundError
      })
      return res.status(OK).json(project)
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
  const { id, project_id } = req.params;
  const { project } = req.body;
  if (!(id && project_id && project)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await User.findById(id)
    .then((user: any) => {
      const originProject = user.projects.id(project_id);
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
  const { id, project_id } = req.params;
  const { project } = req.body;

  if (!(project && id && project_id)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      user.projects.id(project_id).remove();
      return user.save()
    })
    .then((user) => {
      return res.status(OK).send({ user })
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

  return;
}


export async function downloadProject(req: Request, res: Response) {
  const { id, project_id } = req.params;
  if (!(id && project_id)) {
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

      const project = user.projects.id(project_id);
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


export async function createTemplateProject(req: Request, res: Response) {
  const { id, template_oid, project_id } = req.params;

  if (!(id && template_oid && project_id)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  const template = await User.findById(template_oid)
    .then((user: any) => {
      return user.projects.id(project_id)
    })

  await User.findById(id)
    .then((user: any) => {
      const newOid = new mongoose.Types.ObjectId();
      template._id = newOid
      template.createdAt = Date.now();
      template.updatedAt = Date.now();
      user.projects.push(template)
      user.save()
      return res.status(CREATED).send({ project_id:newOid })
    })
    .catch(e => res.status(BAD_REQUEST).send(e))

}


export async function saveProject(req: Request, res: Response) {
  const { id, project_id } = req.params;
  const { data } = req.body;
  if (!(id && project_id && data)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  await User.findById(id)
    .then((user: any) => {
      const originProject = user.projects.id(project_id);
      const json_data = JSON.parse(data)
      originProject.set({
        ...originProject,
        data:json_data
      })
      return user.save()
    })
    .then((user) => {
      return res.status(OK).send({ user })
    })
    .catch(e => {
      console.log(e);
      return res.status(BAD_REQUEST).send(e)
    })

  return;
}