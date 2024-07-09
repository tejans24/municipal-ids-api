![API Tests](https://github.com/tejans24/municipal-ids-api/actions/workflows/ci.yml/badge.svg)

[Unit and Integration Test CI Actions Here](https://github.com/tejans24/municipal-ids-api/actions)

# API Documentation

This module provides an API for registering users, retrieving user details, and verifying user information. It utilizes the `MunicipalIDService` to manage user data and residency verification.

## Functions

### `registerUser(requestUser: User): Promise<RegisterUserResponse | { error: string }>`

Registers a new user based on the provided user details.

**Parameters**:

- `requestUser` (User): User details for registration.

**Returns**:

- `Promise<RegisterUserResponse | { error: string }>`: A promise that resolves to a `RegisterUserResponse` object containing the user's ID, city residency status, and subscribed services, or an object with an `error` property if an error occurs.

### `getUser(userId: string): Promise<User | { error: string }>`

Retrieves a user based on their ID.

**Parameters**:

- `userId` (string): ID of the user to be retrieved.

**Returns**:

- `Promise<User | { error: string }>`: A promise that resolves to a `User` object or an object with an `error` property if an error occurs.

### `verifyUser(userId: string): Promise<VerifyUserResponse | { error: string }>`

Provides basic user verification details.

**Parameters**:

- `userId` (string): ID of the user to be verified.

**Returns**:

- `Promise<VerifyUserResponse | { error: string }>`: A promise that resolves to a `VerifyUserResponse` object or an object with an `error` property if an error occurs.

## Types

### `RegisterUserResponse`

type RegisterUserResponse = {
message: string;
id: string;
cityResidencyStatus?: RESIDENCY_VERIFICATION_STATUS;
services: UserSubscribedService[];
};

Represents the response object returned by the `registerUser` function.

### `User`

type User = {
id: string;
name: string;
email: string;
residencyVerificationStatus: RESIDENCY_VERIFICATION_STATUS;
services: UserSubscribedService[];
};

Represents a user object.

### `UserSubscribedService`

type UserSubscribedService = {
name: string;
description: string;
};

Represents a service subscribed by a user.

### `VerifyUserResponse`

type VerifyUserResponse = {
id: string;
name: string;
email: string;
residencyVerificationStatus: RESIDENCY_VERIFICATION_STATUS;
};

Represents the response object returned by the `verifyUser` function.

### `RESIDENCY_VERIFICATION_STATUS`

enum RESIDENCY_VERIFICATION_STATUS {
VERIFIED = "VERIFIED",
PENDING = "PENDING",
REJECTED = "REJECTED",
}

Represents the possible residency verification statuses for a user.

# GitHub Actions

name: Run Tests

on:
push:
branches: [ main ]
pull_request:
branches: [ main ]

jobs:

build:
runs-on: ubuntu-latest

strategy:
matrix:
node-version: [16.x]

steps:

- uses: actions/checkout@v3
- name: Use Node.js ${{ matrix.node-version }}
  with:
  node-version: ${{ matrix.node-version }}
- run: npm ci
- run: npm test
