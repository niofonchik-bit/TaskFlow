import { useEffect, useRef, useState, type ChangeEvent } from 'react';

interface TestRecordFile {
    fileName: string;
    mimeType: string;
    size: number;
    previewUrl: string | null;
}

interface TestRecord {
    id: number;
    name: string;
    createdAt: string;
    file: TestRecordFile | null;
}

interface TestRecordsResponse {
    data: TestRecord[];
}

interface TestRecordResponse {
    data: TestRecord;
}

interface DownloadResponse {
    data: {
        url: string;
        expiresIn: number;
    };
}

/** получает тестовые записи */
async function fetchTestRecords(signal?: AbortSignal): Promise<TestRecord[]> {
    const response = await fetch('/JS/test/list', {
        signal,
    });

    if (!response.ok) {
        throw new Error(`API вернул ошибку ${response.status}`);
    }

    const result = (await response.json()) as TestRecordsResponse;

    return result.data;
}

/** форматирует дату */
function formatCreatedAt(createdAt: string): string {
    return new Date(createdAt).toLocaleString('ru-RU');
}

/** форматирует размер файла */
function formatFileSize(size: number): string {
    if (size < 1024) {
        return `${size} Б`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} КБ`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} МБ`;
}

/** отображает проверку PostgreSQL и Railway Bucket */
export default function TestRecordsPage() {
    const [records, setRecords] = useState<TestRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingRecordId, setUpdatingRecordId] = useState<number | null>(
        null,
    );
    const [downloadingRecordId, setDownloadingRecordId] = useState<
        number | null
    >(null);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectedRecordIdRef = useRef<number | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadRecords() {
            try {
                const loadedRecords = await fetchTestRecords(controller.signal);

                setRecords(loadedRecords);
            } catch (requestError: unknown) {
                if (
                    requestError instanceof DOMException &&
                    requestError.name === 'AbortError'
                ) {
                    return;
                }

                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : 'Не удалось загрузить записи',
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadRecords();

        return () => controller.abort();
    }, []);

    /** открывает системное окно выбора файла */
    function openFileDialog(recordId: number) {
        selectedRecordIdRef.current = recordId;
        fileInputRef.current?.click();
    }

    /** загружает выбранный файл */
    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        const recordId = selectedRecordIdRef.current;

        event.target.value = '';

        if (!file || recordId === null) {
            return;
        }

        setUpdatingRecordId(recordId);
        setError(null);

        try {
            const formData = new FormData();

            formData.append('file', file);

            const response = await fetch(`/JS/test/${recordId}/file`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(
                    `Не удалось сохранить файл: ${response.status}`,
                );
            }

            const result = (await response.json()) as TestRecordResponse;

            setRecords((currentRecords) =>
                currentRecords.map((record) =>
                    record.id === result.data.id ? result.data : record,
                ),
            );
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Не удалось сохранить файл',
            );
        } finally {
            setUpdatingRecordId(null);
            selectedRecordIdRef.current = null;
        }
    }

    /** скачивает файл записи */
    async function handleDownload(record: TestRecord) {
        if (!record.file) {
            return;
        }

        setDownloadingRecordId(record.id);
        setError(null);

        try {
            const response = await fetch(`/JS/test/${record.id}/file/download`);

            if (!response.ok) {
                throw new Error(`Не удалось получить файл: ${response.status}`);
            }

            const result = (await response.json()) as DownloadResponse;

            const link = document.createElement('a');

            link.href = result.data.url;
            link.download = record.file.fileName;
            link.rel = 'noopener';
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Не удалось скачать файл',
            );
        } finally {
            setDownloadingRecordId(null);
        }
    }

    return (
        <main className='test_page'>
            <input
                ref={fileInputRef}
                className='test_page_file_input'
                type='file'
                onChange={handleFileChange}
            />

            <h1>Проверка TaskFlow</h1>

            {isLoading && <p>Загрузка записей...</p>}
            {error && <p role='alert'>Ошибка: {error}</p>}

            {!isLoading && !error && records.length === 0 && (
                <p>Тестовые записи отсутствуют.</p>
            )}

            {records.length > 0 && (
                <ul className='test_record_list'>
                    {records.map((record) => {
                        const isUpdating = updatingRecordId === record.id;
                        const isDownloading = downloadingRecordId === record.id;

                        return (
                            <li key={record.id} className='test_record'>
                                <div className='test_record_content'>
                                    <strong>
                                        {record.id}. {record.name}
                                    </strong>

                                    <span>
                                        {formatCreatedAt(record.createdAt)}
                                    </span>

                                    {record.file && (
                                        <span>
                                            {record.file.fileName} ·{' '}
                                            {formatFileSize(record.file.size)}
                                        </span>
                                    )}

                                    <div className='test_record_actions'>
                                        <button
                                            type='button'
                                            disabled={isUpdating}
                                            onClick={() =>
                                                openFileDialog(record.id)
                                            }
                                        >
                                            {isUpdating
                                                ? 'Сохранение...'
                                                : record.file
                                                  ? 'Изменить файл'
                                                  : 'Добавить файл'}
                                        </button>

                                        {record.file && (
                                            <button
                                                type='button'
                                                disabled={isDownloading}
                                                onClick={() =>
                                                    void handleDownload(record)
                                                }
                                            >
                                                {isDownloading
                                                    ? 'Подготовка...'
                                                    : 'Скачать'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className='test_record_preview'>
                                    {record.file?.previewUrl ? (
                                        <img
                                            src={record.file.previewUrl}
                                            alt={record.file.fileName}
                                        />
                                    ) : (
                                        <span>
                                            {record.file
                                                ? 'Предпросмотр недоступен'
                                                : 'Файл не выбран'}
                                        </span>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}
