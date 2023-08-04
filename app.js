function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

       
        let nombre = document.getElementById('nombre').value;
        let municipio = document.getElementById('municipio').value;
        let direccion = document.getElementById('direccion').value;
        let telefono = document.getElementById('telefono').value;
        let redes = document.getElementById('redes').value;
        
        

        generatePDF( nombre,municipio, direccion, telefono, redes);
    })

});

async function generatePDF( nombre, municipio,direccion, telefono, redes  ) {
    const image = await loadImage("morena.jpg");
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('p', 'pt', 'letter');

    pdf.addImage(image, 'PNG', 0, 0, 565, 792);
    pdf.addImage(signatureImage, 'PNG', 300, 655, 300, 60);

    
    const date = new Date();
    pdf.text(date.getUTCDate().toString(), 235, 360);
    pdf.text((date.getUTCMonth() + 1).toString(), 275, 360);
    pdf.text(date.getUTCFullYear().toString(), 320, 360);

    pdf.setFontSize(12);
    pdf.text(nombre, 170, 400);
    pdf.text(municipio, 170, 450);
    pdf.text(direccion, 170, 510);
    pdf.text(telefono, 170, 560);
    pdf.text(redes, 170, 620);

    pdf.setFillColor(0,0,0);

    pdf.save("example.pdf");

}