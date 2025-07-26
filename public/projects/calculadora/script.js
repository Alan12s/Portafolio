// Variables globales
let display = '';
let history = '';
let shouldResetDisplay = false;

// Elementos del DOM
const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');
const graphPanel = document.getElementById('graphPanel');
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas
let canvasWidth = 800;
let canvasHeight = 600;

// Función para agregar al display
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display = '';
        shouldResetDisplay = false;
    }
    
    // Reemplazar constantes matemáticas
    if (value === 'pi') {
        value = 'Math.PI';
    } else if (value === 'e') {
        value = 'Math.E';
    }
    
    display += value;
    updateDisplay();
}

// Actualizar el display
function updateDisplay() {
    resultElement.value = display || '0';
}

// Limpiar todo
function clearAll() {
    display = '';
    history = '';
    updateDisplay();
    updateHistory();
}

// Limpiar entrada actual
function clearEntry() {
    display = '';
    updateDisplay();
}

// Borrar último carácter
function deleteLast() {
    display = display.slice(0, -1);
    updateDisplay();
}

// Actualizar historial
function updateHistory() {
    historyElement.textContent = history;
}

// Función de cálculo
function calculate() {
    if (!display) return;
    
    try {
        // Preparar la expresión para evaluación
        let expression = display;
        
        // Reemplazar funciones matemáticas
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
        expression = expression.replace(/pow\(/g, 'Math.pow(');
        expression = expression.replace(/pi/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');
        
        // Reemplazar ^ con Math.pow
        expression = expression.replace(/(\d+(?:\.\d+)?|\w+)\^(\d+(?:\.\d+)?|\w+)/g, 'Math.pow($1,$2)');
        
        // Agregar multiplicación implícita
        expression = expression.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        expression = expression.replace(/\)(\d)/g, ')*$1');
        expression = expression.replace(/(\d)\(/g, '$1*(');
        
        const result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Resultado inválido');
        }
        
        history = display + ' = ' + result;
        display = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        history = display + ' = Error';
        display = 'Error';
        shouldResetDisplay = true;
    }
    
    updateDisplay();
    updateHistory();
}

// Función para mostrar/ocultar el panel de gráficos
function toggleGraph() {
    const isActive = graphPanel.classList.contains('active');
    if (isActive) {
        graphPanel.classList.remove('active');
    } else {
        graphPanel.classList.add('active');
        setupCanvas();
    }
}

// Configurar el canvas
function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    
    ctx.scale(dpr, dpr);
    drawAxes();
}

// Dibujar los ejes
function drawAxes() {
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Dibujar grid
    const xStep = (xMax - xMin) / 20;
    const yStep = (yMax - yMin) / 15;
    
    for (let x = xMin; x <= xMax; x += xStep) {
        const canvasX = ((x - xMin) / (xMax - xMin)) * canvasWidth;
        ctx.beginPath();
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, canvasHeight);
        ctx.stroke();
    }
    
    for (let y = yMin; y <= yMax; y += yStep) {
        const canvasY = canvasHeight - ((y - yMin) / (yMax - yMin)) * canvasHeight;
        ctx.beginPath();
        ctx.moveTo(0, canvasY);
        ctx.lineTo(canvasWidth, canvasY);
        ctx.stroke();
    }
    
    // Dibujar ejes principales
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 2;
    
    // Eje X
    if (yMin <= 0 && yMax >= 0) {
        const zeroY = canvasHeight - ((0 - yMin) / (yMax - yMin)) * canvasHeight;
        ctx.beginPath();
        ctx.moveTo(0, zeroY);
        ctx.lineTo(canvasWidth, zeroY);
        ctx.stroke();
    }
    
    // Eje Y
    if (xMin <= 0 && xMax >= 0) {
        const zeroX = ((0 - xMin) / (xMax - xMin)) * canvasWidth;
        ctx.beginPath();
        ctx.moveTo(zeroX, 0);
        ctx.lineTo(zeroX, canvasHeight);
        ctx.stroke();
    }
    
    // Etiquetas de los ejes
    ctx.fillStyle = '#4a5568';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Etiquetas del eje X
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        if (x === 0) continue;
        const canvasX = ((x - xMin) / (xMax - xMin)) * canvasWidth;
        const labelY = yMin <= 0 && yMax >= 0 
            ? canvasHeight - ((0 - yMin) / (yMax - yMin)) * canvasHeight + 15
            : canvasHeight - 10;
        ctx.fillText(x.toString(), canvasX, labelY);
    }
    
    // Etiquetas del eje Y
    ctx.textAlign = 'right';
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        if (y === 0) continue;
        const canvasY = canvasHeight - ((y - yMin) / (yMax - yMin)) * canvasHeight;
        const labelX = xMin <= 0 && xMax >= 0 
            ? ((0 - xMin) / (xMax - xMin)) * canvasWidth - 5
            : canvasWidth - 5;
        ctx.fillText(y.toString(), labelX, canvasY + 4);
    }
}

// Evaluar función matemática
function evaluateFunction(expression, x) {
    try {
        // Reemplazar x con el valor numérico
        let func = expression.replace(/x/g, x.toString());
        
        // Reemplazar funciones matemáticas
        func = func.replace(/sin\(/g, 'Math.sin(');
        func = func.replace(/cos\(/g, 'Math.cos(');
        func = func.replace(/tan\(/g, 'Math.tan(');
        func = func.replace(/log\(/g, 'Math.log10(');
        func = func.replace(/ln\(/g, 'Math.log(');
        func = func.replace(/sqrt\(/g, 'Math.sqrt(');
        func = func.replace(/abs\(/g, 'Math.abs(');
        func = func.replace(/pi/g, 'Math.PI');
        func = func.replace(/e/g, 'Math.E');
        
        // Reemplazar ^ con Math.pow
        func = func.replace(/([+-]?\d*\.?\d+|\([^)]+\))\^([+-]?\d*\.?\d+|\([^)]+\))/g, 'Math.pow($1,$2)');
        
        // Agregar multiplicación implícita
        func = func.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        func = func.replace(/\)(\d)/g, ')*$1');
        func = func.replace(/(\d)\(/g, '$1*(');
        
        const result = eval(func);
        return isFinite(result) ? result : null;
    } catch (error) {
        return null;
    }
}

// Graficar función
function plotFunction() {
    const functionInput = document.getElementById('functionInput').value;
    if (!functionInput) {
        alert('Por favor, ingresa una función');
        return;
    }
    
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    
    // Redibujar ejes
    drawAxes();
    
    // Configurar estilo de la función
    ctx.strokeStyle = '#e53e3e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const step = (xMax - xMin) / canvasWidth;
    let firstPoint = true;
    
    for (let x = xMin; x <= xMax; x += step) {
        const y = evaluateFunction(functionInput, x);
        
        if (y !== null && y >= yMin && y <= yMax) {
            const canvasX = ((x - xMin) / (xMax - xMin)) * canvasWidth;
            const canvasY = canvasHeight - ((y - yMin) / (yMax - yMin)) * canvasHeight;
            
            if (firstPoint) {
                ctx.moveTo(canvasX, canvasY);
                firstPoint = false;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        } else {
            firstPoint = true;
        }
    }
    
    ctx.stroke();
}

// Limpiar gráfico
function clearGraph() {
    drawAxes();
    document.getElementById('functionInput').value = '';
}

// Resetear zoom
function resetZoom() {
    document.getElementById('xMin').value = -10;
    document.getElementById('xMax').value = 10;
    document.getElementById('yMin').value = -10;
    document.getElementById('yMax').value = 10;
    drawAxes();
}

// Event listeners para el teclado
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Números y operadores básicos
    if ('0123456789'.includes(key)) {
        event.preventDefault();
        appendToDisplay(key);
    } else if ('+-*/'.includes(key)) {
        event.preventDefault();
        appendToDisplay(key === '*' ? '*' : key);
    } else if (key === '.') {
        event.preventDefault();
        appendToDisplay('.');
    } else if (key === '(' || key === ')') {
        event.preventDefault();
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        event.preventDefault();
        clearAll();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Event listener para cambios en los rangos del gráfico
document.getElementById('xMin').addEventListener('change', drawAxes);
document.getElementById('xMax').addEventListener('change', drawAxes);
document.getElementById('yMin').addEventListener('change', drawAxes);
document.getElementById('yMax').addEventListener('change', drawAxes);

// Event listener para Enter en el input de función
document.getElementById('functionInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        plotFunction();
    }
});

// Responsive canvas
window.addEventListener('resize', function() {
    if (graphPanel.classList.contains('active')) {
        const container = canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        canvasWidth = Math.min(800, containerRect.width - 40);
        canvasHeight = Math.min(600, canvasWidth * 0.75);
        
        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';
        
        setupCanvas();
    }
});

// Inicialización
updateDisplay();