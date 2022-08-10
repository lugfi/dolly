Deployment dolly:

0. Tener un dominio apuntando a la IP donde corre dolly (obligatorio)
1. tener en el root del proyecto la ultima db de dolly (gente.txt) (no olvidar bkpear)
2. $LETSENCRYPT_EMAIL="correoadmin@d.com" DOLLY_DOMAIN="dominiodlly.com"  docker-compose up --build -d
3. generar valoraciones docentes, que luego el frontend consume -> docker exec -it <hash-container> analitics/analisis.sh
