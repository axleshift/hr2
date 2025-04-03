# Get Applicant Documents

## Endpoint

`GET /applicants/documents/:documentType`

## Description

This API retrieves applicant documents based on the document type (`screening` or `interview`). It also supports searching documents by applicant, reviewer/interviewer, status, recommendation, job, type, or final comments.

## Headers

| Key         | Type   | Required | Description                 |
| ----------- | ------ | -------- | --------------------------- |
| `x-api-key` | String | Yes      | API key for authentication. |

## Path Parameters

| Parameter      | Type   | Required | Description                                    |
| -------------- | ------ | -------- | ---------------------------------------------- |
| `documentType` | String | Yes      | Type of document (`screening` or `interview`). |

## Query Parameters

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| `query`   | String | No       | Search term for filtering documents. |

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
      "applicant": {
        "_id": "60d5f9e7c3b7f814b56fa100",
        "firstname": "John",
        "lastname": "Doe",
        "middlename": "M"
      },
      "reviewer": {
        "_id": "60d5f9e7c3b7f814b56fa101",
        "firstname": "Jane",
        "lastname": "Smith",
        "role": "HR Manager"
      },
      "status": "Approved",
      "recommendation": "Proceed to interview",
      "job": {
        "_id": "60d5f9e7c3b7f814b56fa200",
        "title": "Software Engineer"
      },
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
GET /applicants/documents/screening?query=John HTTP/1.1
Host: https://backend-hr2.axleshift.com/api/v1/
x-api-key: your-api-key
```

### Request Without Search Query

```http
GET /applicants/documents/interview HTTP/1.1
Host: https://backend-hr2.axleshift.com/api/v1/
x-api-key: your-api-key
```

