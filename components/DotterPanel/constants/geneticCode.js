
let geneticCode = {
"TTT": 'F',
"TTC": 'F',
"TTA": 'L',
"TTG": 'L',

"TCT": 'S',
"TCC": 'S',
"TCA": 'S',
"TCG": 'S',

// I use '[' for the STOP codon: because it's just after 'Z'
// so I can simply use a char [ 27 ][ 27 ] for the matrix: and
// address it directly by letter.

"TAT": 'Y',
"TAC": 'Y',
"TAA": '[',
"TAG": '[',

"TGT": 'C',
"TGC": 'C',
"TGA": '[',
"TGG": 'W',

"CTT": 'L',
"CTC": 'L',
"CTA": 'L',
"CTG": 'L',

"CCT": 'P',
"CCC": 'P',
"CCA": 'P',
"CCG": 'P',

"CAT": 'H',
"CAC": 'H',
"CAA": 'Q',
"CAG": 'Q',

"CGT": 'R',
"CGC": 'R',
"CGA": 'R',
"CGG": 'R',

"ATT": 'I',
"ATC": 'I',
"ATA": 'I',
"ATG": 'M',

"ACT": 'T',
"ACC": 'T',
"ACA": 'T',
"ACG": 'T',

"AAT": 'N',
"AAC": 'N',
"AAA": 'K',
"AAG": 'K',

"AGT": 'S',
"AGC": 'S',
"AGA": 'R',
"AGG": 'R',

"GTT": 'V',
"GTC": 'V',
"GTA": 'V',
"GTG": 'V',
"GTN": 'V',

"GCT": 'A',
"GCC": 'A',
"GCA": 'A',
"GCG": 'A',
"GCN": 'A',

"GAT": 'D',
"GAC": 'D',
"GAA": 'E',
"GAG": 'E',

"GGT": 'G',
"GGC": 'G',
"GGA": 'G',
"GGG": 'G',
"GGN": 'G',
};


export default geneticCode;
