/*
 * Validates (true/false) a single fasta sequence string
 * param   fasta    the string containing a putative single fasta sequence
 * returns boolean  true if string contains single fasta sequence, false 
 *                  otherwise 
 */
function validateFasta(fasta) {

    if (!fasta) { // checks if there is something first of all
        return false;
    }

    // immediately remove trailing spaces
    fasta = fasta.trim();

    // split on newlines
    var lines = fasta.split('\n');

    // check for header
    if (fasta[0] == '>') {
        // remove one line, starting at the first position
        lines.splice(0, 1);
    }

    // join the array back into a single string without newlines and 
    // trailing or leading spaces
    fasta = lines.join('').trim();

    if (!fasta) {
        return false;
    }

    // note that the empty string is caught above
    // allow for Selenocysteine (U)
    if (/^[ACDEFGHIKLMNPQRSTUVWY\s]+$/i.test(fasta) == true) {
        return (fasta);
    };
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)'); // protocol
    return !!pattern.test(str); // return true or false
  }

export {
    validateFasta,
    validURL
};
