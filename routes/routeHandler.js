const { main } = require('./fillForm');
const {
    incrementAnsweredCount,
    incrementFilledCount,
    incrementTimeSaved
} = require('./increamentCounts')
function processAndFillRouteHandler(req, res) {
    try {
        const { Request_NO, Form, Form_data, Total } = req.body;
        main(Request_NO, Form, Form_data, Total);
        res.json({ status: 'ok' });
        const n = parseInt(Total, 10);
        incrementAnsweredCount(n);
        incrementFilledCount(n);
        const time = Math.ceil((n * 15) / 60);
        incrementTimeSaved(time);
    } catch (error) {
        console.error('Error in /fill route handler:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}
module.exports = { processAndFillRouteHandler };