import { useEffect, useState } from "react";

interface TestRecord {
  id: number;
  name: string;
  createdAt: string;
}

interface TestRecordsResponse {
  data: TestRecord[];
}

/** получает тестовую запись через прокси Vite */
async function fetchTestRecords(signal: AbortSignal): Promise<TestRecord[]> {
  const response = await fetch("/JS/test/list", { signal });

  if (!response.ok) {
    throw new Error(`API вернул ошибку ${response.status}`);
  }

  const result = (await response.json()) as TestRecordsResponse;

  return result.data;
}

/** форматирует дату записи для отображения */
function formatCreatedAt(createdAt: string): string {
  return new Date(createdAt).toLocaleString("ru-RU");
}

/** отображает результат проверки цепочки React, NestJS и PostgreSQL */
export default function App() {
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // отменяет запрос при размонтировании компонента
    const controller = new AbortController();

    /** загружает запись и обновляет состояние страницы */
    async function loadRecords() {
      try {
        const loadedRecords = await fetchTestRecords(controller.signal);

        setRecords(loadedRecords);
      } catch (requestError: unknown) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Не удалось загрузить записи",
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

  return (
    <main>
      <h1>Проверка TaskFlow</h1>

      {isLoading && <p>Загрузка записей...</p>}
      {error && <p role="alert">Ошибка: {error}</p>}

      {!isLoading && !error && records.length === 0 && (
        <p>Тестовые записи отсутствуют.</p>
      )}

      {!error && records.length > 0 && (
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              <strong>
                {record.id}. {record.name}
              </strong>
              <div>{formatCreatedAt(record.createdAt)}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
