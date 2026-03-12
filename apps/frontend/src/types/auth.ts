// src/types/auth.ts
export interface LoginRequest {
    password: string;
  }
  
  export interface LoginResponse {
    message: string;
  }
  
  export interface ErrorResponse {
    error: string;
  }