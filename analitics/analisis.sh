#!/bin/bash
checksum=/var/www/html/checksum-gente.md5
gente=/var/www/html/gente.txt
if md5sum -c $checksum; then
    echo "El archivo gente.txt no fue modificado"
else
    echo "Se modifico el archivo gente.txt"
    cd /var/www/html/analitics
    echo -------- >> analisis.log
    date >> analisis.log
    /usr/bin/python3 Analisis.py 2 >> analisis.log
    md5sum $gente > $checksum
fi

