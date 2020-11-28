const Discord = require('discord.js');
const { getMaxListeners } = require('process');
const bot = new Discord.Client();

const token = 'Nzc5MDI0NDU5Mzk0MzE4Mzc2.X7ahEA.emc4jBlcXjArcJKAezQDeXWbvPA';

NPepe = 0;

var pepilink = new Array();

const PREFIX = '!'

const help = "Ecco una lista dei comandi:\n\
"+PREFIX+"help -> fornisce la lista dei comandi\n\
"+PREFIX+"flip -> lancia una moneta\n\
"+PREFIX+"roll -> lancia un D30\n\
"+PREFIX+"clear n -> cancella n messaggi dal canale corrente\n\
"+PREFIX+"pepe -> restituisce un pepe casuale";


const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  

  authorize(JSON.parse(content), listPepe);
});




function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));

    //callback(oAuth2Client);
    callback(oAuth2Client,'1woESiXsG4hEZo56AZf-QdVmdPtv3Xvjp')
  });
}


function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


function listPepe(auth,fileId)
{
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 1000,
    includeRemoved: false,
    spaces: 'drive',
    fileId: fileId,
    fields: 'nextPageToken, files(id, name, parents, mimeType, modifiedTime)',
    q: `'${fileId}' in parents`
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          console.log('adding '+file.id);
          pepilink.push('https://drive.google.com/file/d/'+file.id+'/view');
          NPepe++;
        });
      } else {
        console.log('No files found.');
      }
    });
}


//Funzioni del bot


bot.on('ready',()=>{
    console.log('Bot Online');
});

const admin = 'Gimbaro';




function flip(msg){
    if(Math.round(Math.random()*2)==1 )
        msg.reply("TESTA");
    else
        msg.reply("CROCE");
}

function pepe(msg){

  linkPepe=pepilink[Math.round(Math.random()*NPepe)];
  msg.reply('Dal nostro archivio di '+NPepe+' pepe abbiamo trovato questo: '+linkPepe);
}



bot.on('message', message=>{
    
  let args = message.content.substring(PREFIX.length).split(" ");

  switch(args[0]){
      case 'help':
          message.channel.send(help)
          break;
      case 'flip':
          flip(message)
          break;
      case 'roll':
          message.reply(Math.round(Math.random()*29)+1)
          break;
      case 'clear':
          if(!args[1]) return message.reply('Definisci quanti messaggi vuoi cancellare')
          if(message.author.username != admin) return message.reply('Non sei autorizzato a cancellare messaggi')
          message.channel.bulkDelete(args[1]);
          break;
      case 'pepe':
          pepe(message);
          break;
      case 'fuck':
          message.reply('come ti permetti? 1v1 creativa')
          break;
  }
})

bot.login(token);