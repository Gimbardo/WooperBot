const Discord = require('discord.js');
const { getMaxListeners, disconnect } = require('process');
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


//FUCK YOU JAVASCRIPT
//0 -> pepe 1-> pokemon
let Nval = new Array();
Nval.push(0)
Nval.push(0)

/**
 * Array where we'll store links for the !pepe command
 */
var pepilink = new Array();
var pokemonlink = new Array();

/**
 * With !pepe we'll send a randomized child of this GoogleDrive Folder
 */
const idPepeFolder = '1woESiXsG4hEZo56AZf-QdVmdPtv3Xvjp';
const idPokemonWithHatFolder = '1proETQv6K1Wpg_7im79CCuSolq0383N6';

/**
 * Prefix for our commands
 */
const PREFIX = '!'

const sounds = ["directedby","cagatapazz","surprise","badumtss","femaleorgasm","coccodrillo","impmarch","retard","potter","lionsleeps","whyrunning","nigerundayo","bruh", "fbi", "marcello","noot", "omaewamou", "sad", "shrek", "stonks", "xpstartup", "yeet","ph","jeff","zawarudo","niconico","c4","discall"];

function soundsToString()
{
  stringa = sounds[0];
  for(i=1;i<sounds.length;i++)
  {
    stringa=stringa+', '+sounds[i];
  }
  return stringa;
}

stringsounds = soundsToString();
/**
 * !help for this list to be sent from your bot
 */
const help = "\nEcco una lista dei comandi:\n\
"+PREFIX+"help -> fornisce la lista dei comandi\n\
"+PREFIX+"flip -> lancia una moneta\n\
"+PREFIX+"roll -> lancia un D30 di default \n\
"+"e\' possibile aggiungere un argomento per definire il roll massimo \n\
"+PREFIX+"clear n -> cancella n messaggi dal canale corrente\n\
"+PREFIX+"pepe -> restituisce un pepe casuale\n\
"+PREFIX+"pokemon -> restituisce un pokemon casuale con un cappellino: \n\
"+PREFIX+"fox -> restituisce un biscotto della fortuna generato casualmente\n\
"+PREFIX+"sb <suono>-> fa partire il suono scritto, lista dei suoni: \n\
"+stringsounds+"\n\
"+PREFIX+"1v1 -> sfidi il bot in un roll casuale da 0 a 100\n\
:woman_surfing: :woman_surfing: :woman_surfing: ";



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

    callback(oAuth2Client,idPepeFolder, pepilink, 0)
    callback(oAuth2Client, idPokemonWithHatFolder, pokemonlink, 1)
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


function listPepe(auth,fileId,linklist,index)
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
          linklist.push('https://drive.google.com/file/d/'+file.id+'/view');
          Nval[index]++;
        });
      } else {
        console.log('No files found.');
      }
      console.log('added '+Nval[index]+' files');
    });
}


//Funzioni del bot


bot.on('ready',()=>{
    console.log('Bot Online');
});

const admin = 'Gimbaro';

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
 function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function pepe(msg){

  linkPepe=pepilink[getRandomInt(0,Nval[0]-1)];
  msg.reply('Dal nostro archivio di '+Nval[0]+' pepe abbiamo trovato questo :frog:\n'+linkPepe);
}

function pokemon(msg){

  linkPokemon=pokemonlink[getRandomInt(0,Nval[1]-1)];
  msg.reply('Dal nostro archivio di '+Nval[1]+' pokemon abbiamo trovato questo :rat: :zap: :tophat:\n'+linkPokemon);
}



async function playFile(path,msg)
{

  isReady = false;
  channel =  msg.member.voice.channel;
  if(channel === null){
    return;
  }
  connection = await channel.join();
  
  connection.play(path);
}


bot.on('message', message=>{

if(message.content.charAt(0) === "!")
{
  let args = message.content.substring(PREFIX.length).split(" ");

  switch(args[0]){
      case 'help':
          message.channel.send(help)
          break;
      case 'flip':
          if(getRandomInt(0,1)==1 )
            message.reply("TESTA :o:");
          else
            message.reply("CROCE :x:");
          break;
      case 'roll':
        if(!args[1]) 
          return message.reply('Hai rollato '+getRandomInt(1,30)+' su '+30+' :game_die:');


        if(!Number.isInteger(parseInt(args[1])) || parseInt(args[1])<0)
          return message.reply('Necessario un numero intero maggiore di 0 come secondo paramentro :upside_down:');
        
        message.reply('Hai rollato '+getRandomInt(1,parseInt(args[1]))+' su '+parseInt(args[1])+' :game_die:');
          break;
      case 'clear':
          if(message.channel.type === 'dm')
            return message.reply('Non posso cancellare i messaggi in chat privata sciocchino :hot_face:')
          if(!args[1] || parseInt(args[1])>99 || parseInt(args[1])<1)
            return message.reply('Necessario definire un numero di messaggi da cancellare positivo e <=99 :upside_down:')
          if(!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply('Non sei autorizzato a cancellare messaggi :upside_down:')
          message.channel.bulkDelete(parseInt(args[1])+1);
          break;
      case 'pepe':
          pepe(message);
          break;
      case 'pokemon':
          pokemon(message);
          break;
      case 'fuck':
          message.reply('come ti permetti? 1v1 creativa :ice_cube:')
          break;
      case '1v1':
          risuser=parseInt(1,100);
          risbot=parseInt(1,100);
          if(risbot>risuser)
            return message.reply('fai schifo: ho fatto '+risbot+' mentre tu solo '+risuser+': EZ :wheelchair:');
          if(risbot<risuser)
            return message.reply('ho fatto '+risbot+' e tu '+risuser+': GG :clown:');
          if(risuser==risbot)
            return message.reply('abbiamo fatto entrambi '+risbot+': REMATCH? :eyes:');
          break;
      case 'buonanotte':
          message.channel.send('notte notte :heart:');
          break;
      case 'fox':
          execFile = require('child_process').execFile;
          execFile('./PaoloFox',['-ltr'],(e,stdout,stderr)=>{
          if(e instanceof Error){
            console.error(e);
            throw e;
          }
            message.reply('\n:sparkles::sparkles::sparkles:\n'+stdout+'\n:sparkles::sparkles::sparkles:');
          })
          break;
      case 'sb':
        if(!args[1])
          return message.reply('devi inserire il nome del suono da riprodurre,\nEccoti la lista :monkey::\n'+stringsounds);
        if(sounds.indexOf(args[1]) >= 0)
          playFile('.\\sb\\'+args[1]+'.mp3',message);
        else
          return message.reply('Il suono che hai cercato non esiste :innocent:\nDigita !sb per una lista dei suoni:alien:');
        break;
      case 'gambero':
        return message.channel.send("Hai rotto il cazzo Alex");
        break;
      }
  }
})

bot.login(token);