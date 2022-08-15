import { Response } from "express";

export const generateUniqueId = (len: number) => {
    return Math.random().toString(36).substr(2, len)
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
};

export type meta = {
  current_page: number,
  records_per_page: number,
  total_records: number,
  previous_page?: number,
  next_page?: number,
  last_page: number,
};

export const initializeMeta = {
  current_page: 0,
  records_per_page: 0,
  total_records: 0,
  last_page: 0,
};

export type paginatedResponse = {
  data: any,
  meta: meta,
};

export const sendPaginatedReponse = (
  data: any,
  total_records: number,
  pageNo: number,
  limit: number,
  ) => {
  const response: paginatedResponse = { data: null, meta: initializeMeta };
  const lastPage = Math.ceil(total_records / limit);
  response.data = data;
  response.meta.current_page = pageNo;
  response.meta.records_per_page = limit;
  response.meta.total_records = total_records;
  response.meta.last_page = lastPage;

  if (pageNo > 0) {
    response.meta.previous_page = pageNo - 1;
  }

  if ((pageNo * limit) < total_records) {
    response.meta.next_page = pageNo + 1;
  }
  return response;
};

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any,
  meta?: meta,
) => {
  res.set(headers);
  res.status(statusCode || 200).json({
    statusCode,
    message,
    data,
    meta,
    success: true,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
) => {
  res.set(headers);
  res.status(statusCode || 400).json({
    statusCode,
    message,
    data,
    success: false,
  });
};