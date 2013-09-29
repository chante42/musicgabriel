
// cette variable doit resté en dehaors pour pourvoir etre entre differente session et que le stop fonctionne
var lasttitre;

exports.action = function(data, callback, config, SARAH){
    var fs  = require('fs'); 
	console.log("lancement de music Gabriel");
	var config = config.modules.musicgabriel;
    var path = config.path;
    var answers = config.answers;
    var titre = "";
    

    // les fonctions doivent etre définies avant les appels

    // 
    // function : choixMusic
    //
    var choixMusic = function(callback, cb) {
        console.log("music Gabriel : path :" + path);
        // Callback with TTS
        var answers = config.answers.split('|');
        var answer = answers[ Math.floor(Math.random() * answers.length)]; 


        fs.readdir(path,function(error,directoryObject)   { 
            var nombre_histoire = 0;   
            for( var i in directoryObject){
                nombre_histoire = nombre_histoire + 1;
                //console.log(directoryObject[i]);
            }
             
            histoire_selectione = Math.floor((Math.random()*nombre_histoire)+1);
            
            var nombre_histoire_play = 0;
            for( var i in directoryObject) {
                nombre_histoire_play = nombre_histoire_play + 1; 
                if(nombre_histoire_play == histoire_selectione) {
                    titre = directoryObject[i];
                    console.log("music Gabriel : titre :" + titre);
                }
            }

            
            playMusic(answer, titre, callback, function() {
                console.log("music Gabriel : callback play");
            })
        });
    }

    // 
    // function : playMusic
    //
    var playMusic = function(answer, titre, callback, cb ) {
        lasttitre = titre;

        // nettoie le titre de ce qui ne se dit pas
        tmp = titre
        tmp = tmp.replace(".mp3", "");
        tmp = tmp.replace(/^[0-9]*/g, "");
        console.log('titre = ' + tmp);
        answer = answer + tmp; 
        

        console.log(answer);
        callback({'tts': answer});
        
        
        SARAH.play(path+ titre);     
    }   
        

	if (!config.prenom) {
		callback({'tts':'Paramètre prénom invalide'});
		return;
	} 
  	
    if (data.titredemande == 'suivant') {
        console.log("music Gabriel : suivant");
        SARAH.pause(path+ lasttitre);
        choixMusic(callback, function() {});
        return;
    } 
    
    else if (data.titredemande == 'stop') {
        console.log("music Gabriel : stop");
        SARAH.pause(path+ lasttitre);
        callback({'tts':'stop'});
        return;
    }
    else if (data.titredemande == 'y en a assez') {
        titre = "les enfantastiques - y en a assez.mp3";
        answer = "vous avez demandez :";

        playMusic(answer, titre, callback, function() {
        });
    }
    else if (data.titredemande == 'la marseillaise') {
        titre = "la_marseillaise.mp3";
        answer = "vous avez demandez :";

        playMusic(answer, titre, callback, function() {
        });
    }
    
    else if (data.titredemande == 'aleatoire') {
        console.log("music Gabriel : aléatoire");
        choixMusic(callback, function() {});
    }  

    
}



