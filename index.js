const Discord = require('discord.js');
const { getMaxListeners, disconnect } = require('process');
const bot = new Discord.Client();
const fs = require('fs') 
const aws = require('aws-sdk');
const cool = require('cool-ascii-faces');

const guildId = '778632338614517790'

const sys_extension = '.out'
/**
 * Array where we'll store links for the !pepe command
 */
var pepi_files = new Array();
var pokemon_files = new Array();

/**
 * With !pepe we'll send a randomized child of this GoogleDrive Folder
 */
const idPepeFolder = '1woESiXsG4hEZo56AZf-QdVmdPtv3Xvjp';
const idPokemonWithHatFolder = '1proETQv6K1Wpg_7im79CCuSolq0383N6';

/**
 * Prefix for our commands
 */
const PREFIX = '/'

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
"+"pokemon <id> -> restituisce il pokemon con # nel pokedex (1->151) inserito : \n\
"+"pokemon <\"list\"> -> restituisce la lista dei pokemon cappellifati : \n\
"+PREFIX+"fox -> restituisce un biscotto della fortuna generato casualmente\n\
"+PREFIX+"sb <suono>-> fa partire il suono scritto, lista dei suoni: \n\
"+stringsounds+"\n\
"+PREFIX+"1v1 -> sfidi il bot in un roll casuale da 0 a 100\n\
:woman_surfing: :woman_surfing: :woman_surfing: \n\
"+PREFIX+"coolface -> returns a random funny face eheh :alien: \n\
codice: https://github.com/Gimbarone/WooperBot";

const readline = require('readline');
const {google} = require('googleapis');
const { waitForDebugger } = require('inspector');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';



/**
 * Secret token, that we read from token.txt, located in our project folder
 */
var token='';
//token = fs.readFileSync('token.txt', 'utf8'); LOCAL
token = process.env.token


// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   authorize(JSON.parse(content), listFiles);
// });

const discord_credentials = '{"installed": \
  {"client_id":"715758748776-hc1n9kq0b5m1mqvd3201quvci8g72tjd.apps.googleusercontent.com", \
  "project_id":"pepi-1605824592804","auth_uri":"https://accounts.google.com/o/oauth2/auth", \
  "token_uri":"https://oauth2.googleapis.com/token", \
  "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs", \
  "client_secret":'+'"'+ process.env.client_secret+'"'+', \
  "redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}'

authorize(JSON.parse(discord_credentials), listFiles);

async function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
    
    // // Check if we have previously stored a token
    // fs.readFile(TOKEN_PATH, (err, token) => {
    //   if (err) return getAccessToken(oAuth2Client, callback);
    // oAuth2Client.setCredentials(JSON.parse(token));

    oAuth2Client.setCredentials(JSON.parse('{ \
      "access_token":'+'"'+process.env.access_token+'"'+', \
      "refresh_token":'+'"'+process.env.refresh_token+'"'+', \
      "scope":"https://www.googleapis.com/auth/drive", \
      "token_type":"Bearer", \
      "expiry_date":'+'"'+process.env.expiry_date+'"'+' \
    }'));

    
    callback(oAuth2Client, idPokemonWithHatFolder, pokemon_files)
    callback(oAuth2Client,idPepeFolder, pepi_files)
  //});
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

async function listFiles(auth,fileId,filelist)
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
          filelist.push(file)
        });
        if(fileId == idPokemonWithHatFolder)
          sortListPokemon(pokemon_files)
      } else {
        console.log('No files found.');
      }
      console.log('added '+filelist.length+' files');
    });
}

async function sortListPokemon(file_list) {
  file_list.sort((a, b)=>{
    var nameA = a.name
    var nameB = b.name
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

//creazione slash commands

const getApp = (guildId) => {
  const app = bot.api.applications(bot.user.id)
  if (guildId) {
    app.guilds(guildId)
  }
  return app
}

const commandsList = async () => {
  await getApp(guildId).commands.post({
    data: {
      name: 'help',
      description: 'list of commands, useless since slash commands are a thing',
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'flip',
      description: 'flip a coin ',
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'roll',
      description: 'rolls a dice ',
      options: [
        {
          name: 'max_value',
          description: 'max value of the dice, default: 30',
          required: false,
          type: 4,
        },
      ]
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'pepe',
      description: 'returns a random pepe from our archive (link from gdrive) ',
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'pokemon',
      description: 'returns a random pokemon with a hat',
      options: [
        {
          name: 'id',
          description: 'id of the pokemon you want to see, list to display \'em all',
          required: false,
          type: 3,
        },
      ]
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'fuck',
      description: 'don\'t :(',
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: '1v1',
      description: 'challenge this bot in a 1v1 ',
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'buonanotte',
      description: ' :sleeping: ',
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'fox',
      description: 'returns a PaoloFox-generated pseudo random fortune-cookie',
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'sb',
      description: 'reproduce a sound, without arguments it returns a list of available sounds',
      options: [
        {
          name: 'sound_name',
          description: 'name of the sound',
          required: false,
          type: 3,
        },
      ]
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'gambero',
      description: 'basta Alex',
    },
  })
  await getApp(guildId).commands.post({
    data: {
      name: 'coolface',
      description: '(>o.o>)',
    },
  })
}
//Funzioni del bot

const reply = (interaction, response) => {
  bot.api.interactions(interaction.id, interaction.token).callback.post({
    data:{
      type: 4,
      data: {
        content: response
      }
    }
  })
}

bot.on('ready', async ()=>{
  console.log('Bot Online');

  const commands = await getApp(guildId).commands.get()
  
  await commandsList()

  bot.ws.on('INTERACTION_CREATE', async (interaction) => {

    console.log(interaction)

    const {name, options} = interaction.data
    const command = name.toLowerCase()

    const args = {}
    if(options){
      for(const option of options){
        const { name, value } = option
        args[name] = value
      }
    }

    console.log(args)

    switch(command){
      case 'help':
        reply(interaction,help)
        break;
      case 'flip':
        if(getRandomInt(0,1)===1 )
          reply(interaction,"TESTA :o:");
        else
          reply(interaction,"CROCE :x:");
        break;
      case 'roll':
        if(!args['max_value']) 
          return reply(interaction, 'Hai rollato '+getRandomInt(1,30)+' su '+30+' :game_die:');

        if(!Number.isInteger(args['max_value']) || args['max_value']<0)
          return reply(interaction, 'Necessario un numero intero maggiore di 0 come secondo paramentro :upside_down:');
        
        reply(interaction,'Hai rollato '+getRandomInt(1,args['max_value'])+' su '+args['max_value']+' :game_die:');
          break;
      // case 'clear':
      //   if(message.channel.type === 'dm')
      //     return message.reply('Non posso cancellare i messaggi in chat privata sciocchino :hot_face:')
      //   if(!args[1] || parseInt(args[1])>99 || parseInt(args[1])<1)
      //     return message.reply('Necessario definire un numero di messaggi da cancellare positivo e <=99 :upside_down:')
      //   if(!message.member.hasPermission("ADMINISTRATOR"))
      //     return message.reply('Non sei autorizzato a cancellare messaggi :upside_down:')
      //   message.channel.bulkDelete(parseInt(args[1])+1);
      //   break;
      case 'pepe':
        reply(interaction,pepe());
        break;
      case 'pokemon':
        
        if(!args['id'])
          return reply(interaction,pokemon());
        else if(args['id'] === 'list')
          reply(interaction,pokemonList());
        else if(parseInt(args['id'])>0)
          return reply(interaction, 'Il pokemon con id '+args['id']+' e\' :rat: :zap: :tophat:\n https://drive.google.com/file/d/'+pokemon_files[parseInt(args['id'])-1].id+'/view');
        else
          return reply(interaction, 'Comando non valido');
        break;
      case 'fuck':
        reply(interaction,'come ti permetti? 1v1 creativa :ice_cube:')
        break;
      case '1v1':
        const risuser=parseInt(getRandomInt(1,100));
        const risbot=parseInt(getRandomInt(1,100));
        if(risbot>risuser)
          return reply(interaction,'fai schifo: ho fatto '+risbot+' mentre tu solo '+risuser+': EZ :wheelchair:');
        else if(risbot<risuser)
          return reply(interaction,'ho fatto '+risbot+' e tu '+risuser+': GG :clown:');
        else
          return reply(interaction,'abbiamo fatto entrambi '+risbot+': REMATCH? :eyes:');
      case 'buonanotte':
        reply(interaction,'notte notte :heart:');
        break;
      case 'fox':
        execFile = require('child_process').execFile;
        execFile('./bin/PaoloFox'+sys_extension,['-ltr'],(e,stdout,stderr)=>{
          if(e instanceof Error){
            console.error(e);
            throw e;
          }
          reply(interaction,'\n:sparkles::sparkles::sparkles:\n'+stdout+'\n:sparkles::sparkles::sparkles:');
        })
        break;
      case 'sb':
        if(!args['sound_name'])
          return reply(interaction, 'devi inserire il nome del suono da riprodurre,\nEccoti la lista :monkey::\n'+stringsounds);
        if(sounds.indexOf(args['sound_name']) >= 0){
          console.log(interaction.member.user.id)
          console.log('\n\n\n\n')
          console.log(typeof interaction)
          console.log(typeof bot)
          console.log(typeof bot.api)
          // console.log(bot.api.users(interaction.member.user.id).callback.get({
          // }))
          //playFile('.\\sb\\'+args[1]+'.mp3',message);
          return reply(interaction, 'riproducendo il suono, beep boop :robot:')}
        else
          return reply(interaction, 'Il suono che hai cercato non esiste :innocent:\nDigita !sb per una lista dei suoni:alien:');
        break;
      case 'gambero':
        reply(interaction,"Hai rotto il cazzo Alex");
        break;
      case 'coolface':
        reply(interaction,cool());
        break;
    }
  })
});

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

function pepe(){
  
  linkPepe='https://drive.google.com/file/d/'+pepi_files[getRandomInt(0,pepi_files.length-1)].id+'/view'
  return 'Dal nostro archivio di '+pepi_files.length+' pepe abbiamo trovato questo :frog:\n'+linkPepe ;
}

function pokemon(){
  
  linkPokemon='https://drive.google.com/file/d/'+pokemon_files[getRandomInt(0,pokemon_files.length-1)].id+'/view';
  return 'Dal nostro archivio di '+pokemon_files.length+' pokemon abbiamo trovato questo :rat: :zap: :tophat:\n'+linkPokemon;
}

function pokemonList(){
  var response = '';
  var i = 1;
  pokemon_files.forEach(pokemon_file =>{
      response += ''+i+': '
      response += pokemon_file.name+'\n'
      i+=1
    });
  return response;
}

async function playFile(path,channel)
{
  if(channel === null){
    return;
  }
  connection = await channel.join();
  connection.play(path);
}

bot.login(token);