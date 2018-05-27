"use strict";
const Discord = require("discord.js");
const discordBotEvents = require("discord.js-bot-events");

var discord = new Discord.Client({autoreconnect: true});
var commands = {};

discord.login(process.env.TOKEN);
discord.on('ready', function(){
	discord.guilds.every(guild => discordBotEvents.register(guild));
});


function infoAction(message,action,target,reason){
	return target.send(message.author.toString()+" has issued a "+action+" to you on "+message.guild.toString()+".```"+reason+"```");
}
function broadcastAction(message,action,target,reason){
	return message.channel.send(message.author.toString()+" has issued a "+action+" to "+target.toString()+".```"+reason+"```");
}

function logAction(message,action,target,color,reason){
	var channel = message.guild.channels.find("name","moderation-log");
	return channel.send({
		"embed": {
			"color": color,
			"timestamp": new Date(),
			"footer": {
			"icon_url": message.author.avatarURL.toString(),
			"text": message.author.tag
			},
			"fields": [
			{
				"name": "Action",
				"value": action
			},
			{
				"name": "User",
				"value": target.tag +" ("+target.id+")"
			},
			{
				"name": "Reason",
				"value": reason
			},
			{
				"name": "Channel",
				"value": message.channel.toString()
			}
			]
		}
	});
}

commands["warn"] = function(message,reason){
	if(!message.member.hasPermission("KICK_MEMBERS")) return;
	message.mentions.users.every(function(target){
		infoAction(message,"warning",target,reason).catch(console.error);
		broadcastAction(message,"warning",target,reason).catch(console.error);
		logAction(message,"Warning",target,16312092,reason).catch(console.error);
		message.guild.emit("warn",target.id,reason);
	});
}

commands["kick"] = function(message,reason){
	if(!message.member.hasPermission("KICK_MEMBERS")) return;
	message.mentions.users.every(function(target){
		message.guild.fetchMember(target.id).then(function(member){
			infoAction(message,"kick",target,reason).catch(console.error);
			broadcastAction(message,"kick",target,reason).catch(console.error);"use strict";
const Discord = require("discord.js");
const discordBotEvents = require("discord.js-bot-events");

var discord = new Discord.Client({autoreconnect: true});
var commands = {};


discord.login(process.env.TOKEN);
discord.on('ready', function(){
	discord.guilds.every(guild => discordBotEvents.register(guild));
});


function infoAction(message,action,target,reason){
	return target.send(message.author.toString()+" has issued a "+action+" to you on "+message.guild.toString()+".```"+sanitizeMessage(message,reason)+"```");
}
function broadcastAction(message,action,target,reason){
	return message.channel.send(message.author.toString()+" has issued a "+action+" to "+target.toString()+".```"+sanitizeMessage(message,reason)+"```");
}

function logAction(message,action,target,color,reason){
	var channel = message.guild.channels.find("name","moderation-log");
	return channel.send({
		"embed": {
			"color": color,
			"timestamp": new Date(),
			"footer": {
			"icon_url": message.author.avatarURL.toString(),
			"text": message.author.tag
			},
			"fields": [
			{
				"name": "Action",
				"value": action
			},
			{
				"name": "User",
				"value": target.tag +" ("+target.id+")"
			},
			{
				"name": "Reason",
				"value": reason
			},
			{
				"name": "Channel",
				"value": message.channel.toString()
			}
			]
		}
	});
}

function sanitizeMessage(message,text){
	console.log(text);
	text = text.replace(/<@!?(\d*)>/g, (match,$1) => {
		let member = message.guild.members.get($1);
		return member.user.username+"#"+member.user.discriminator;
	});
	
	message.mentions.channels.every(function(target){
		text = text.replace(new RegExp("<#!?"+target.id+">", 'g'),"#"+target.name);
	});
	message.mentions.roles.every(function(target){
		text = text.replace(new RegExp("<@&"+target.id+">", 'g'),target.name);
	});
	console.log(text);
	return text;
}

commands["warn"] = function(message,reason){
	if(!message.member.hasPermission("KICK_MEMBERS")) return;
	message.mentions.users.every(function(target){
		infoAction(message,"warning",target,reason).catch(console.error);
		broadcastAction(message,"warning",target,reason).catch(console.error);
		logAction(message,"Warning",target,16312092,reason).catch(console.error);
		message.guild.emit("warn",target.id,reason);
	});
}

commands["kick"] = function(message,reason){
	if(!message.member.hasPermission("KICK_MEMBERS")) return;
	message.mentions.users.every(function(target){
		message.guild.fetchMember(target.id).then(function(member){
			infoAction(message,"kick",target,reason).catch(console.error);
			broadcastAction(message,"kick",target,reason).catch(console.error);
			member.kick(reason).then(function(){
				logAction(message,"Kick",target,16098851,reason).catch(console.error);
				message.guild.emit("kick",target.id,reason);
			})
		}).catch(console.error);
	});
}

commands["ban"] = function(message,reason){
	if(!message.member.hasPermission("BAN_MEMBERS")) return;
	message.mentions.users.every(function(target){
		message.guild.fetchMember(target.id).then(function(member){
			infoAction(message,"ban",target,reason).catch(console.error);
			broadcastAction(message,"ban",target,reason).catch(console.error);
			member.ban(reason).then(function(){
				logAction(message,"Ban",target,13632027,reason).catch(console.error);
				message.guild.emit("ban",target.id,reason);
			});
		}).catch(console.error);
	});
}

discord.on("message", function(message) {
	if (message.author.id === discord.user.id || !message.member) return false;
	if(message.content && message.content.startsWith(".")){
		var text = message.content;
		var command = text.substring(1,text.indexOf(" "));
		var args = text.substring(text.indexOf(" ")+1);
		
		if(args != "" && commands.hasOwnProperty(command) && typeof commands[command] == "function"){
			if(args != "" && args != null)
				commands[command](message,args);
		}
		message.delete();
	}
});

process.on('SIGINT', function() {
    console.log("Exiting...");
	setTimeout(function(){ process.exit(); }, 1000);
});
