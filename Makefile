build:
	sudo docker build -t syncrest1c:latest .
run:
	sudo docker run -p 5000:5000 -d --name SYNCREST1C --rm --env-file ./.env syncrest1c:latest
idx:
	sudo docker exec -ti SYNCREST1C sh -c "npm run idx"
addip:
	sudo docker exec -ti SYNCREST1C sh -c "node scripts/ip.js add 172.17.0.1"
deleteip:
	sudo docker exec -ti SYNCREST1C sh -c "node scripts/ip.js delete 172.17.0.1"
stop:
	sudo docker stop SYNCREST1C
logs:
	sudo docker logs -f --tail 100 SYNCREST1C
