
Dotlet reborn
-------------

Dotlet is a web app that produces a dot plot representing the alignment of two protein/nucleotide sequences.

It is a pure client-side Javascript application written with React.

History: The original app was written in Java by Marco Pagni and Thomas Junier (Vital-IT).
Java is no more supported by modern web browsers, so it has to be rewritten
with a more modern design, new technologies, and hopefully performance improvements.

Original app: http://myhits.isb-sib.ch/cgi-bin/dotlet

Source files: ftp://ftp.isrec.isb-sib.ch/pub/software/java/dotlet/

Publication: http://bioinformatics.oxfordjournals.org/cgi/content/abstract/16/2/178

Vital-IT, 2016 - julien.delafontaine@sib.swiss


Build from source
-----------------

Install node.js and npm, then

```
npm install     
node run build [--release] 
``` 

Start the server
----------------

```
node run start [--release]
```

Run tests
---------

```
npm run test[:watch]
```
