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
