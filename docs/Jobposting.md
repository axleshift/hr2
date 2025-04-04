# Post Job Posting

## Endpoint

`POST /request/jobposting`

## Description

This API allows external HR systems to create a job posting. The request must include job details such as title, responsibilities, requirements, qualifications, benefits, category, and capacity.

## Headers

| Key         | Type   | Required | Description                 |
| ----------- | ------ | -------- | --------------------------- |
| `x-api-key` | String | Yes      | API key for authentication. |

## Request Body

| Parameter        | Type   | Required | Description                                         |
| --------------- | ------ | -------- | --------------------------------------------------- |
| `title`         | String | Yes      | Job title.                                         |
| `responsibilities` | String | Yes      | Job responsibilities.                              |
| `requirements`  | String | Yes      | Job requirements.                                  |
| `qualifications` | String | Yes      | Qualifications required for the job.               |
| `benefits`      | String | Yes      | Benefits offered for the job.                      |
| `category`      | String | Yes      | Category of the job posting. Must be one of `internship`, `full-time`, `part-time`, `contract`, `temporary`, or `freelance`. |
| `capacity`      | Number | No       | Number of positions available. Default is 1.      |

## Responses

### **Success Response**

**Status Code: 201**

```json
{
  "message": "New job created",
  "data": {
    "_id": "60d5f9e7c3b7f814b56fa300",
    "title": "Software Engineer",
    "responsibilities": "Develop and maintain applications",
    "requirements": "Experience with JavaScript and Node.js",
    "qualifications": "Bachelor's degree in Computer Science",
    "benefits": "Health insurance, 401k, remote work options",
    "category": "Engineering",
    "capacity": 3,
    "createdAt": "2024-04-03T12:00:00Z"
  }
}
```

### **Error Responses**

#### **Invalid API Key**

**Status Code: 403**

```json
{
  "message": "Invalid or missing API key"
}
```

#### **Missing Required Fields**

**Status Code: 400**

```json
{
  "message": "All fields are required"
}
```

#### **Job Creation Failure**

**Status Code: 500**

```json
{
  "message": "Job not created"
}
```

#### **Server Error**

**Status Code: 500**

```json
{
  "message": "Internal server error"
}
```

## Example Requests

### **Successful Job Posting**

```http
POST /request/jobposting HTTP/1.1
Host: https://backend-hr2.axleshift.com/api/v1/
Content-Type: application/json
x-api-key: your-api-key

{
  "title": "Software Engineer",
  "responsibilities": "Develop and maintain applications",
  "requirements": "Experience with JavaScript and Node.js",
  "qualifications": "Bachelor's degree in Computer Science",
  "benefits": "Health insurance, 401k, remote work options",
  "category": "full-time",
  "capacity": 3
}
```

### **Request with Missing Fields**

```http
POST /request/jobposting HTTP/1.1
Host: https://backend-hr2.axleshift.com/api/v1/
Content-Type: application/json
x-api-key: your-api-key

{
  "title": "Software Engineer",
  "responsibilities": "Develop and maintain applications"
}
```

**Response:**

```json
{
  "message": "All fields are required"
}
```

## Get All Job Postings

### Endpoint

`GET /request/jobposting`

### Description

This API allows external HR systems to retrieve all job postings created by the system. It supports optional search queries, pagination, and sorting. Authentication via API key is required.

### Headers

| Key         | Type   | Required | Description                 |
| ----------- | ------ | -------- | --------------------------- |
| `x-api-key` | String | Yes      | API key for authentication. |

### Query Parameters

| Parameter  | Type   | Required | Description                                                                 |
| ---------- | ------ | -------- | --------------------------------------------------------------------------- |
| `query`    | String | No       | Search keyword to filter jobs by title, category, responsibilities, or requirements. |
| `page`     | Number | No       | Page number for pagination. Default is 1.                                   |
| `limit`    | Number | No       | Number of results per page. Default is 10.                                  |
| `sort`     | String | No       | Sort order of results by creation date. Use `asc` or `desc`. Default is `asc`. |

### Responses

#### **Success Response**

**Status Code: 200**

```json
{
  "data": [
    {
      "_id": "60d5f9e7c3b7f814b56fa300",
      "title": "Software Engineer",
      "responsibilities": "Develop and maintain applications",
      "requirements": "Experience with JavaScript and Node.js",
      "qualifications": "Bachelor's degree in Computer Science",
      "benefits": "Health insurance, 401k, remote work options",
      "category": "full-time",
      "capacity": 3,
      "createdAt": "2024-04-03T12:00:00Z"
    },
    ...
  ],
  "totalItems": 42,
  "totalPages": 5,
  "currentPage": 1
}
```

#### **Invalid API Key**

**Status Code: 403**

```json
{
  "message": "Invalid or missing API key"
}
```

#### **Server Error**

**Status Code: 500**

```json
{
  "message": "Internal Server Error"
}
```

### Example Requests

#### **Successful Job Fetch**

```http
GET /request/jobposting?query=engineer&page=1&limit=5&sort=desc HTTP/1.1
Host: https://backend-hr2.axleshift.com/api/v1/
x-api-key: your-api-key
```

**Response:**

```json
{
  "data": [
    {
      "_id": "60d5f9e7c3b7f814b56fa300",
      "title": "Software Engineer",
      "responsibilities": "Develop and maintain applications",
      "requirements": "Experience with JavaScript and Node.js",
      "qualifications": "Bachelor's degree in Computer Science",
      "benefits": "Health insurance, 401k, remote work options",
      "category": "full-time",
      "capacity": 3,
      "createdAt": "2024-04-03T12:00:00Z"
    }
  ],
  "totalItems": 1,
  "totalPages": 1,
  "currentPage": 1
}
```

