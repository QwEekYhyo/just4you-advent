# **API Documentation**

## **POST `/login`**

### Description

Log in using user credentials.

### Request

| Field        | Value              |
| ------------ | ------------------ |
| Method       | `POST`             |
| URL          | `/login`           |
| Auth         | None               |
| Content-Type | `application/json` |

**Body**

```json
{ "username": "logan", "password": "pwd" }
```

### Response

| Returns   |
| --------- |
| JWT token |

---

## **GET `/me`**

### Description

Fetch info about the authenticated user.

### Request

| Field  | Value                 |
| ------ | --------------------- |
| Method | `GET`                 |
| URL    | `/me`                 |
| Auth   | Bearer token required |

### Response

| Returns    |
| ---------- |
| User model |

---

## **GET `/my-calendar`**

### Description

Get the calendar associated with the authenticated user.

### Request

| Field  | Value                 |
| ------ | --------------------- |
| Method | `GET`                 |
| URL    | `/my-calendar`        |
| Auth   | Bearer token required |

### Response

| Returns        |
| -------------- |
| Calendar model |

---

## **GET `/my-calendar/open/<day>`**

### Description

Open the specified day in the advent calendar.

### Request

| Field  | Value                     |
| ------ | ------------------------- |
| Method | `GET`                     |
| URL    | `/my-calendar/open/<day>` |
| Auth   | Bearer token required     |

### Response

| Returns         |
| --------------- |
| Success message |

---

## **GET `/images/<day>`**

### Description

Fetch the image associated with a specific calendar day.

### Request

| Field  | Value                 |
| ------ | --------------------- |
| Method | `GET`                 |
| URL    | `/images/<day>`       |
| Auth   | Bearer token required |

### Response

| Returns           |
| ----------------- |
| Binary image data |

---

## **POST `/register`** (admin-only)

### Description

Register a new user.

### Request

| Field        | Value                         |
| ------------ | ----------------------------- |
| Method       | `POST`                        |
| URL          | `/register`                   |
| Auth         | Bearer token (admin required) |
| Content-Type | `application/json`            |

**Body**

```json
{
    "username": "logan",
    "password": "pwd",
    "name": "Logan",
    "calendar_id": 1,
    "is_admin": "false"
}
```

### Response

| Returns      |
| ------------ |
| Created User |

---

## **POST `/calendars`** (admin-only)

### Description

Create a new calendar.

### Request

| Field        | Value                         |
| ------------ | ----------------------------- |
| Method       | `POST`                        |
| URL          | `/calendars`                  |
| Auth         | Bearer token (admin required) |
| Content-Type | `multipart/form-data`         |

**Form Data**

| Field    | Type       | Example                 |
| -------- | ---------- | ----------------------- |
| `name`   | text       | `New Calendar`          |
| `images` | file (zip) | `@/path/to/zip/archive` |

### Response

| Returns          |
| ---------------- |
| Created Calendar |

---

## **GET `/calendars/<id>`** (admin-only)

### Description

Get a calendar by its ID.

### Request

| Field  | Value                         |
| ------ | ----------------------------- |
| Method | `GET`                         |
| URL    | `/calendars/<id>`             |
| Auth   | Bearer token (admin required) |

### Response

| Returns        |
| -------------- |
| Calendar model |
