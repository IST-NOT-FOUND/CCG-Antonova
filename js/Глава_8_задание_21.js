var gl;
var shaderProgram;
var vertexBuffer;
var indexBuffer;
var vertexNormalBuffer; // буфер нормалей вершин

var texture; // переменная для хранения текстуры
var yAngle = 2.0;//угол вращения в радианах вокруг оси Y
var zTranslation = -2.0; // смещение по оси Z
var xAngle = 0.1; // угол вращения в радианах вокруг оси Х

var mvMatrix = mat4.create(); // матрица вида модели
var pMatrix = mat4.create();  // матрица проекции
var nMatrix = mat3.create();  // матрица нормалей

// установка шейдеров
function initShaders() {
    var fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');
    var vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');

    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Не удалсь установить шейдеры");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // атрибут нормали
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // настройка параметров uniform матриц для передачи в шейдер
    shaderProgram.MVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.ProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.NormalMatrix = gl.getUniformLocation(shaderProgram, "uNMatrix");

    // настройка переменных uniform освещения для передачи в шейдер
    shaderProgram.uniformLightPosition = gl.getUniformLocation(shaderProgram, "uLightPosition");
    shaderProgram.uniformDiffuseLightColor = gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
    shaderProgram.uniformDiffuseMaterialColor = gl.getUniformLocation(shaderProgram, "uDiffuseMaterialColor");
}
// настройка цветов освещения
function setupLights() {
    gl.uniform3fv(shaderProgram.uniformLightPosition, [0.0, 10.0, 5.0]);
    gl.uniform3fv(shaderProgram.uniformDiffuseLightColor, [1.0,1.0,1.0]);
}
// установка материалов
function setupMaterials() {
    gl.uniform3fv(shaderProgram.uniformDiffuseMaterialColor, [0.0, 1.0, 1.0]);
}
function setMatrixUniforms(){

    gl.uniformMatrix4fv(shaderProgram.ProjMatrix,false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.MVMatrix, false, mvMatrix);
    gl.uniformMatrix3fv(shaderProgram.NormalMatrix, false, nMatrix);
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

function initBuffers() {

    var vertices =[
        // лицевая часть
        -0.5, -0.5, 0.5, //v0
        -0.5, 0.5, 0.5,  //v1
        0.5, 0.5, 0.5,  //v2
        0.5, -0.5, 0.5, //v3
        // задняя часть
        -0.5, -0.5, -0.5, //v4
        -0.5, 0.5, -0.5,  //v5
        0.5, 0.5, -0.5,  //v6
        0.5, -0.5, -0.5,  //v7

        // левая боковая часть
        -0.5, -0.5, 0.5, //v8
        -0.5, 0.5, 0.5,  //v9
        -0.5, 0.5, -0.5, //v10
        -0.5, -0.5, -0.5, //v11

        // правая боковая часть
        0.5, -0.5, 0.5,  //v12
        0.5, 0.5, 0.5,    //v13
        0.5, 0.5, -0.5,  //v14
        0.5, -0.5, -0.5  //v15
    ];

    var indices = [ // лицевая часть
        0, 1, 2,
        2, 3, 0,
        // задняя часть
        4, 5, 6,
        6, 7, 4,
        //левая боковая часть
        8, 9, 10,
        10, 11, 8,
        // правая боковая часть
        12, 13, 14,
        14, 15, 12
    ];

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    indexBuffer.numberOfItems = indices.length;

    var normals = [
        // Лицевая сторона
        0.0,  0.0,  1.0, //v0
        0.0,  0.0,  1.0, //v1
        0.0,  0.0,  1.0, //v2
        0.0,  0.0,  1.0, //v3

        // Задняя сторона
        0.0,  0.0, -1.0, //v4
        0.0,  0.0, -1.0, //v5
        0.0,  0.0, -1.0, //v6
        0.0,  0.0, -1.0, //v7

        // Левая боковая сторона
        -1.0,  0.0,  0.0, //v8
        -1.0,  0.0,  0.0, //v9
        -1.0,  0.0,  0.0, //v10
        -1.0,  0.0,  0.0, //v11

        // Правая боковая сторона
        1.0,  0.0,  0.0, //v12
        1.0,  0.0,  0.0, //v13
        1.0,  0.0,  0.0, //v14
        1.0,  0.0,  0.0, //v15
    ];

    // Создаем буфер нормалей куба
    vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    vertexNormalBuffer.itemSize = 3;
}

function draw() {

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
        vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT,0);

}
function setupWebGL()
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    mat4.perspective(pMatrix, 1.04, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix,mvMatrix,[0, 0, zTranslation]);
    mat4.rotateX(mvMatrix,mvMatrix, xAngle);
    mat4.rotateY(mvMatrix,mvMatrix, yAngle);

    mat3.normalFromMat4(nMatrix, mvMatrix);
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
        document.addEventListener('keydown', handleKeyDown, false);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        initShaders();
        initBuffers();
        setupMaterials();
        setupLights();
        (function animloop(){
            setupWebGL();
            setMatrixUniforms();
            draw();
            requestAnimFrame(animloop, canvas);
        })();
    }
}
function handleKeyDown(e){
    switch(e.keyCode)
    {
        case 39:  // стрелка вправо
            yAngle+=0.1;
            break;
        case 37:  // стрелка влево
            yAngle-=0.1;
            break;
        case 40:  // стрелка вниз
            xAngle+=0.1;
            break;
        case 38:  // стрелка вверх
            xAngle-=0.1;
            break;
        case 83:  // клавиша S
            zTranslation+=0.1;
            break;
        case 87:  // клавиша W
            zTranslation-=0.1;
            break;
    }
}
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element) {
            return window.setTimeout(callback, 1000/60);
        };
})();