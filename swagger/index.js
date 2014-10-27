module.exports.attach = function (app) {
    var swagger = require('./lib').createNew(app);

    swagger.addModels(require('./models'));
    require('./resources').attach(swagger);

    swagger.setApiInfo({
        title: 'Dream Social Network API Documentation',
        description: 'API Document for Dream Social Network',
    });

    swagger.configureSwaggerPaths('', 'api-docs', '');
    swagger.configure(global.appHost, global.appVersion);
}