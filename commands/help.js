helpInformation = {}; // Help information
helpInformation["help"] = "The help function... for purposes";
helpInformation["ping"] = "Get the discord bot's ping to your server.";
helpInformation["embed"] = "Make discord embeds";
helpInformation["argprint"] = "Prints arguments, mostly for debugging";
helpInformation["mute"] = "Mutes a user(must have roles below the bots)";
helpInformation["welcome-setup"] = "Sets user welcome channel ID";
helpInformation["welcome-message"] = "Sets Welcome Message with $name as name and $count as member count";
helpInformation["welcome-stop"] = "Stops the welcome messages. Turn back on with setup!"
helpInformation["leave-setup"] = "Sets user leave channel ID";
helpInformation["leave-message"] = "Sets leave Message with $name as name and $count as member count";
helpInformation["leave-stop"] = "Stops the leave messages. Turn back on with setup!";
helpInformation["clear"] = "clear a number of messages with this command!";
helpInformation["prof"] = "toggles profanity filter!";
helpInformation["startflow"] = "Starts a flow of memes in a channel!";
helpInformation["stopflow"] = "Stops a flow of memes in a channel!";
helpInformation["fml"] = "Gives a random fml";
helpInformation["meme"] = "one. single. meme.";
helpInformation["swears"] = "Configures swear lists. Enable filter with the `prof` command. Has options `add`, `remove`, `list`, `clear`, or `reset`.";

const SDM = require("../server-data-manager");
const { RichEmbed } = require("discord.js");

/**
 * 
 * @name help
 */
exports.run = async function(client, channel, args, msg) {
    data = await SDM.readServerData(channel.guild.id);
    const embed = new RichEmbed();
    embed.setColor(2012);
    switch (args[0]) {
        case "general":
            embed.setTitle("Cordless General Help");
            embed.addField("General Commands", "`help, prechange, ping, addanoun`");
            break;
        case "music":
            embed.setTitle("Cordless Music Help");
            embed.addField("Music Commands", "`play, pause, resume, queue, skip, loop, setvol, search, clearqueue, np, leavemus`");
            break;
        case "mod":
            embed.setTitle("Cordless Moderation Help");
            embed.addField("Moderation Commands", "`mute, prof, swears`");
            break;
        case "util":
            embed.setTitle("Cordless Utility Help");
            embed.addField("Utility Commands", "`clear, embed, welcome-message, welcome-setup, welcome-stop, leave-message, leave-setup, leave-stop`");
            break;
        case "mem":
            embed.setTitle("Cordless Meme Help");
            embed.addField("Meme Commands", "`startflow, stopflow, meme, xkcd`");
            break;
        default:
            if(helpInformation.hasOwnProperty(args[0])) {
                embed.setTitle(args[0]);
                embed.setDescription(helpInformation[args[0]]);
            } else {
                embed.setTitle("Cordless Help");
                embed.setDescription("For a full set of commands and descriptions visit https://cordless.enenra.org/documentation \n \n Your prefix is **" + data.prefix + "**");
                embed.addField("General", `For more info on general commands, try \`${data.prefix}help general\``);
                embed.addField("Music", `For more info on music commands, try \`${data.prefix}help music\``);
                embed.addField("Moderation", `For more info on moderation commands, try \`${data.prefix}help mod\``);
                embed.addField("Utility", `For more info on utitlity commands, try \`${data.prefix}help util\``);
                embed.addField("Memes", `For more info on meme commands, try \`${data.prefix}help mem\``);
            }
    }
    channel.send({ embed });
};