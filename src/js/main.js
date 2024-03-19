let fileInput;
let fileInputLabel;
let canvas;
let context;
let hs;
let vs;

let diffL = 0;
let diffR = 0;
let diffMax = 0;

let preview;

let cropBtn;
let images;

let overflow;

let gridDropdown;

window.onload = init;

function init(){
    fileInput = document.getElementById('fileInput');
    fileInputLabel = document.getElementById('fileInputLabel');
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    hs = document.getElementById('horizontalSlider');
    vs = document.getElementById('verticalSlider');
    cropBtn = document.getElementById('cropBtn');
    images = document.getElementById('images');
    gridDropdown = document.getElementById('gridDropdown');

    fileInput.onchange = function(){
        preview = document.createElement('img');
        var file    = fileInput.files[0];
        var reader  = new FileReader();

        reader.onloadend = function() {
            preview.src = reader.result;
            fileInputLabel.innerText = file.name;
            document.body.style.cursor = "wait";

            preview.onload = function() {
                document.body.style.cursor = "default";

                gridDropdown.onchange = function(){ // call this function when grid changes
                    preview.onload();
                }

                // Reset values and slider inputs
                hs.value = 50;
                vs.value = 50;
                hs.oninput = null;
                vs.oninput = null;
                hs.disabled = true;
                vs.disabled = true;

                canvas.width = preview.naturalWidth;
                canvas.height = preview.naturalHeight;
                canvas.style.zoom = 400 / canvas.width;
                canvas.style.marginTop = `${10 / canvas.style.zoom}px`
                hs.style.width = `${canvas.width * canvas.style.zoom}px`;
                vs.style.height = `${canvas.height * canvas.style.zoom}px`;
                context.drawImage(preview,0,0);

                if(canvas.width > canvas.height && gridDropdown.value == "3x3"){
                    hs.disabled = false;
                    overflow = "width";
                    diffMax = canvas.width - canvas.height;
                    diffL = diffMax / 2;
                    diffR = diffMax / 2;
                    hs.oninput = function(){
                        diffL = (hs.value / 100) * diffMax;
                        diffR = diffMax - diffL;
                        context.drawImage(preview,0,0);
                        context.fillStyle = "rgba(0,0,0,0.75)";
                        context.fillRect(0,0,diffL,canvas.height);
                        context.fillRect(canvas.width - diffR,0,diffR,canvas.height);
                    }
                    hs.oninput();
                }
                else if(canvas.height > canvas.width && gridDropdown.value == "3x3"){
                    vs.disabled = false;
                    overflow = "height";
                    diffMax = canvas.height - canvas.width;
                    diffL = diffMax / 2;
                    diffR = diffMax / 2;
                    vs.oninput = function(){
                        diffR = (vs.value / 100) * diffMax;
                        diffL = diffMax - diffR;
                        context.drawImage(preview,0,0);
                        context.fillStyle = "rgba(0,0,0,0.75)";
                        context.fillRect(0,0,canvas.width,diffL);
                        context.fillRect(0,canvas.height - diffR,canvas.width,diffR);
                    }
                    vs.oninput();
                }
                else if(gridDropdown.value == "3x1") {
                    if(Math.round(canvas.width / 3) != canvas.height){
                        vs.disabled = false;
                        overflow = "height";
                        diffMax = canvas.height - (canvas.width / 3);
                        diffL = diffMax / 2;
                        diffR = diffMax / 2;
                        vs.oninput = function(){
                            diffR = (vs.value / 100) * diffMax;
                            diffL = diffMax - diffR;
                            context.drawImage(preview,0,0);
                            context.fillStyle = "rgba(0,0,0,0.75)";
                            context.fillRect(0,0,canvas.width,diffL);
                            context.fillRect(0,canvas.height - diffR,canvas.width,diffR);
                        }
                        vs.oninput();
                    }
                }

                cropBtn.onclick = function(){
                    document.body.style.cursor = "wait";
                    images.innerHTML = `<h2>Images</h2>`;
                    var id = 1;
                    if(gridDropdown.value == "3x3"){
                        for (let y = 0; y < 3; y++) {
                            var row = document.createElement('div');
                            row.classList.add('row');
                            for (let x = 0; x < 3; x++) {
                                var localCanvas = document.createElement('canvas');
                                var localContext = localCanvas.getContext('2d');
                                var localImage = document.createElement('img');
    
                                localCanvas.width = Math.min(canvas.width,canvas.height) / 3;
                                localCanvas.height = Math.min(canvas.width,canvas.height) / 3;
    
                                if(canvas.width > canvas.height){
                                    localContext.drawImage(preview,-(diffL + (localCanvas.width * x)),-(localCanvas.height * y));
                                }
                                else if(canvas.height > canvas.width){
                                    localContext.drawImage(preview,-(localCanvas.width * x),-(diffL + (localCanvas.height * y)));
                                }
                                else{
                                    localContext.drawImage(preview,-(localCanvas.width * x),-(localCanvas.height * y));
                                }
    
                                localImage.src = localCanvas.toDataURL('image/jpeg');
                                localImage.style.zoom = canvas.style.zoom;
                                localImage.download = `${id++}.jpeg`;
                                localImage.onclick = function() {
                                    var link = document.createElement('a');
                                    link.href = this.src;
                                    link.download = this.download;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }
                                row.appendChild(localImage);
                            }
                            images.appendChild(row);
                        }
                        images.style.height = `${(canvas.height * canvas.style.zoom) + 100}px`;
                    }
                    else if(gridDropdown.value == "3x1"){
                        var row = document.createElement('div');
                        row.classList.add('row');
                        for (let x = 0; x < 3; x++) {
                            var localCanvas = document.createElement('canvas');
                            var localContext = localCanvas.getContext('2d');
                            var localImage = document.createElement('img');

                            localCanvas.width = canvas.width / 3;
                            localCanvas.height = canvas.width / 3;

                            if(Math.round(canvas.width / 3) == canvas.height){
                                localContext.drawImage(preview,-(localCanvas.width * x),0);
                            }
                            else{
                                localContext.drawImage(preview,-(localCanvas.width * x),-(diffL));
                            }

                            localImage.src = localCanvas.toDataURL('image/jpeg');
                            localImage.style.zoom = canvas.style.zoom;
                            localImage.download = `${id++}.jpeg`;
                            localImage.onclick = function() {
                                var link = document.createElement('a');
                                link.href = this.src;
                                link.download = this.download;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                            row.appendChild(localImage);
                        }
                        images.style.height = `${((canvas.width / 3) * canvas.style.zoom) + 100}px`;
                        images.appendChild(row);
                    }
                    document.body.style.cursor = "default";
                }
            }
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}