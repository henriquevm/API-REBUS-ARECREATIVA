const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * Metodo HTTP:
 * 
 * GET: Bucar informações do back-end 
 * POST: Criar uma informações no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informações do back-end
 */

/**
 * Tipos de parâmetros
 * 
 * Query Params: Filtros e paginação
 * Routes Params: Identificar recurso (Atualizar /Deletar)
 * Request Body: Contéudo na hora criar ou editar um recurso (vem atravez de JSON) 
 */

/**
 * Middleware:
 * 
 * Interceptador de requisições que interromper totalmente a requisição ou alterar dados da requisição.
 */

const projects = [];

function logRequest(request, response, next) {
    const { method, url } = request;

    const loLabel = { method, url };

    console.log(loLabel);

    console.time(loLabel);

    next();//executa o proximo e volta aqui

    console.timeEnd(loLabel);
}

function validateProjectId(request, response, next){
    const {id} = request.params;

    if (!isUuid(id)){
        return response.status(400).json({error: 'Deu erro meiu irmão'})
    }

    return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

/*List*/
app.get('/projects', (request, response) => {
    // const query = request.query;

    // console.log(query);

    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects

    return response.json(results);
});

/* Create */
app.post('/projects', (request, response) => {

    const { title, owner } = request.body;
    //console.log(title + ' ' + owner);

    const project = { id: uuid(), title, owner }

    projects.push(project);

    return response.json(project);
});

/* Update */
app.put('/projects/:id', (request, response) => {

    const { id } = request.params;
    //console.log(params);
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    const project = {
        id,
        title,
        owner,
    }

    projects[projectIndex] = project;

    return response.json(project);
});

/*Delete*/
app.delete('/projects/:id', (request, response) => {

    const { id } = request.params;
    //console.log(id);

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('✔ Back-end started!')
});