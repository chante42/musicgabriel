
// cette variable doit resté en dehaors pour pourvoir etre entre differente session et que le stop fonctionne
var lastTitre;
var nbTitreLu;
var nbTitreALire;
var tempsLu;
var tempALire;


exports.action = function(data, callback, config, SARAH){
    var fs  = require('fs'); 
	var config = config.modules.musicgabriel;
    var path = config.path;
    var answers = config.answers;
    var titre = "";
    

    // les fonctions doivent etre définies avant les appels

    // 
    // function : mylog
    //
    var mylog = function(msg) {
        console.log("       : " + msg);
    }

    // 
    // function : choixMusic
    //
    var choixMusic = function(callback, cb) {
        mylog("path :" + path);

        var answers = config.answers.split('|');
        var answer = answers[ Math.floor(Math.random() * answers.length)]; 

        fs.readdir(path,function(error,directoryObject)   { 
            nombre_histoire=directoryObject.length;

            do {
                histoire_selectione = Math.floor((Math.random()*nombre_histoire)+1);
                
                titre = directoryObject[histoire_selectione];
            } while (titre === lastTitre);
           
            playMusic(answer, titre, callback, function() {
                mylog("callback play");
            })
        });
    }

    // 
    // function : playMusic
    //
    var playMusic = function(answer, titre, callback, cb ) { 
        lastTitre = titre;

        // nettoie le titre de ce qui ne se dit pas
        tmp = titre
        tmp = tmp.replace(".mp3", "");
        tmp = tmp.replace(/^[0-9]*/g, "");
        mylog("titre = "  + tmp);
        answer = answer + tmp; 

        mylog(answer);
        callback({'tts': answer});
        
        SARAH.play(path+ titre);     
    }   
    
    // 
    // function : erreurlastTitre
    //
    var erreurlastTitre = function(cmd, callback, cb ) {
        mylog(" " +cmd +" -> je ne connais pas la chanson precedente");
        callback({'tts': 'je ne connais pas la chanson précédente'});
    }

    var testfct = function(path, callback, cb) {
        var execFile = require('child_process').execFile;
        
        //execFile('dir', path , function(err, stdout, stderr) {
            //var file_list = stdout.split('\n');
            /* now you've got a list with full path file names */  
        //    console.log(file_list);
        //}
    }


    console.log("   ");    
    console.log("music Gabriel : ");
    console.log("---------------");

	if (!config.prenom) {
		callback({'tts':'Paramètre prénom invalide'});
		return;
	} 
  	
    if (data.titredemande == 'suivant') {
        if (lastTitre !== undefined) {
            mylog(" suivant");
            SARAH.pause(path+ lastTitre);
            choixMusic(callback, function() {});
        } else {
            erreurlastTitre(data.titredemande ,callback);
        }
        return;
    } 
    else if (data.titredemande == 'repete') {
        if (lastTitre !== undefined) {
            titre = lastTitre;
            mylog(" repete");
            SARAH.pause(path+ lastTitre);
            answer = "je répète :";

            playMusic(answer, titre, callback, function() {
            });
        } else {
            erreurlastTitre(data.titredemande ,callback);
        }
        return;
    } 
    
    else if (data.titredemande === 'stop') {
        if (lastTitre !== undefined) {
            mylog(" stop");
            SARAH.pause(path+ lastTitre);
            callback({'tts':'stop'});
        } else {
            erreurlastTitre(data.titredemande ,callback);
        }    
        return; 
    }
    else if (data.titredemande === 'y en a assez') {
        titre = "les enfantastiques - y en a assez.mp3";
        answer = "vous avez demandez :";

        playMusic(answer, titre, callback, function() {
        });
    }
    else if (data.titredemande === 'la marseillaise') {
        titre = "la_marseillaise.mp3";
        answer = "vous avez demandez :";

        playMusic(answer, titre, callback, function() {
        });
    }
    
    else if (data.titredemande === 'aleatoire') {
        mylog(" aléatoire");
        choixMusic(callback, function() {});
    }  
    else if (data.titredemande === 'test') {
        mylog(" test");
        testfct(path);
        callback("");
    }  
    else if (data.titredemande === 'enchaineTitre') {
        if (data.titreNb) {
            mylog(" enchaineTitre = "+data.titreNb);
        }
        else {
         mylog(" enchaineTitre");   
        }
        
        callback("");
    }  
    else {
        callback("tts:je n'est pas compris la commande")
    }
    
}



