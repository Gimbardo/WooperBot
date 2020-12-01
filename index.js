const Discord = require('discord.js');
const { getMaxListeners } = require('process');
const bot = new Discord.Client();


/**
 * Simple sleep function to solve async problems. It can be solved in a better
 * way, but i choose this because i dont have what in Italy we call "sbatta"
 */
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}



NPepe = 0;

/**
 * Array where we'll store links for the !pepe command
 */
var pepilink = new Array();

/**
 * With !pepe we'll send a randomized child of this GoogleDrive Folder
 */
const idPepeFolder = '1woESiXsG4hEZo56AZf-QdVmdPtv3Xvjp';

/**
 * Prefix for our commands
 */
const PREFIX = '!'

/**
 * !help for this list to be sent from your bot
 */
const help = "Ecco una lista dei comandi:\n\
"+PREFIX+"help -> fornisce la lista dei comandi\n\
"+PREFIX+"flip -> lancia una moneta\n\
"+PREFIX+"roll -> lancia un D30 di default \n\
"+"e\' possibile aggiungere un argomento per definire il roll massimo \n\
"+PREFIX+"clear n -> cancella n messaggi dal canale corrente\n\
"+PREFIX+"pepe -> restituisce un pepe casuale\n\
"+PREFIX+"fox -> restituisce un biscotto della fortuna generato casualmente\n\
"+PREFIX+"1v1 -> sfidi il bot in un roll casuale da 0 a 100";



const readline = require('readline');
const {google} = require('googleapis');
const { waitForDebugger } = require('inspector');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const fs = require('fs') 

/**
 * Secret token, that we read from token.txt, located in our project folder
 */
token='';




 /**
  * Sync to FIRST read the file, and THEN trying the token that we 
  */
  token = fs.readFileSync('token.txt', 'utf8');


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

    callback(oAuth2Client,idPepeFolder)
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
          //console.log('adding '+file.id);
          pepilink.push('https://drive.google.com/file/d/'+file.id+'/view');
          NPepe++;
        });
      } else {
        console.log('No files found.');
      }
      console.log('added '+NPepe+' pepe');
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

function roll1ton(n)
{
  return Math.round(Math.random()*(n-1))+1
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
        if(!args[1]) 
          return message.reply('Hai rollato '+roll1ton(30)+' su '+30);


        if(!Number.isInteger(parseInt(args[1])))
          return message.reply('Necessario un numero intero come secondo paramentro :)');
        
        return message.reply('Hai rollato '+roll1ton(args[1])+' su '+args[1]);
          break;
      case 'clear':
          if(!args[1]) return message.reply('Necessario definire il numero di messaggi da cancellare :)')
          if(message.author.username != admin) return message.reply('Non sei autorizzato a cancellare messaggi :)')
          message.channel.bulkDelete(args[1]);
          break;
      case 'pepe':
          pepe(message);
          break;
      case 'fuck':
          message.reply('come ti permetti? 1v1 creativa')
          break;
      case '1v1':
          risuser=roll1ton(100);
          risbot=roll1ton(100);
          if(risbot>risuser)
            return message.reply('fai schifo: ho fatto '+risbot+' mentre tu solo '+risuser+': EZ');
          if(risbot<risuser)
            return message.reply('ho fatto '+risbot+' e tu '+risuser+': GG');
          if(risuser==risbot)
            return message.reply('abbiamo fatto entrambi '+risbot+': REMATCH?');
          break;
      case 'buonanotte':
          message.channel.send('notte notte <3');
          break;
      case 'fox':
          execFile = require('child_process').execFile;
          execFile('./PaoloFox',['-ltr'],(e,stdout,stderr)=>{
          if(e instanceof Error){
            console.error(e);
            throw e;
          }
            message.reply(stdout);
          })
          break;
  }
})

bot.login(token);