var pointer = document.querySelector('#pointer');
var colorTips = document.querySelector('#colorTips');
var canvas = document.querySelector('#bodyCanvas');

var windowWidth=window.innerWidth - 300;
console.log(windowWidth+" "+windowHeight);
var windowHeight=window.innerHeight;
canvas.width = windowWidth;
canvas.height = windowHeight;

var ctx = canvas.getContext('2d');
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 25;
ctx.strokeStyle = '#BADA55';

var lastX = 0;
var lastY = 0;
var isDrawing = false;



function draw(e) {
    if (!isDrawing) {
        return
    };
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
}
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', function (e) {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});
canvas.addEventListener('mouseup', function () {
    isDrawing = false;
});
canvas.addEventListener('mouseout', function () {
    isDrawing = false;
});

// stroke color 
var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
var HANDOPENCOLOR = "green";


function updateHandState(rightHandState, leftHandState, rightJointPoint, leftHandJoint, leftElbowJoint) {
    var leftHandPosition = leftElbowJoint.depthY - leftHandJoint.depthY;
    if (leftHandPosition > 0 && leftHandState == 2) {
        drawHand(rightJointPoint, HANDOPENCOLOR);
    } else if (leftHandPosition > 0 && leftHandState == 3) {
        drawDiv(rightJointPoint,'white')
        ctx.clearRect(rightJointPoint.depthX * windowWidth, rightJointPoint.depthY * windowHeight, 30, 30);
    } else {
        drawDiv(rightJointPoint,'black');
    }
}

var i=0;
var isKicked=true;
function changeColor(leftFootJoint,rightFootJoint){
    if(leftFootJoint.depthY>rightFootJoint.depthY){
        isKicked = true;
    }
    if(leftFootJoint.depthY<rightFootJoint.depthY && isKicked ){
        HANDOPENCOLOR=colors[i];
        colorTips.style.background=HANDOPENCOLOR;
        i++;
        if(i==colors.length-1){
            i=0;
        }
        isKicked=false;
    }
}

function drawDiv(jointPoint,color) {
    pointer.style.background = color;
    pointer.style.display = 'block';
    pointer.style.top = `${jointPoint.depthY * windowHeight}px`;
    pointer.style.left = `${jointPoint.depthX * windowWidth}px`;
    lastX = jointPoint.depthX * windowWidth;
    lastY = jointPoint.depthY * windowHeight;
    if(color=='white'){
        pointer.style.border='solid';
        pointer.style.borderRadius=0;
    }else{
        pointer.style.border='';
        pointer.style.borderRadius='50%';
    }
}

function drawHand(jointPoint, handColor) {
    pointer.style.display = 'none';
    ctx.strokeStyle = handColor;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(jointPoint.depthX * windowWidth, jointPoint.depthY * windowHeight);
    ctx.stroke();
    lastX = jointPoint.depthX * windowWidth;
    lastY = jointPoint.depthY * windowHeight;
}

socket.on('kinect', function (bodyFrame) {
    var index = 0;
    bodyFrame.bodies.forEach(function (body) {
        if (body.tracked) {
            updateHandState(body.rightHandState, body.leftHandState, body.joints[11], body.joints[7], body.joints[5]);
            changeColor(body.joints[15],body.joints[17]);
            index++;
        }
    });
});