import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { paramMissingError } from '@shared/constants';
const { BAD_REQUEST, CREATED, OK } = StatusCodes;
const router = Router()


/**
 * Get all templates.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
 export async function getAllTemplates(req: Request, res: Response) {
  //const templates = await templateDao.getAll();
  const templates = {};
  return res.status(OK).json({templates});
}


/**
* Get templates.
* 
* @param req 
* @param res 
* @returns 
*/
export async function getTemplate(req: Request, res: Response) {
  //const templates = await templateDao.getAll();
  const template = {};
  return res.status(OK).json({template});
}



/**
* Add one template.
* 
* @param res 
* @returns 
*/
export async function addTemplate(req: Request, res: Response) {
  const { template } = req.body;
  if (!template) {
      return res.status(BAD_REQUEST).json({
          error: paramMissingError,
      });
  }
  //await templateDao.add(template);
  return res.status(CREATED).end();
}


/**
* Update one template.
* 
* @param req 
* @param res 
* @returns 
*/
export async function updateTemplate(req: Request, res: Response) {
  const { template } = req.body;
  if (!template) {
      return res.status(BAD_REQUEST).json({
          error: paramMissingError,
      });
  }

  //await templateDao.update(template);
  return res.status(OK).end();
}


/**
* Delete one template.
* 
* @param req 
* @param res 
* @returns 
*/
export async function deleteTemplate(req: Request, res: Response) {
  const { id } = req.params;
  //await templateDao.delete(Number(id));
  return res.status(OK).end();
}



router.get('/', getAllTemplates);
router.get('/:template_key', getTemplate);
router.post('/', addTemplate);
router.put('/:template_key', updateTemplate);
router.delete('/:template_key', deleteTemplate);

export default router
