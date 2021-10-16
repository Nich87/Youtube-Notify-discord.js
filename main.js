const Discord = require("discord.js");
const ytn = new Discord.Client();

ytn.db = require("quick.db");
ytn.request = new (require("rss-parser"));
ytn.config = require("./config.js");

ytn.once("ready", () => {
handleUploads();
ytn.user.setActivity('@holo_kiri | Youtube', {
        type: 'WATCHING'
    });
    console.info("Wathing Start.");
});

function handleUploads() {
    if (ytn.db.fetch(`postedVideos`) === null) ytn.db.set(`postedVideos`, []);
    setInterval(() => {
        ytn.config.channel_id.forEach((ids)=>{
        ytn.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${ids}`)
        .then(data => {
            if (ytn.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
                ytn.db.set(`videoData`, data.items[0]);
                ytn.db.push("postedVideos", data.items[0].link);
                let parsed = ytn.db.fetch(`videoData`);
                let channel = ytn.channels.cache.get(ytn.config.channel);
                if (!channel) return;
                let message = ytn.config.messageTemplate
                    .replace(/{author}/g, parsed.author)
                    .replace(/{title}/g, discord.Util.escapeMarkdown(parsed.title))
                    .replace(/{url}/g, parsed.link);
                channel.send(message);
            }//else
        });//then
    });
}, ytn.config.Interval);
}//handleUpload

ytn.login(process.env.token);
