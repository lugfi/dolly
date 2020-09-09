#!/bin/bash
checksum=/var/www/html/checksum-gente.md5
gente=/var/www/html/gente.txt
log=/var/www/html/analitics/analisis.log
if md5sum -c $checksum; then
    echo "El archivo gente.txt no fue modificado"
else
    cd /var/www/html/analitics
    echo -------- >> $log
    date >> $log
    /usr/local/bin/python3.8 Analisis.py 2 >> $log
    echo "El archivo gente.txt fue modificado" >> $log
    md5sum $gente > $checksum
fi

