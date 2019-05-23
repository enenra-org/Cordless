exports.readServerData = function (guildID) {
    var data = require("./data/server-data.json");
    if (data.hasOwnProperty(guildID)) {
        return data[guildID];
    } else {
        return {
            "welcomeMessages": {
                "welcomeChannelID": "",
                "welcomeMessageEnabled": false,
                "mess": ""
            },
            "leaveMessages": {
                "leaveChannelID": "",
                "leaveMessageEnabled": false,
                "mess": ""
            },
            "profanity": false,
            "mute": {
                "roleID": ""
            },
            "reactions": {
                "counter": 0,
                "enabled": false
            }
        }
    }
}
exports.achan = function (thing, channel) {
    var data = require("./data/server-data.json");
    if (thing == "add") {
        data.announcementChannels[String(data.announcementChannels.count)] = channel;
        data.announcementChannels.count++;
        var json = JSON.stringify(data);
        var fs = require("fs");
        fs.writeFile("./data/server-data.json", json, "utf8", function (e) {
            console.log(e);
        });
    } else {
        return data.announcementChannels;
    }
}
exports.saveServerData = function (guildID, newData) {
    var data = require("./data/server-data.json");
    data[guildID] = newData;
    console.log("Here")
    var json = JSON.stringify(data);
    var fs = require("fs");
    fs.writeFile("./data/server-data.json", json, "utf8", function (e) {
        console.log(e);
    });
}