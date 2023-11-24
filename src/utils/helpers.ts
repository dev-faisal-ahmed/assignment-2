export function errorResponse(
  message: string = 'Something went wrong',
  code: number = 400,
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
