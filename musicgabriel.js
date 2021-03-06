﻿
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
    var playMusic = function(answer, titre ) { 
        if (lastTitre !== undefined) {
            SARAH.pause(path+ lastTitre);   
        }
        
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
  	
    switch(data.titredemande) {

        // passer a la chanson suivante
        case 'suivant' :
            if (lastTitre !== undefined) {
                mylog(" suivant");
               
                choixMusic(callback, function() {});
            } else {
                erreurlastTitre(data.titredemande ,callback);
            }
            return;
        break;
    
        // repete la derniere chanson
        case 'repete' :
            if (lastTitre !== undefined) {
                titre = lastTitre;
                mylog(" repete");
                
                answer = "je répète :";

                playMusic(answer, titre, callback);
            } else {
                erreurlastTitre(data.titredemande ,callback);
            }
            return;
        break;
 
        // arrête la chanson courante
        case 'stop' :
            if (lastTitre !== undefined) {
                mylog(" stop");
                SARAH.pause(path+ lastTitre);  
                callback({'tts':'stop'});
            } else {
                erreurlastTitre(data.titredemande ,callback);
            }    
            return; 
        break;

        // la façon de lancer la musique par défaut, en choisissant le titre de façon aléatoire dans les répertoires paramétrés
        case 'aleatoire' :
            mylog(" aléatoire");
            choixMusic(callback, function() {});
        break;
    
        // pour test de fonction
        case 'test' :
            mylog(" test");
            testfct(path); 
            callback("");
        break;
     
        // Gestion des demande de plusieurs titres d'affillés
        case 'enchaineTitre':
            if (data.titreNb) {
                mylog(" enchaineTitre = "+data.titreNb);
            }
            else {
                mylog(" enchaineTitre");   
            }

            callback({"tts":"enchaineé "+data.titreNb});
        break;
    
        /* 
        ** A Partir d'ici mettre les racourcis directement vers une chanson
        */
        // chanson : y en a assez
        case 'y en a assez' :
            titre = "les enfantastiques - y en a assez.mp3";
            answer = "vous avez demandez :";

            playMusic(answer, titre, callback);
        break;

        case 'flashmob' :
            titre = "flashmob.mp3";
            answer = "vous avez demandez :";

            playMusic(answer, titre, callback);
        break;

        case 'la marseillaise' :
            titre = "la_marseillaise.mp3";
            answer = "vous avez demandez :";

            playMusic(answer, titre, callback);
        break
      
        default :
            callback({"tts":"je n'est pas compris la commande"})

    }
    
}



