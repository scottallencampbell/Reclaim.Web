nswag run nswag.json
echo 'import { ApiBase } from "./base";' | cat - src/api/schema.ts > temp && mv temp src/api/schema.ts
