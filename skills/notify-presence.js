module.exports = function(controller) {
	controller.hears(['^notifica','^notify', "prezenta"], 'direct_message,direct_mention', function(bot, message) {

			controller.storage.users.get(message.user, function(err, user) {
				const utils = require("../misc/utils");

				if (err) {
					return utils.reportError(bot, message.user, `Unable to read users from storage`, err);
				}

				if (!user) {
					user = {
						id: message.user
					};
				}

				user.notifyPresence = true;

				controller.storage.users.save(user, function(err) {
					if (err) {
						return utils.reportError(bot,
							message.user,
							`Unable to subscribe to presence notifications`,
							err || 'saved is false'
						);
					}

					bot.say({
						text: 'Ok. O să te anunț când cineva vine la atelier :wink:',
						channel: message.user
					});
				});
			});
	});
};
