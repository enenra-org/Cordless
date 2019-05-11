const discord = require('discord.js');
const privateConfig = require("./private_data/config.json");
const commands = require("./commands");
const snekfetch = require('snekfetch');
const SDM = require('./server-data-manager');
const testChannel = "575022379756027904";
const Music = require('discord.js-musicbot-addon-v2');
const memechan = ["https://www.reddit.com/r/dankmemes/hot/.json", "https://www.reddit.com/r/me_irl/hot/.json", "https://www.reddit.com/r/memes/hot/.json"];
const badwords = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
const client = new discord.Client();
rip = false;
const music = new Music(client, {
    youtubeKey: privateConfig.youtube,
    prefix: "&",
    djRole: "team",
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
    searchCmd: "search"
});

client.on('ready', () => {
    console.log('Tecton bot on and connected');
    client.user.setActivity('&help cordless.tecton.tech', { type: 'PLAYING' })
    try {
        client.channels.get(testChannel).send('Bot Operational');
    } catch {
        console.log("This is not debug mode..... yeet");
    }
});

client.on('message', (msg) => {
    data = SDM.readServerData(msg.member.guild.id);
    if (msg.author.bot) {
        return;
    }
    if ((!msg.content.startsWith("&") && data.profanity) && !msg.author.bot) {
        checker = msg.content.toLowerCase();
        for (i = 0; i < badwords.length; i++) {
            if (checker.includes(badwords[i])) {
                msg.delete(1);
                msg.channel.send(":rage: NO CURSING!! :rage: ");
            }
        }
    } else if (msg.content == "&startflow") {
        msg.channel.send("THE MEMEFLOW HAS BEGUN!!!!!!!!!!!!!!!")
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
    if (msg.content.startsWith("&")) {
        messy = msg.content.slice(1);
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
client.login(privateConfig.token);