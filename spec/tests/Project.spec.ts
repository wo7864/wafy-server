import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test } from 'supertest';

import app from '@server';
import User, { IUser } from 'src/models/User';
import Project, { IProject } from 'src/models/Project';
import { IAssets } from 'src/models/Asset';
import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';
import { IReqBody, IResponse } from '../support/types';


describe('ProjectRouter', () => {

    const {
        BAD_REQUEST,
        CREATED,
        OK,
        NOT_FOUND
    } = StatusCodes;

    const usersPath = '/api/users/:id';
    const projectsPath = `${usersPath}/projects`;
    const getAllProjectsPath = `${projectsPath}`;
    const getProjectsPath = `${projectsPath}/:project_id`;
    const createProjectsPath = `${projectsPath}`;
    const updateProjectPath = `${projectsPath}/:project_id`;
    const deleteProjectPath = `${projectsPath}/:project_id`;

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"GET:${getAllProjectsPath}"`, () => {

        const callApi = (id:string) => {
            const path = getAllProjectsPath.replace(':id', id);
            return agent.get(path);
        };
        it('hi', (done) => {
            
            callApi('60af044101b6d48968d26c67')
                .end((err:Error, res:IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    console.log(res);
                })
            done();
        })
    });
})