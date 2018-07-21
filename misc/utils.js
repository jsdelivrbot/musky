const {ERROR_CHANNEL} = require("./config");

module.exports = {
	reportError(bot, user, message, err) {
		bot.say({
			text: `Problems for <@${user}>: ${message}`,
			channel: ERROR_CHANNEL,
			attachments: [
				{
					color: "#ff0000",
					text: err.stack || err
				}
			]
		});

		if (user) {
			bot.say({
				text: "Scuze, a intervenit o eroare :disappointed:. Am anunțat pe administratori de problemă. Te anunță ei când se rezolvă.",
				channel: user
			});
		}
	}
};
