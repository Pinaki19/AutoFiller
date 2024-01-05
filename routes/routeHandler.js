const { main } = require('./fillForm');
const {
    incrementAnsweredCount,
    incrementFilledCount,
    incrementTimeSaved
} = require('./increamentCounts')
async function processAndFillRouteHandler(req, res) {
    try {
        const { Request_NO, Form, Form_data, Total } = req.body;
        main(Request_NO, Form, Form_data, Total);
        res.json({ status: 'ok' });
        const n = parseInt(Total, 10);
        await incrementAnsweredCount(n);
        await incrementFilledCount(n);
        const time = Math.ceil((n * 15) / 60);
        await incrementTimeSaved(time);
    } catch (error) {
        console.error('Error in /fill route handler:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}
module.exports = { processAndFillRouteHandler };