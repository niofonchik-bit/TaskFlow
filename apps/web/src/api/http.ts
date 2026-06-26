export interface ApiResponse<T> {
    data: T;
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

/** описывает ошибку API с HTTP-статусом */
export class ApiError extends Error {
    status: number;
    details: unknown;

    /** создает ошибку API */
    constructor(message: string, status: number, details: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}

/** выполняет запрос к API с передачей HttpOnly cookie */
export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    const headers = new Headers(options.headers);
    const body =
        options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body);

    if (options.body !== undefined && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(path, {
        ...options,
        headers,
        body: options.body === undefined ? undefined : body,
        credentials: 'include',
    });

    const result = await parseResponse(response);

    if (!response.ok) {
        throw new ApiError(getErrorMessage(result), response.status, result);
    }

    return (result as ApiResponse<T>).data;
}

/** разбирает JSON-ответ без падения на пустом body */
async function parseResponse(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}

/** получает человекочитаемое сообщение ошибки */
function getErrorMessage(result: unknown): string {
    if (isObjectWithMessage(result)) {
        return Array.isArray(result.message)
            ? result.message.join(', ')
            : String(result.message);
    }

    return 'не удалось выполнить запрос';
}

/** проверяет наличие поля message */
function isObjectWithMessage(
    value: unknown,
): value is { message: string | string[] } {
    return typeof value === 'object' && value !== null && 'message' in value;
}
