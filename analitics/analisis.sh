#!/bin/bash
cd /var/www/html/analitics
echo -------- >> analisis.log
date >> analisis.log
/root/anaconda3/bin/python3 Analisis.py 2>> analisis.log

