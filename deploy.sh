docker run -p 3000:3000 \
  -v $(pwd)/lightdetail-api-db:/app/data \
  -e PORT="3000" \
  -e NODE_ENV="production" \
  -e DATABASE_URL="file:data/prod.db" \
  -e BETTER_AUTH_SECRET="eDjmWKiJJdROrq7xBCshhKDO664ew5C9" \
  -e BETTER_AUTH_URL="http://localhost:3000" \
  -e LOG_LEVEL="debug" \
  lightdetail-api

  