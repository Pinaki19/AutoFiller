const { main } = require('./fillForm');

function processAndFillRouteHandler(req, res) {
    try {
        const { Request_NO, Form, Form_data, Total } = req.body;
        main(Request_NO, Form, Form_data, Total);
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Error in /fill route handler:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}
module.exports = { processAndFillRouteHandler };