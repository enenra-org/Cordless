const discord = require('discord.js');
const privateConfig = require("./private_data/config.json");
const commands = require("./commands");
const snekfetch = require('snekfetch');
const SDM = require('./server-data-manager');
const express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser({limit: '50mb'}));
const Music = require('discord.js-musicbot-addon-v2');
const memechan = ["https://www.reddit.com/r/dankmemes/rising/.json", "https://www.reddit.com/r/me_irl/rising/.json", "https://www.reddit.com/r/memes/rising/.json"];
const badwords = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "bi+ch", "biatch", "bitch", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buttplug", "c0ck", "c0cksucker", "cawk", "clit", "clitoris", "clits", "cnut", "cock", "cok", "cox", "cum", "cunt", "cyalis", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fcuk", "feck", "felching", "flange", "fook", "fooker", "fuck", "fuk", "fux", "f_u_c_k", "gaysex", "hell", "hoar", "hoer", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jerk-off", "kock", "kondum", "kum", "kunilingus", "l3i+ch", "l3itch", "labia", "lusting", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "porn", "porno", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shi+", "shit", "skank", "slut", "sluts", "smegma", "smut", "snatch", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "testical", "testicle", "tit", "vagina", "whoar", "whore"];
const testChannel = "575022379756027904";
const client = new discord.Client();
rip = false;
const music = new Music(client, {
    youtubeKey: privateConfig.youtube,
    prefix: "&",
    maxQueueSize:9999,
    anyoneCanSkip: true,
    helpCmd: "helpmusic",
    loopCmd: "loop",
    playCmd: "play",
    skipCmd: "skip",
    queueCmd: "queue",
    enableQueueStat: true,
    pauseCmd: "pause",
    resumeCmd: "resume",
    volumeCmd: "setvol",
    leaveCmd: "leavemus",
    searchCmd: "search",
    
});
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});

client.on("raw", (packet) => {
    if (packet.t != "MESSAGE_REACTION_ADD") { return }
    data = SDM.readServerData(packet.d.guild_id);
    console.log(packet);
    count = 0;
    while (count < data.reactions.count && data.reactions.enabled) {
        console.log("IN TH EWHILE LOOP");
        try {
        if (packet.d.emoji.name == data.reactions[String(count)].reaction && packet.d.message_id == data.reactions[String(count)].messageID) {
            console.log("MOOP TRIGGERED");
            console.log(String(data.reactions[String(count)].roleID));
            client.guilds.get(packet.d.guild_id).members.get(packet.d.user_id).addRole(data.reactions[String(count)].roleID)
                .then(console.log)
                .catch(console.log);
        };
    } catch {
        console.log('lol an error occured');
    }
        count += 1;
    }
});
client.on('ready', () => {
    console.log('Cordless on and connected');
    client.user.setActivity(String(client.guilds.size) + " servers | cordless.enenra.org", { type: 'PLAYING' })
    try {
        client.channels.get(testChannel).send('Bot Operational');
    } catch {
        console.log("This is not debug mode..... yeet");
    }
});

client.on('message', (msg) => {
    if (msg.guild == null || msg.author.bot) { return }
    data = SDM.readServerData(msg.member.guild.id);
    if (msg.author.bot && !msg.channel.nsfw) {
        checker = msg.content.toLowerCase();
        for (i = 0; i < badwords.length; i++) {
            if (checker.includes(badwords[i])) {
                msg.delete(1);
                msg.channel.send("nope");
            }
        }
    }
    if ((!msg.content.startsWith("&") && data.profanity) && !msg.author.bot && !msg.channel.nsfw) {
        checker = msg.content.toLowerCase();
        for (i = 0; i < badwords.length; i++) {
            if (checker.includes(badwords[i])) {
                msg.delete(1);
                msg.channel.send(":rage: NO CURSING!! :rage: ");
            }
        }
    } else if (msg.content == "&startflow") {
        msg.channel.send("THE MEMEFLOW HAS BEGUN!!!!!!!!!!!!!!!(**Warning! Possible NSFW content**)")
        mannn = setInterval(function () {
            thingy(client, msg)
            if (rip) {
                msg.channel.send("STOPPPEDDDD!!!!");
                rip = false;
                clearInterval(mannn);
            }
        }, 10000);
    } else if (msg.content == "&stopflow") {
        rip = true;
        msg.channel.send("Memeflow will soon stop....")
    } else if (msg.content == "&meme") {
        thingy(client, msg);
    }
    console.log(data.prefix);
    if (msg.content.startsWith(data.prefix)) {
        messy = msg.content.slice(data.prefix.length);
        args = messy.split(" ");
        command = args.shift();
        command = command.toLowerCase();
        commands.runCommand(command, args, msg.channel, client, msg);
    }
});
client.on('guildMemberAdd', member => {
    data = SDM.readServerData(member.guild.id);
    if (data.welcomeMessages.welcomeMessageEnabled === true) {
        if ((member.guild.memberCount % 10) == 1) {
            pref = "st";
        } else if ((member.guild.memberCount % 10) == 2) {
            pref = "nd";
        } else if ((member.guild.memberCount % 10) == 3) {
            pref = "rd";
        } else {
            pref = "th";
        }
        message = data.welcomeMessages.mess
        message = message.replace("$name", member.displayName);
        message = message.replace("$count", member.guild.memberCount + pref);
        member.guild.channels.get(data.welcomeMessages.welcomeChannelID).send(message);
    } else {
        return;
    }
});
client.on('guildMemberRemove', member => {
    data = SDM.readServerData(member.guild.id);
    if (data.leaveMessages.leaveMessageEnabled === true) {
        if ((member.guild.memberCount % 10) == 1) {
            pref = "st";
        } else if ((member.guild.memberCount % 10) == 2) {
            pref = "nd";
        } else if ((member.guild.memberCount % 10) == 3) {
            pref = "rd";
        } else {
            pref = "th";
        }
        message = data.leaveMessages.mess
        message = message.replace("$name", member.displayName);
        message = message.replace("$count", member.guild.memberCount + pref);
        member.guild.channels.get(data.leaveMessages.leaveChannelID).send(message);
    } else {
        return;
    }
});
thingy = async (client, message) => {
    try {
        x = rand(0, 2)
        console.log(x);
        if (x == 0) {
            fix = "r/dankmemes"
        } else if (x == 1) {
            fix = "r/me_irl"
        } else if (x == 2) {
            fix = "r/memes"
        }
        const { body } = await snekfetch
            .get(memechan[x])
            .query({ limit: 800 });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length)
        const embed = new discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle(allowed[randomnumber].data.title)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
            .setFooter("Memes provided by " + fix)
        message.channel.send(embed)
    } catch (err) {
        return console.log(err);
    }
}
function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
app.post('/announcement',(req,res) => {
    let buff = Buffer.from(req.headers.authorization.split(" ")[1], 'base64');  
    let text = buff.toString('ascii');
    if (text.split(":")[1] == privateConfig.announceToken) {
        console.log('yeeted');
        res.json("authe?");
        channels = SDM.achan(null,null,null);
        x = 0;
        while (x<channels.count) {
            console.log(x);
            try {
            client.channels.get(channels[String(x)].channel).send(req.body.msg);
            } catch {
                console.log("skipping dat number")
            }
            x++;
        }
    } else {
        res.json("NON AUTHE??>!??!?!?");
    }
});
client.login(privateConfig.token);
app.listen(process.env.PORT || 3000,function() {
    console.log('Cordless has started to listen on port 3000');
});