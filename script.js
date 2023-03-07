//Select Elements
let startBtn = document.querySelector(".start");
let welcomeSection = document.querySelector(".welcome-message");
let shapeArr = ["Circle", "Rectangle"];
let shapes;
let rand = Math.floor(Math.random() * shapeArr.length);

console.log(rand);
startBtn.onclick = () => {
    startBtn.parentElement.remove();
    drawQuestion();
    let h2Choice = document.querySelector(".choose-message h2");

    if (rand === 0) {
        circleChoice(h2Choice);
    }
    else {
        rectangleChoice(h2Choice);
    }
    // shapeArr.splice(rand, 1);
}
function afterChoose() {
    welcomeSection.remove();
}


function drawQuestion() {
    let div = document.createElement("div");
    div.className = "choose-message";
    let h2 = document.createElement("h2");
    let h2Text = document.createTextNode(`Draw ${shapeArr[rand]}`);
    // let circleImage = document.createElement("img");
    // circleImage.src = "icons/circle.svg";
    // let rectImage = document.createElement("img");
    // rectImage.src = "icons/rectangle.svg";
    // let triImage = document.createElement("img");
    // triImage.src = "icons/triangle.svg";

    // div.appendChild(circleImage);
    // div.appendChild(rectImage);
    // div.appendChild(triImage);
    h2.appendChild(h2Text);
    div.appendChild(h2);
    welcomeSection.appendChild(div);


}
//canvas
const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d");


// global variables with default value
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";
//Addddd
let x = 0;
let y = 0;
var offsetX;
var offsetY;
//

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);

}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

    if (selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

// saveImg.addEventListener("click", () => {
//     const link = document.createElement("a"); // creating <a> element
//     link.download = `${Date.now()}.jpg`; // passing current date as link download value
//     link.href = canvas.toDataURL(); // passing canvasData as link href value
//     link.click(); // clicking link to download image
//     // showImage.src = link.href;
// });

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
//Adddd
canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('touchend', handleEnd);
canvas.addEventListener('touchcancel', handleCancel);
canvas.addEventListener('touchmove', handleMove);

const ongoingTouches = [];

function handleStart(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    offsetX = canvas.getBoundingClientRect().left;
    offsetY = canvas.getBoundingClientRect().top;
    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
    }
}

function handleMove(evt) {
    // console.log(evt);
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {

        const idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            if (selectedTool === "brush" || selectedTool === "eraser") {
                ctx.beginPath();
                // ctx.moveTo(ongoingTouches[idx].clientX - offsetX, ongoingTouches[idx].clientY - offsetY);
                ctx.moveTo(ongoingTouches[idx].clientX, ongoingTouches[idx].clientY);
                // ctx.lineTo(touches[i].clientX - offsetX, touches[i].clientY - offsetY);
                ctx.lineTo(touches[i].clientX, touches[i].clientY);
                ctx.lineWidth = brushWidth;
                ctx.strokeStyle = selectedColor;;
                ctx.lineJoin = "round";
                ctx.closePath();
                ctx.stroke();

            }
            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        }
    }
    for (let i = 0; i < ongoingTouches.length; i++) {
        if (selectedTool === "rectangle") {
            console.log("hi");
            ctx.beginPath();
            // ctx.moveTo(ongoingTouches[idx].clientX, ongoingTouches[idx].clientY, offsetX - ongoingTouches[idx].clientX, offsetY - ongoingTouches[idx].clientY);
            ctx.strokeRect(ongoingTouches[i].clientX, ongoingTouches[i].clientY, 100, 200);                // // ctx.closePath();
            ctx.lineWidth = brushWidth;
            ctx.strokeStyle = selectedColor;;
            // ctx.lineJoin = "round";
            // ctx.closePath();
            ctx.stroke();


        }
    }
}

function handleEnd(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            ctx.lineWidth = brushWidth;
            ctx.fillStyle = selectedColor;
            ongoingTouches.splice(idx, 1);  // remove it; we're done
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
}

function copyTouch({ identifier, clientX, clientY }) {
    return { identifier, clientX, clientY };
}

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;
        if (id === idToFind) {
            return i;
        }
    }
    return -1;    // not found
}

















// function drawModelss() {

//     for (let i = 1; i < canvas.width; i += 10) {
//         ctx.strokeRect(i, i, i + 15, i + 35);
//         saveImg.click();
//         clearCanvas.click();
//         ctx.fillRect(i, i, i + 35, i + 15);
//         saveImg.click();
//         clearCanvas.click();
//     }
// }

// drawModels();

/*Toggle Paint Mobile Menu */
let burgerIcon = document.querySelector(".burger-icon");
let paintBoard = document.querySelector(".tools-board")
burgerIcon.onclick = (e) => {
    e.stopPropagation();
    burgerIcon.classList.toggle("active");
    paintBoard.classList.toggle("active");

}
document.addEventListener("click", (e) => {

    if (burgerIcon.classList.contains("active")) {
        burgerIcon.classList.toggle("active");
        paintBoard.classList.toggle("active");

    }
})