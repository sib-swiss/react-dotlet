
/**
 * Cross-browser way of setting the selection range of an input/textarea
 * @param input: web Element
 * @param selectionStart: int
 * @param selectionEnd: int
 */
function setSelectionRange(input, selectionStart, selectionEnd) {
    // Normal browsers
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    // IE
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

/**
 * Sets the caret position, using the above with start=end.
 */
function setCaretToPos(input, pos) {
    setSelectionRange(input, pos, pos);
}


export default setCaretToPos;
