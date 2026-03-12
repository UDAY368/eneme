# ENEME API Contract

Base URL: `http://localhost:4000/api` (or `NEXT_PUBLIC_API_URL`)

Authentication: JWT Bearer token in `Authorization` header for protected routes.

---

## Auth

### POST /auth/login
**Public**

Request:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": { "id": "string", "username": "string" }
}
```

---

## Analytics

### GET /analytics
**Auth Required**

Query params: `filter` (daywise|monthwise), `year` (number), `month` (number, required when filter=daywise)

Response:
```json
{
  "totalVisits": 0,
  "totalLeads": 0,
  "chartData": {
    "leads": [{ "label": "string", "count": 0 }],
    "visits": [{ "label": "string", "count": 0 }]
  }
}
```

---

## Visits

### POST /visits
**Public** - Track page visit (for analytics)

Response: `201` with `{ "success": true }`

---

## Leads

### POST /leads
**Public** - Form submission from "Start Our Journey"

Request:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string?",
  "company": "string?",
  "projectType": "string?",
  "message": "string?"
}
```

Response: `201` with lead object

### GET /leads
**Auth Required**

Query params: `filter` (all|today|week|month|custom), `reviewed` (true|false), `year`, `month` (for custom)

Response:
```json
{
  "leads": [{
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string|null",
    "company": "string|null",
    "projectType": "string|null",
    "message": "string|null",
    "reviewed": false,
    "createdAt": "ISO8601"
  }],
  "totalCount": 0
}
```

### GET /leads/count
**Auth Required** - Total leads count

Response: `{ "totalCount": 0 }`

### PATCH /leads/:id/review
**Auth Required** - Mark lead as reviewed

Response: Updated lead object

---

## Portfolio

### GET /portfolio/categories
**Public**

Response: Array of `{ id, name, _count?: { subCategories, portfolios } }`

### GET /portfolio/subcategories
**Public**

Query: `categoryId` (optional) - filter by category

Response: Array of `{ id, categoryId, name, category?: { name } }`

### GET /portfolio
**Public**

Query: `categoryId`, `subCategoryId` (optional filters)

Response: Array of portfolio items

### GET /portfolio/stats
**Public**

Response: `{ totalPortfolios, totalCategories, totalSubCategories }`

### GET /portfolio/:id
**Public** - Single portfolio

### POST /portfolio/categories
**Auth Required**

Request: `{ "name": "string" }`

### PUT /portfolio/categories/:id
**Auth Required**

Request: `{ "name": "string" }`

### DELETE /portfolio/categories/:id
**Auth Required**

### POST /portfolio/subcategories
**Auth Required**

Request: `{ "categoryId": "string", "name": "string" }`

### PUT /portfolio/subcategories/:id
**Auth Required**

Request: `{ "name": "string" }`

### DELETE /portfolio/subcategories/:id
**Auth Required**

### POST /portfolio
**Auth Required**

Request:
```json
{
  "categoryId": "string",
  "subCategoryId": "string",
  "imageUrl": "string?",
  "videoUrl": "string?",
  "year": "string?",
  "heading": "string",
  "description": "string?",
  "company": "string?",
  "chips": ["string"]
}
```

### PUT /portfolio/:id
**Auth Required**

### DELETE /portfolio/:id
**Auth Required**

---

## Blog

### GET /blog
**Public** - List all blogs

### GET /blog/count
**Public**

Response: `{ "totalBlogs": 0 }`

### GET /blog/:id
**Public** - Single blog

### POST /blog
**Auth Required**

Request:
```json
{
  "chipTitle": "string?",
  "blogTitle": "string",
  "blogDescription": "string?",
  "date": "ISO8601?",
  "timeToRead": "string?",
  "imageUrl": "string?",
  "content": "string?"
}
```

### PUT /blog/:id
**Auth Required**

### DELETE /blog/:id
**Auth Required**
