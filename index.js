// Require Packages 
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');

// Constant Variables
const prefix = '-'; 
const ownerID = 'ownerID'; 

// We need to create an object containing the serverStats info
const serverStats = {
    guildID: 'guildID',
    totalUsersID: 'channelID',
    memberCountID: 'channelID',
    botCountID: 'channelID'
}; // This is so we can edit the channel titles, using the ID

// Statuses
let statuses = ['Codeblock', 'Development', 'In Development!', 'Node.js'];

// The rest of our code will be contained in a client.on event
client.on('ready', () => { 

    // Setting the interval
    setInterval(function() {

        // Fetch random item in the array
        let status = statuses[Math.floor(Math.random()*statuses.length)];

        // Stable:
        client.user.setPresence({ game: { name: status }, status: 'online' });

        // Master:
        //client.user.setPresence({ activity: { name: status }, status: 'online' }); // Only chose the one you are using

    }, 100000) // This runs the interval every 100000ms, or 100 seconds. - Now, let's test it!

})

// Listener Events
client.on('message', message => {
    // This runs whenever a message is received


    // Variables
    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();

    // Now, we have two variables.  cmd contains the command following the prefix
    // args contains everything following that and splits it into an array by slices

    // Return Statements
    if (message.author.bot) return; // This will ignore all bots
    if (!message.content.startsWith(prefix)) return; // This will run if the message doesn't starts with the prefix

    // Command Handler
    try {

        // Auto-Reload
        delete require.cache[require.resolve(`./commands/${cmd}.js`)]; 

        // Options
        let ops = {
            ownerID: ownerID
        }

        let commandFile = require(`./commands/${cmd}.js`); // This will require a file in the commands folder
        commandFile.run(client, message, args, ops); // This will pass three variables into the file

    } catch (e) { // This will catch any errors, either withing the code or if the command doesn't exist/ wasn't found.
        console.log(e.stack);
    }

});

// Ready Event - Bot Online / Bot started
client.on('ready', () => console.log('Bot Launched!'));

// We to create 2 listener events, one for a member leaving the server, and one for the member joining a server
client.on('guildMemberAdd', member => {

    // We also want to return if the member's guild isn't the same as the one with serverStats
    if (member.guild.id !== serverStats.guildID) return;

    // Now, we want to update the voiceChannel names
    client.channels.get(serverStats.totalUsersID).setName(`Total Users : ${member.guild.memberCount}`);
    client.channels.get(serverStats.memberCountID).setName(`Member Count : ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(serverStats.botCountID).setName(`Bot Count : ${member.guild.members.filter(m => m.user.bot).size}`);

});

client.on('guildMemberRemove', member => {

    if (member.guild.id !== serverStats.guildID) return;

    // We also want the same thing to happen when a member leaves the guild
    client.channels.get(serverStats.totalUsersID).setName(`Total Users : ${member.guild.memberCount}`);
    client.channels.get(serverStats.memberCountID).setName(`Member Count : ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(serverStats.botCountID).setName(`Bot Count : ${member.guild.members.filter(m => m.user.bot).size}`);

}); 

// Discord Login 
client.login('TOKEN'); 