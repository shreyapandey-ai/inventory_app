This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# inventory_app

## Backend API Routes

The backend API routes are available under the `/api` prefix when running the app locally (default base URL: `http://localhost:3000`). Below are the routes included in this project with typical HTTP methods, example request bodies, and example curl commands you can use in Postman or a terminal. Adjust request bodies/headers to match your app's actual validation.

- **Register**
	- URL: `/api/auth/register`
	- Method: `POST`
	- Description: Create a new user account.
	- Example JSON body:
		```json
		{"name": "Alice", "email": "alice@example.com", "password": "secret"}
		```
	- Example curl:
		```bash
		curl -X POST http://localhost:3000/api/auth/register \
			-H "Content-Type: application/json" \
			-d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
		```

- **Login**
	- URL: `/api/auth/login`
	- Method: `POST`
	- Description: Authenticate and receive a session token (if implemented).
	- Example JSON body:
		```json
		{"email": "alice@example.com", "password": "secret"}
		```
	- Example curl:
		```bash
		curl -X POST http://localhost:3000/api/auth/login \
			-H "Content-Type: application/json" \
			-d '{"email":"alice@example.com","password":"secret"}'
		```

- **Categories**
	- URL: `/api/categories`
	- Methods: `GET` (list), `POST` (create)
	- Example create body:
		```json
		{"name":"Electronics"}
		```
	- Example curl (create):
		```bash
		curl -X POST http://localhost:3000/api/categories \
			-H "Content-Type: application/json" \
			-d '{"name":"Electronics"}'
		```

- **Products (list / create)**
	- URL: `/api/products`
	- Methods: `GET` (list), `POST` (create)
	- Example create body:
		```json
		{"name":"Widget","sku":"WGT-001","price":9.99,"stock":100,"categoryId":1,"supplierId":1}
		```
	- Example curl (create):
		```bash
		curl -X POST http://localhost:3000/api/products \
			-H "Content-Type: application/json" \
			-d '{"name":"Widget","sku":"WGT-001","price":9.99,"stock":100,"categoryId":1,"supplierId":1}'
		```

- **Product (by id)**
	- URL: `/api/products/{id}` (e.g. `/api/products/1`)
	- Methods: `GET` (retrieve), `PUT` (update), `DELETE` (delete) — depending on implementation
	- Example curl (GET):
		```bash
		curl http://localhost:3000/api/products/1
		```

- **Bulk products**
	- URL: `/api/products/bulk`
	- Method: `POST`
	- Description: Bulk create or import products (payload depends on implementation).
	- Example curl:
		```bash
		curl -X POST http://localhost:3000/api/products/bulk \
			-H "Content-Type: application/json" \
			-d '[{"name":"A","sku":"A1","price":1.0},{"name":"B","sku":"B1","price":2.0}]'
		```

- **Update stock**
	- URL: `/api/products/update-stock`
	- Method: `POST`
	- Description: Update inventory stock levels (single or multiple). Example body and behavior depend on your implementation.
	- Example JSON body:
		```json
		[{"id":1,"stock":90},{"id":2,"stock":50}]
		```

- **Suppliers**
	- URL: `/api/suppliers`
	- Methods: `GET` (list), `POST` (create)
	- Example create body:
		```json
		{"name":"Acme Supplies","email":"sales@acme.example"}
		```
	- Example curl (create):
		```bash
		curl -X POST http://localhost:3000/api/suppliers \
			-H "Content-Type: application/json" \
			-d '{"name":"Acme Supplies","email":"sales@acme.example"}'
		```

- **AI Report**
	- URL: `/api/ai/report`
	- Method: `POST`
	- Description: Generate or request an AI-based report (payload depends on implementation in `app/api/ai/report/route.ts`).
	- Example curl:
		```bash
		curl -X POST http://localhost:3000/api/ai/report \
			-H "Content-Type: application/json" \
			-d '{"type":"inventory_summary","params":{}}'
		```

Notes and testing tips:

- Use `Content-Type: application/json` header for JSON bodies.
- Some routes may require authentication — include `Authorization: Bearer <token>` header if the route enforces auth.
- Replace `http://localhost:3000` with your deployed URL when testing remotely.
- If an endpoint returns validation errors, inspect the response body for expected fields.

Postman quick checklist:

1. Create a new environment with `baseUrl` set to `http://localhost:3000`.
2. Add requests using `{{baseUrl}}/api/<route>` and set method + headers.
3. For protected routes, add an `Authorization` header with `Bearer <token>` if you obtained a token from `/api/auth/login`.

If you want, I can run the dev server and test each endpoint against the local API and paste sample responses below — tell me if you'd like me to proceed.
