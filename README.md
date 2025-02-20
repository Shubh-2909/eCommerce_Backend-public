# E-Commerce API Documentation


## Authentication

Most endpoints require authentication. Send the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Endpoints

### Users

#### Register a New User

```http
POST /users/register
```

**Body**

```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "password123"
}
```

**Validation**

- Email must be valid
- Full name must be at least 3 characters
- Password must be at least 6 characters

#### Login

```http
POST /users/login
```

**Body**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Verify OTP

```http
POST /users/verify-otp
```

#### Resend OTP

```http
POST /users/resend-otp
```

#### Update User

```http
PUT /users/:userId
```

#### Get User Details

```http
GET /users/:userId
```

### Products

#### Create New Product (Admin Only)

```http
POST /products/new
```

**Headers**

```
Content-Type: multipart/form-data
```

**Note**: Requires file upload

#### Get Latest Products

```http
GET /products/latest
```

#### Get All Categories

```http
GET /products/categories
```

#### Get All Products

```http
GET /products/all
```

#### Get Single Product

```http
GET /products/:id
```

#### Update Product (Admin Only)

```http
PUT /products/:id
```

**Headers**

```
Content-Type: multipart/form-data
```

#### Delete Product (Admin Only)

```http
DELETE /products/:id
```

### Cart

#### Create New Cart

```http
POST /cart/:userId
```

#### Get User's Cart

```http
GET /cart/:userId
```

#### Add/Update Product in Cart

```http
PUT /cart/:userId/:productId
```

#### Remove Product from Cart

```http
DELETE /cart/:userId/:productId
```

### Orders

#### Place Order

```http
POST /orders/:cartId
```

#### Delete Order

```http
PUT /orders/:orderId/:userId
```

## Error Responses

The API returns the following error codes:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Please contact the administrator for specific limits.

## File Upload

- Supported formats: Images (jpg, jpeg, png)
- Maximum file size: Contact administrator for limits

## Notes

- All timestamps are returned in ISO 8601 format
- All requests must be made over HTTPS in production
- Response data is returned in JSON format
