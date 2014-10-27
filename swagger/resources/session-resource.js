var lib    = require('../lib'),
    db     = require('../database'),
    moment = require('moment');

var param = lib.params,
    raise = lib.errors;

var User    = db.models.User,
    Session = db.models.Session;

module.exports = function (swagger) {
    // Get session information
    swagger.addGet({
        'spec': {
            nickname: 'getSessionInfo',
            path: '/session',
            summary: 'Get the information of a given session',
            notes: 'Return a session based on id',
            method: 'GET',
            produces : ['application/json'],
            type: 'Session',
            parameters: [
                param.query('sessionId', 'Session unique identifier', 'integer', true)
            ]
        },
        'action': function (req, res) {
            if (!req.query.sessionId)
                throw raise.notFound('sessionId');

            Session
                .find({ where: { id: req.query.sessionId }})
                .then(function (session) {
                    if (!session)
                        throw raise.invalid('sessionId');
                    res.status(200).send(session);
                })
                .catch(function (err) {
                    res.status(400).send(err);
                })
        }
    });

    // Create a new session
    swagger.addPost({
        'spec': {
            nickname: 'createSession',
            path: '/session',
            summary: 'Create a new session from a given data',
            notes: 'Create a new session',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Contains all required information to create a new session',
                        'SessionPost', JSON.stringify({ user_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.user_id)
                throw raise.notFound('user_id');

            Session
                .create({
                    user_id: req.body.user_id,
                    expire: moment.utc().add(3, 'days').toDate()
                })
                .then(function (session) {
                    res.status(200).send({
                        result: 'success',
                        session_id: session.id,
                        expire: session.expire
                    })
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        }
    });

    swagger.configureDeclaration('session', {
        description : 'Operations about Sessions',
        produces: ['application/json']
    });
}