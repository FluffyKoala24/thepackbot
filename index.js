const botconfig = require("./botconfig.json");
const Discord = require("discord.js")

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () =>{
    console.log(`${bot.user.username} is geactiveerd`);
    bot.user.setActivity("(/Help <= IN AANBOUW) || Waiting For the end of prgramming", {type:"WATCHING"});
});

bot.on("message", async message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);


    if(cmd == `${prefix}help`){
        let helpEmbed = new Discord.RichEmbed()
        .setDescription("Help")
        .setColor("RANDOM")
        .addField(`${prefix}kick`, "Kicked de mentioned gebruiker")
        .addField(`${prefix}ban`, "Banned de mentioned gebruiker")
        .addField( `${prefix}Warn`, "Waarschuwd de metioned gebruiker")
        .addField(`${prefix}YeetusDeleetus`, "verwijderd het maximaal opgeven berichten")
        .addField(`${prefix}nieuw`, "Maakt een ticket aan")
        .addField(`${prefix}sluit`, "Sluit de huidige ticket")
        .addField(`${prefix}help`, "Laat de help pagina zien")

        return message.channel.send(helpEmbed);
     }





    if(cmd === `${prefix}sluit`){
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);
        // Confirm delete - with timeout (Not command)
        message.channel.send(`Weet je het zeker? Eenmaal bevestigd, kunt u deze actie niet ongedaan maken! ** Type: confirm** om te bevestigen. Dit zal na 10 seconden een time-out geven en worden geannuleerd`)
            .then((m) => {
                message.channel.awaitMessages(response => response.content === '/confirm', {
                        max: 1,
                        time: 10000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        message.channel.delete();
                    })
                    .catch(() => {
                        m.edit('Ticket close timed out, de ticket was niet gesloten.').then(m2 => {
                            m2.delete();
                        }, 3000);
                    });
            });
    }

    if(cmd === `${prefix}nieuw`){

        const reason = message.content.split(" ").slice(1).join(" ");
        if (!message.guild.roles.exists("name", "Support Staff")) return message.channel.send(`Deze server heeft geen \` Support Staff \`-rol gemaakt, dus het ticket zal niet worden geopend. Als u een beheerder bent, maak er dan een met die naam precies en geef deze aan gebruikers die in staat moeten zijn om te zien tickets.`);
        if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`Je hebt al een ticket open.`);
        message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
            let role = message.guild.roles.find("name", "Support Staff");
            let role2 = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`: white_check_mark: uw ticket is aangemaakt, #${c.name}.`);
            const embed = new Discord.RichEmbed()
                .setColor(0xCF40FA)
                .addField(`Hey ${message.author.username}!`, `Probeer uit te leggen waarom je dit ticket zo gedetailleerd mogelijk hebt geopend. Onze ** Support sstaf ** zal binnenkort beschikbaar zijn om te helpen.`)
                .setTimestamp();
            c.send({
                embed: embed
            });
        }).catch(console.error); // Send errors to console
    }


    if(cmd === `${prefix}ban`) {
        // Most of this command is identical to kick, except that here we'll only let admins do it.
        // In the real world mods could ban too, but this is just an example, right? ;)
        if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
          return message.reply("Sorry, Je hebt geen permissies dit te doen!");
        
        let member = message.mentions.members.first();
        if(!member)
          return message.reply("mention een geldige gebruiker van de server");
        if(!member.bannable) 
          return message.reply("Ik kan deze gebruiker niet verbannen! Hebben ze een hogere rol? Heb ik banpermissies?");
    
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "Geen reden opgegeven";
        
        await member.ban(reason)
          .catch(error => message.reply(`Sorry ${message.author}Ik kon niet bannen vanwege : ${error}`));
        message.reply(`${member.user.tag} is verbannen door $ {message.author.tag} omdat: ${reason}`);
      }
      

    if(cmd == `${prefix}warn`){
        // Assuming we mention someone in the message, this will return the user
        // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
        const user = message.mentions.users.first();
        // If we have a user mentioned
        if (user) {
          // Now we get the member from the user
          const member = message.guild.member(user);
          // If the member is in the guild
          if (member) {
            /**
             * Kick the member
             * Make sure you run this on a member, not a user!
             * There are big differences between a user and a member
             */
            member.kick('Optional reason that will display in the audit logs').then(() => {
              // We let the message author know we were able to kick the person
              message.reply(`Successvol ${user.tag} Gewarnd`);
            }).catch(err => {
              // An error happened
              // This is generally due to the bot not being able to kick the member,
              // either due to missing permissions or role hierarchy
              message.reply('Ik kan de member niet warnen');
              // Log the error
              console.error(err);
            });
          } else {
            // The mentioned user isn't in this guild
            message.reply('De gebruiker is niet in de server!');
          }
        // Otherwise, if no user was mentioned
        } else {
          message.reply('Je hebt geen gebruiker gementioned om te warnen!');
        }
      }


 
        if(cmd == `${prefix}kick`)   {
        // Assuming we mention someone in the message, this will return the user
        // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
        const user = message.mentions.users.first();
        // If we have a user mentioned
        if (user) {
          // Now we get the member from the user
          const member = message.guild.member(user);
          // If the member is in the guild
          if (member) {
            /**
             * Kick the member
             * Make sure you run this on a member, not a user!
             * There are big differences between a user and a member
             */
            member.kick('Optional reason that will display in the audit logs').then(() => {
              // We let the message author know we were able to kick the person
              message.reply(`Successvol ${user.tag} Gekicked`);
            }).catch(err => {
              // An error happened
              // This is generally due to the bot not being able to kick the member,
              // either due to missing permissions or role hierarchy
              message.reply('Ik kan de member niet kicken');
              // Log the error
              console.error(err);
            });
          } else {
            // The mentioned user isn't in this guild
            message.reply('De gebruiker is niet in de server!');
          }
        // Otherwise, if no user was mentioned
        } else {
          message.reply('Je hebt geen gebruiker gementioned om te kicken!');
        }
      }
    
    if(cmd === `${prefix}report`){
     
     //+report @Fluffy Koala this is the reason

     let rUser = message.guild.member(message.mentions.users.first()|| message.guild.members.get(args[0]));
     if(!rUser) return message.channel.send("Kan De Gebruiker Niet Vinden.");
     let reason = args.join(" ").slice(22);

        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Reports")
        .setColor("#ff0000")
        .addField("Reported Gebruiker", `${rUser} met ID: ${rUser.id}`)
        .addField("Gereport Bij", `${message.author} Met ID: ${message.author.id}`)
        .addField("Kanaal", message.channel)
        .addField("Tijd", message.createdAt)
        .addField("Reden", reason);
        
        let reportschannel = message.guild.channels.find(`name`, `modlogs`);
        if(!reportschannel) return message.channel.send("Kan modlogs Kanaal Niet Vinden.");

        message.delete().catch(O_o=>{})
        reportschannel.send(reportEmbed);

        return;
    }



    if(cmd === `${prefix}serverinfo`){

       let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setDescription("Server Informatie")
        .setColor("#ff8800")
        .setThumbnail(sicon)
        .addField("Server Naam", message.guild.name)
        .addField("Gemaakt Op", message.guild.createdAt)
        .addField("U Bent Gejoined Op", message.member.joinedAt)
        .addField("Totaal Aantal Leden", message.guild.memberCount);

        return message.channel.send(serverembed);
    }

    if(cmd === `${prefix}botinfo`){

        let bicon = bot.user.displayAvatarURL;
     let botembed = new Discord.RichEmbed()
     .setDescription("Bot Inormation")
     .setColor("#00fff4")
     .setThumbnail(bicon)
     .addField("Bot naam", bot.user.username)
     .addField("Gemaakt op", bot.user.createdAt);

     return message.channel.send(botembed);
    }

    if(cmd === `${prefix}say`) {
        if(!args[0]) return message.reply("Correct Gebruik /say <tekst hier>");
        var say = message.content.slice(5);
        message.delete(1000);
        message.channel.send(say);
    }
});

bot.login(botconfig.token)
