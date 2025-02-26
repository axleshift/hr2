## Request Endpoint

### Endpoint
`POST /request/jobposting`

### Description
This endpoint allows you to create a new job posting request.

### Request Headers
- `Content-Type: application/json`
- `x-api-key: <your-api-key>`

### Request Body
The request body should be a JSON object containing the following fields:

- `title`
    - String
    - Required
    - Title of the job
- `description`
    - String
    - Optional
    - Description of the job
- `quantity`
    - Number
    - Required
    - Default: 1
    - Number of positions available
- `location`
    - String
    - Required
    - Default: "Remote"
    - Location of the job
- `jobType`
    - Array of Strings
    - Required
    - Default: ["full time"]
    - Enum: ["full time", "part time", "contract", "internship", "temporary", "other"]
    - Type of job
- `salaryRange`
    - String
    - Required
    - Default: "Not Specified"
    - Salary range for the job
- `contact`
    - String
    - Optional
    - Default: "Not Specified"
    - Contact information
- `email`
    - String
    - Optional
    - Default: "Not Specified"
    - Email address for contact
- `phone`
    - String
    - Optional
    - Default: "Not Specified"
    - Phone number for contact
- `status`
    - String
    - Optional
    - Default: "Pending"
    - Enum: ["Pending", "Approved", "Rejected"]
    - Status of the job posting request

### Example Request
```json
{
    "title": "Software Engineer",
    "description": "Develop and maintain web applications",
    "quantity": 2,
    "location": "New York",
    "jobType": ["full time"],
    "salaryRange": "$70,000 - $90,000",
    "contact": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "status": "Pending"
}
```

### Example Response
```json
{
    "_id": "12345",
    "title": "Software Engineer",
    "description": "Develop and maintain web applications",
    "quantity": 2,
    "location": "New York",
    "jobType": ["full time"],
    "salaryRange": "$70,000 - $90,000",
    "contact": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "status": "Pending",
    "createdAt": "2023-10-01T12:34:56Z",
    "updatedAt": "2023-10-01T12:34:56Z"
}
```

### Endpoint
`GET /request/jobposting/search`

### Description
This endpoint allows you to search for job posting requests based on query parameters.

### Request Headers
- `Content-Type: application/json`
- `x-api-key: <your-api-key>`

### Query Parameters
- `title`
    - String
    - Optional
    - Title of the job
- `location`
    - String
    - Optional
    - Location of the job
- `jobType`
    - String
    - Optional
    - Type of job
- `salaryRange`
    - String
    - Optional
    - Salary range for the job
- `status`
    - String
    - Optional
    - Status of the job posting request

### Example Request
```
GET /request/jobposting/search?title=Software%20Engineer&location=New%20York
```

### Example Response
```json
[
    {
        "_id": "12345",
        "title": "Software Engineer",
        "description": "Develop and maintain web applications",
        "quantity": 2,
        "location": "New York",
        "jobType": ["full time"],
        "salaryRange": "$70,000 - $90,000",
        "contact": "John Doe",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "status": "Pending",
        "createdAt": "2023-10-01T12:34:56Z",
        "updatedAt": "2023-10-01T12:34:56Z"
    }
]
```

### Endpoint
`GET /request/jobposting/:id`

### Description
This endpoint allows you to retrieve a job posting request by its ID.

### Request Headers
- `Content-Type: application/json`
- `x-api-key: <your-api-key>`

### Example Request
```
GET /request/jobposting/12345
```

### Example Response
```json
{
    "_id": "12345",
    "title": "Software Engineer",
    "description": "Develop and maintain web applications",
    "quantity": 2,
    "location": "New York",
    "jobType": ["full time"],
    "salaryRange": "$70,000 - $90,000",
    "contact": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "status": "Pending",
    "createdAt": "2023-10-01T12:34:56Z",
    "updatedAt": "2023-10-01T12:34:56Z"
}
```

### Endpoint
`PUT /request/jobposting/:id`

### Description
This endpoint allows you to update a job posting request by its ID.

### Request Headers
- `Content-Type: application/json`
- `x-api-key: <your-api-key>`

### Request Body
The request body should be a JSON object containing the following fields:

- `title`
    - String
    - Required
    - Title of the job
- `description`
    - String
    - Optional
    - Description of the job
- `quantity`
    - Number
    - Required
    - Default: 1
    - Number of positions available
- `location`
    - String
    - Required
    - Default: "Remote"
    - Location of the job
- `jobType`
    - Array of Strings
    - Required
    - Default: ["full time"]
    - Enum: ["full time", "part time", "contract", "internship", "temporary", "other"]
    - Type of job
- `salaryRange`
    - String
    - Required
    - Default: "Not Specified"
    - Salary range for the job
- `contact`
    - String
    - Optional
    - Default: "Not Specified"
    - Contact information
- `email`
    - String
    - Optional
    - Default: "Not Specified"
    - Email address for contact
- `phone`
    - String
    - Optional
    - Default: "Not Specified"
    - Phone number for contact
- `status`
    - String
    - Required
    - Enum: ["Pending", "Approved", "Rejected"]
    - Status of the job posting request

### Example Request
```json
{
    "title": "Software Engineer",
    "description": "Develop and maintain web applications",
    "quantity": 2,
    "location": "New York",
    "jobType": ["full time"],
    "salaryRange": "$70,000 - $90,000",
    "contact": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "status": "Approved"
}
```

### Example Response
```json
{
    "_id": "12345",
    "title": "Software Engineer",
    "description": "Develop and maintain web applications",
    "quantity": 2,
    "location": "New York",
    "jobType": ["full time"],
    "salaryRange": "$70,000 - $90,000",
    "contact": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "status": "Approved",
    "createdAt": "2023-10-01T12:34:56Z",
    "updatedAt": "2023-10-01T12:34:56Z"
}
```

### Response Codes
- `201 Created`: The job posting request was successfully created.
- `200 OK`: The job posting request was successfully retrieved or updated.
- `400 Bad Request`: The request was invalid or missing required fields.
- `401 Unauthorized`: Authentication failed or user does not have permission.
- `404 Not Found`: The job posting request was not found.
- `500 Internal Server Error`: An error occurred on the server.

## Overview
The Jobposting API allows you to create, search, retrieve, and update job posting requests. This document provides details on the available endpoints and their usage.
