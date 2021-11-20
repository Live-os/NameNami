import { Constants, Formatters, GuildMember, GuildTextBasedChannel, HexColorString, MessageEmbed, NewsChannel, TextBasedChannels, TextChannel } from "discord.js"
import { successColor, ids } from "../../config.json"
import { generateTip } from "../../lib/util"

import type { Command } from "../../lib/imports"

const command: Command = {
	name: "say",
	description: "Says something in a specific channel.",
	options: [{
		type: "CHANNEL",
		channelTypes: Constants.TextBasedChannelTypes,
		name: "channel",
		description: "The channel to send the message in",
		required: true
	},
	{
		type: "STRING",
		name: "message",
		description: "The message to send",
		required: true
	}],
	cooldown: 600,
	roleWhitelist: [ids.roles.staff],
	async execute(interaction) {
		const sendTo = interaction.options.getChannel("channel", true) as GuildTextBasedChannel,
			member = interaction.member as GuildMember,
			message = interaction.options.getString("message", true)

		if (!member.permissionsIn(sendTo).has("SEND_MESSAGES")) throw "noPermission"

		if (member.permissions.has("MANAGE_ROLES")) await sendTo.send(message)
		else await sendTo.send(Formatters.blockQuote(message))
		const embed = new MessageEmbed()
			.setColor(successColor as HexColorString)
			.setAuthor("Message")
			.setTitle("Success! Message sent.")
			.setDescription(`${sendTo}:\n${message}`)
			.setFooter(generateTip(), member.displayAvatarURL({ format: "png", dynamic: true }))
		await interaction.reply({ embeds: [embed] })
	}
}

export default command
