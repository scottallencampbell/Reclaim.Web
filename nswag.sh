nswag run nswag.json
echo "import { ApiBase } from './base'" | cat - src/api/api.ts > temp && mv temp src/api/api.ts
