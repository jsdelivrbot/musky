var debug = require('debug')('botkit:incoming_webhooks');

module.exports = function(webserver, controller) {

	debug('Configured /slack/receive url');
	webserver.post('/slack/receive', function(req, res) {
		// NOTE: we should enforce the token check here

		// respond to Slack that the webhook has been received.
		res.status(200);

		// Now, pass the webhook into be processed
		controller.handleWebhookPayload(req, res);
	});

	webserver.get("/notify-presence/:member", function(req, res) {
		controller.trigger("notify-presence", [req.params.member]);
		res.status(200).json({status: "success"});
	});
};
