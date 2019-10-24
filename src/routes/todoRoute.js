const Joi = require('@hapi/joi');
const Models = require('../../models/index')
const todosHandler = async (request, h) => {
    try {
        const todos = await Models.Todos.findAll({})
        return { data: todos }
    }
    catch (error) {
        return h.response({ error: error.message }).code(400)
    }
}

const createTodoHandler = async (request, h) => {
    try {
        const { titleReq, descriptionReq, userIdReq, completedReq, dateReq } = request.payload
        console.log(request.payload);
        const todo = await Models.Todos.create({
            title: titleReq,
            desciption: descriptionReq,
            userId: userIdReq,
            completed: completedReq,
            dateActivity: dateReq
        })
        return {
            data: todo,
            message: 'New todo has been created.'
        }
    }
    catch (error) {
        return h.response({
            error: error.message
        }).code(400)
    }
}

const updateTodoHandler = async (request, h) => {
    try {
        const todo_id = request.params.id;
        const { titleReq, descriptionReq, completedReq } =
            request.payload;
        const todo = await Models.Todos.update({
            title: titleReq,
            desciption: descriptionReq,
            completed: completedReq,
        }, {
            where: {
                id: todo_id
            }
        })

        const dataRequest = request.payload
        console.log('dataRequest');
        console.log(todo);
        return {
            data: dataRequest,
            message: 'Todo has been updated'
        }
    }
    catch (error) {
        return h.response({
            error: error.message
        }).code(400)
    }
}

const deleteTodoHandler = async (request, h) => {
    try {
        const todo_id = request.params.id;
        await Models.Todos.destroy({
            where: {
                id: todo_id
            }
        })
        return { message: 'Todo has been deleted.' }
    }
    catch (error) {
        return h.response({
            error: error.message
        }).code(400)
    }
}

module.exports = [
    { method: 'GET', path: '/todos', handler: todosHandler },

    {
        method: 'POST',
        path: '/todo',
        config: {
            validate: {
                payload: {
                    titleReq: Joi.required(),
                    descriptionReq: Joi.required(),
                    userIdReq: Joi.number().min(1).required(),
                    completedReq: Joi.number().min(0).max(1).required(),
                    dateReq: Joi.date().required(),
                }
            }
        },
        handler: createTodoHandler
    },

    { method: 'PUT', path: '/todo/{id}', handler: updateTodoHandler },
    { method: 'DELETE', path: '/todo/{id}', handler: deleteTodoHandler },
];