const MainRoutes = require('../routes/main_routes');
const ApiRoutes = require('../routes/api_routes');

module.exports = (app) => {
    app.use('/', MainRoutes);
    app.use('/api', ApiRoutes);
};
