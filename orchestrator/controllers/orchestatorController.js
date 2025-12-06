const orchestationService = require('../services/orchestrationService');

const health = (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "orchestrator"
    });
};

const run = async (req, res) => {
    try {
        const orchestationResponse = await orchestationService.runOrchestration();
        res.status(200).json(orchestationResponse);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: 'Error interno del servidor'});
    };
}; 


module.exports = {
    health,
    run
};