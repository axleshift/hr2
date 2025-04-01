# API Documentation: Get Applicant Documents

## Endpoint
`GET /request/applicants/document/:documentType`

## Description
This API retrieves applicant documents based on the document type (`screening` or `interview`). It also supports searching documents by title, description, or author.

## Headers
| Key           | Type   | Required | Description                      |
|--------------|--------|----------|----------------------------------|
| `x-api-key`  | String | Yes      | API key for authentication.     |

## Path Parameters
| Parameter      | Type   | Required | Description                         |
|--------------|--------|----------|-------------------------------------|
| `documentType` | String | Yes      | Type of document (`screening` or `interview`). |

## Query Parameters
| Parameter  | Type   | Required | Description                                  |
|-----------|--------|----------|----------------------------------------------|
| `query`   | String | No       | Search term for filtering documents.        |

## Responses

### **Success Response**
**Status Code: 200**
```json
{
  "message": "Documents found!",
  "documentType": "screening",
  "data": [
    {
      "_id": "60d5f9e7c3b7f814b56fa181",
      "title": "Screening Report 2024",
      "description": "Detailed screening report for applicant.",
      "author": "HR Team",
      "createdAt": "2024-03-15T12:00:00Z"
    }
  ]
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

#### **Missing Document Type**
**Status Code: 400**
```json
{
  "message": "Document Type is required"
}
```

#### **Invalid Document Type**
**Status Code: 400**
```json
{
  "message": "Please use a valid document type"
}
```

#### **No Documents Found**
**Status Code: 404**
```json
{
  "message": "No documents found"
}
```

#### **Server Error**
**Status Code: 500**
```json
{
  "message": "An error occurred",
  "error": "Error details"
}
```

## Example Requests
### Request with Search Query
```http
GET /request/applicants/document/screening?query=report HTTP/1.1
Host: backend-hr2.axleshift.com
x-api-key: your-api-key
```

### Request Without Search Query
```http
GET /request/applicants/document/interview HTTP/1.1
Host: backend-hr2.axleshift.com
x-api-key: your-api-key
```

