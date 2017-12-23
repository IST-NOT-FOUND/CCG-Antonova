var gl;
var shaderProgram;
var vertexBuffer; // буфер вершин
var indexBuffer; //буфер индексов
// установка шейдеров
function initShaders() {
    var fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');
    var vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');

    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Не удалось установить шейдеры");
    }
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}
// Функция создания шейдера
function getShader(type,id) {
    var source = document.getElementById(id).innerHTML;

    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
// установка буферов вершин и индексов
function initBuffers() {

    vertices =[
        -0.8, -0.3, 0.0,         //0
        -0.9, -0.4, 0.0,         //1
        -0.9, -0.5, 0.0,         //2
        -0.8, -0.5, 0.0,         //3
         -0.6, 0.5, 0.0,          //4
        -0.5, 0.6, 0.0,          //5
        -0.4, 0.5, 0.0,          //6
        -0.4, -0.5, 0.0,         //7
        -0.7, 0.0, 0.0,          //8
        -0.4, 0.0, 0.0,         //9

        -0.2, -0.3, 0.0,         //10
        -0.3, -0.4, 0.0,         //11
        -0.3, -0.5, 0.0,         //12
        -0.2, -0.5, 0.0,         //13
        0.0, 0.5, 0.0,          //14
        0.1, 0.6, 0.0,          //15
        0.2, 0.5, 0.0,          //16
        0.2, -0.5, 0.0,         //17
        -0.1, 0.0, 0.0,          //18
        0.2, 0.0, 0.0,         //19

        0.6, 0.4, 0.0,         //20
        0.6, 0.5, 0.0,         //21
        0.5, 0.6, 0.0,         //22
        0.4, 0.6, 0.0,         //23
        0.3, 0.4, 0.0,          //24
        0.3, -0.4, 0.0,          //25
        0.4, -0.5, 0.0,          //26
        0.5, -0.5, 0.0,         //27
        0.6, -0.4, 0.0,          //28
        0.6, -0.3, 0.0];         //29

    indices1 = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9];
    indices2 = [10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 18, 19];
    indices3 = [20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29];
    // установка буфера вершин
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    draw(indices1);
    draw(indices2);
    draw(indices3);
}

function draw(indices) {

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    indexBuffer.numberOfItems = indices.length;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.LINES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT,0);
}

window.onload=function(){

    var canvas = document.getElementById("canvas3D");
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    if (!gl) {
        alert("Ваш браузер не поддерживает WebGL");
    }
    if(gl){
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        initShaders();

        initBuffers();

        draw();
    }
}