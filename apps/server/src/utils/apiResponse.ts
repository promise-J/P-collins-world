import { Response } from "express";

// 1. Define the structural layout type
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
export interface IServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// 2. Export the function variable using modern arrow syntax
export const apiResponse = <T>(res: Response, success: boolean, message: string, data?: any) => {
  const statusCode = success ? 200 : 400;
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const serviceResponse = <T>(success: boolean, message: string, data?: T): any => {
  return {
    success,
    message,
    data,
  };
};
