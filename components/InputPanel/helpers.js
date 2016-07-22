
/*
 * Use `element.toDataUrl` to save the canvas content as a base64 string.
 * Create a new html template with only an <img> which source is the base64 string.
 * Open a new window, write the html into it, then print it, then close.
 *
 * Ref: http://stackoverflow.com/a/17061022/2197181
 */
function printCanvas(canvasId) {
    let dataUrl = document.getElementById(canvasId).toDataURL();
    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    windowContent += '<head><title>Print canvas</title></head>';
    windowContent += '<body>';
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';
    let printWin = window.open('','','width=340,height=260');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}


export {
    printCanvas,
};
