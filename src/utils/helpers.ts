export function errorResponse(
  message: string = 'Something went found',
  code: number,
) {
  return {
    success: false,
    message: message,
    error: { code, description: message },
  };
}

export function successResponse(message: string, data: unknown) {
  return {
    success: true,
    message,
    data,
  };
}
