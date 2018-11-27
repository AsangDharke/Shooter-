// Script for lerning vanila javascript animations. 
function myMove() {
    var elem = document.getElementById("myAnimation"); 
    var pos = 0; 
    var id = setInterval(frame, 10); 
    function frame() {
        if(pos == 350) {
            clearInterval(id);
            myRMove(); 
        } else {
            pos+=2; 
            elem.style.top = pos + 'px'; 
            elem.style.left = pos + 'px'; 
        }
    }
}

function myRMove() {
    var elem = document.getElementById("myAnimation"); 
    var pos = 350;  
    var id2 = setInterval(frame, 10);
    function frame() {
        if(pos == 0) {
            clearInterval(id2);
        } else {
            pos-=2; 
            elem.style.top = pos + 'px'; 
            elem.style.left = pos + 'px'; 
        }
    }
}
myMove(); 

function pExplosion() {
var elem2 = document.querySelector('#Image');
var idx = 1; 
var particleExplosion = setInterval(frames, 200); 
    function frames () {
        if(elem2.getAttribute('src') == 'images/pframe3.png')
        {
            elem2.setAttribute('src', ''); 
            clearInterval(particleExplosion);
        }     
        else{
            var source = 'images/pframe' + idx + '.png';
            elem2.setAttribute('src', source); 
            idx++; 
            console.log(source); 
        }
    }
}
addEventListener('mousedown', pExplosion);  

