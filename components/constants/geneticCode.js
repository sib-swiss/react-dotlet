
let geneticCode = {
// DNA
"TTT": 'F',
"TTC": 'F',
"TTA": 'L',
"TTG": 'L',

// RNA
"UUU": 'F',
"UUC": 'F',
"UUA": 'L',
"UUG": 'L',

// DNA
"TCT": 'S',
"TCC": 'S',
"TCA": 'S',
"TCG": 'S',

// RNA
"UCU": 'S',
"UCC": 'S',
"UCA": 'S',
"UCG": 'S',

// I use '[' for the STOP codon: because it's just after 'Z'
// so I can simply use a char [ 27 ][ 27 ] for the matrix: and
// address it directly by letter.

// DNA
"TAT": 'Y',
"TAC": 'Y',
"TAA": '[',
"TAG": '[',

// RNA
"UAU": 'Y',
"UAC": 'Y',
"UAA": '[',
"UAG": '[',

// DNA
"TGT": 'C',
"TGC": 'C',
"TGA": '[',
"TGG": 'W',

// RNA
"UGU": 'C',
"UGC": 'C',
"UGA": '[',
"UGG": 'W',

// DNA
"CTT": 'L',
"CTC": 'L',
"CTA": 'L',
"CTG": 'L',

// RNA
"CUU": 'L',
"CUC": 'L',
"CUA": 'L',
"CUG": 'L',

// DNA
"CCT": 'P',
"CCC": 'P',
"CCA": 'P',
"CCG": 'P',

// RNA
"CCU": 'P',

// DNA
"CAT": 'H',
"CAC": 'H',
"CAA": 'Q',
"CAG": 'Q',

// RNA
"CAU": 'H',

// DNA
"CGT": 'R',
"CGC": 'R',
"CGA": 'R',
"CGG": 'R',

// RNA
"CGU": 'R',

// DNA
"ATT": 'I',
"ATC": 'I',
"ATA": 'I',
"ATG": 'M',

// RNA
"AUU": 'I',
"AUC": 'I',
"AUA": 'I',
"AUG": 'M',

// DNA
"ACT": 'T',
"ACC": 'T',
"ACA": 'T',
"ACG": 'T',

// RNA
"ACU": 'T',

// DNA
"AAT": 'N',
"AAC": 'N',
"AAA": 'K',
"AAG": 'K',

// RNA
"AAU": 'N',

// DNA
"AGT": 'S',
"AGC": 'S',
"AGA": 'R',
"AGG": 'R',

// RNA
"AGU": 'S',

// DNA
"GTT": 'V',
"GTC": 'V',
"GTA": 'V',
"GTG": 'V',
"GTN": 'V',

// RNA
"GUU": 'V',
"GUC": 'V',
"GUA": 'V',
"GUG": 'V',
"GUN": 'V',

// DNA
"GCT": 'A',
"GCC": 'A',
"GCA": 'A',
"GCG": 'A',
"GCN": 'A',

// RNA
"GCU": 'A',

// DNA
"GAT": 'D',
"GAC": 'D',
"GAA": 'E',
"GAG": 'E',

// RNA
"GAU": 'D',

// DNA
"GGT": 'G',
"GGC": 'G',
"GGA": 'G',
"GGG": 'G',
"GGN": 'G',

// RNA
"GGU": 'G',

};


export default geneticCode;
