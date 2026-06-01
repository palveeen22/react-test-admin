# Архитектура проекта

Проект построен по методологии **Feature-Sliced Design (FSD)** — архитектуре, разделяющей код по бизнес-ответственности с чёткими правилами импортов между слоями.

## Иерархия слоёв

```
app → pages → widgets → features → entities → shared
```

Каждый слой может импортировать только из слоёв **ниже** себя, но не выше.

---

## Структура директорий

```
src/
├── app/                              # Инициализация приложения
│   ├── providers/
│   │   ├── storeContext.ts           # Singleton store + StoreContext (createContext)
│   │   ├── StoreProvider.tsx         # Провайдер контекста для дерева компонентов
│   │   └── useStore.ts               # Хук useStore() — доступ к RootStore из любого компонента
│   ├── store/
│   │   ├── RootStore.ts              # Корневая MST-модель (meters + areas + modal)
│   │   └── index.ts
│   ├── styles/
│   │   └── GlobalStyles.ts           # Глобальный CSS-сброс
│   ├── ui/
│   │   └── ModalRoot.tsx             # Observer-обёртка ConfirmModal, монтируется в App
│   └── App.tsx                       # Корневой компонент, оборачивает дерево в ErrorBoundary, монтирует IconSprite и ModalRoot
│
├── pages/                            # Страницы (уровень роутинга)
│   └── meters-page/
│       ├── ui/
│       │   └── MetersPage.tsx        # Лейаут, запускает начальный fetch, sync URL ?page=N
│       └── index.ts
│
├── widgets/                          # Автономные UI-блоки
│   └── meters-table/
│       ├── ui/
│       │   ├── MetersTable.tsx       # Таблица: скелетон / ошибка / пустое состояние / строки + логика открытия модала
│       │   ├── MetersTableHeader.tsx # Липкий <thead>
│       │   └── SkeletonRows.tsx      # Shimmer-скелетон (20 строк с анимацией), рендерится при isLoading
│       └── index.ts
│
├── features/                         # Пользовательские действия
│   ├── delete-meter/
│   │   ├── ui/
│   │   │   └── DeleteButton.tsx      # Кнопка удаления с SVG-иконкой из спрайта
│   │   └── index.ts
│   └── meters-pagination/
│       ├── ui/
│       │   └── Pagination.tsx        # Скользящее окно страниц с многоточием
│       └── index.ts
│
├── entities/                         # Бизнес-сущности
│   ├── meter/
│   │   ├── model/
│   │   │   ├── types.ts              # Интерфейсы ответа API
│   │   │   ├── MeterModel.ts         # MST-модель счётчика
│   │   │   └── MetersStore.ts        # Список, fetch/delete, AbortController
│   │   ├── ui/
│   │   │   └── MeterRow.tsx          # Строка таблицы; принимает deleteSlot?: ReactNode — FSD-слот для действий из features
│   │   └── index.ts
│   └── area/
│       ├── model/
│       │   ├── types.ts              # Интерфейсы ответа API
│       │   ├── AreaModel.ts          # MST-модель адреса
│       │   └── AreasStore.ts         # Кеш по ID + volatile pendingIds против дублей
│       └── index.ts
│
└── shared/                           # Переиспользуемые утилиты и примитивы
    ├── api/
    │   └── httpClient.ts             # Обёртка над fetch (get + AbortSignal / del), HttpError, getHttpErrorMessage()
    ├── config/
    │   └── constants.ts              # VITE_API_BASE_URL из env, размер страницы
    ├── lib/
    │   └── formatDate.ts             # ISO → дд.мм.гггг
    ├── model/
    │   └── ConfirmModalStore.ts      # Глобальный MST-стор модального окна подтверждения
    └── ui/
        ├── Icon/
        │   ├── Icon.tsx              # <svg><use href="#icon-..."> — лёгкий враппер спрайта
        │   └── index.ts
        ├── IconSprite/
        │   ├── IconSprite.tsx        # Скрытый <svg> с <symbol> для всех иконок
        │   └── index.ts
        ├── ConfirmModal/
        │   ├── ConfirmModal.tsx      # Portal-модал подтверждения, Esc/Enter
        │   └── index.ts
        ├── ErrorBoundary/
        │   ├── ErrorBoundary.tsx     # React class ErrorBoundary — last-resort catch, показывает fallback + кнопку перезагрузки
        │   └── index.ts
        └── MeterTypeIcon.tsx         # Цветная SVG-иконка + метка типа счётчика
```

---

## Управление состоянием (MST)

```
RootStore
├── MetersStore
│   ├── items[]              массив MeterModel
│   ├── count                всего элементов из API
│   ├── offset               смещение текущей страницы
│   ├── isLoading            показывает скелетон при смене страницы
│   ├── isDeleting           блокирует повторное нажатие кнопки удаления
│   ├── error                null | строка — ошибка загрузки страницы (показывается вместо таблицы)
│   ├── deleteError          null | строка — ошибка удаления (показывается баннером над таблицей)
│   ├── volatile _abortCtrl  AbortController — отменяет предыдущий запрос
│   ├── volatile _deleteErrorTimer  setTimeout handle — auto-dismiss deleteError через 5 с
│   ├── fetchMeters(offset)  → aborts prev, загружает страницу, вызывает silentRefetch
│   ├── silentRefetch()      → GET /meters/ без isLoading (используется после удаления)
│   ├── retryFetch()         → fetchMeters(self.offset) — повтор без смены страницы
│   ├── deleteMeter(id)      → оптимистичное удаление + DELETE + silentRefetch + rollback
│   ├── goToPage(page)       → вычисляет offset, вызывает fetchMeters
│   └── beforeDestroy()      → abort + clearTimeout, предотвращает утечку
├── AreasStore
│   ├── cache                MST map: id → AreaModel (живёт при смене страниц)
│   ├── error                null | строка — ошибка загрузки районов
│   ├── volatile pendingIds  Set<string> — защита от параллельных дублирующих запросов
│   └── fetchAreas(ids[])    → фильтрует кеш + pending, один батчевый GET /areas/
└── ConfirmModalStore
    ├── isOpen / title / message
    ├── volatile onConfirm   функция-коллбэк (не сериализуется в снапшот)
    ├── open({ title, message, onConfirm })
    ├── confirm()            → вызывает onConfirm(), закрывает модал
    └── close()              → закрывает без действия
```

---

## Стратегия кеширования адресов

1. `MetersStore.silentRefetch` собирает все `area.id` с текущей страницы.
2. Вызывает `AreasStore.fetchAreas(ids)`.
3. `AreasStore` отфильтровывает ID из `cache` (O(1)) и `pendingIds` (защита от race condition).
4. Только неизвестные ID отправляются одним запросом `GET /areas/?id__in=id1&id__in=id2`.
5. Результаты сохраняются в персистентный `cache` — при возврате на страницу адреса не запрашиваются повторно.

---

## Обработка ошибок HTTP

`httpClient` бросает `HttpError` (содержит `status: number`) вместо базового `Error`.

Вспомогательная функция `getHttpErrorMessage(e)` переводит статус в читаемое сообщение:

| Статус | Сообщение |
|---|---|
| 400 | Некорректный запрос |
| 401 | Необходима авторизация |
| 403 | Доступ запрещён |
| 404 | Данные не найдены |
| 500 | Ошибка сервера |
| 502 | Сервер недоступен |
| 503 | Сервис временно недоступен |
| `Failed to fetch` | Нет соединения с сервером |
| остальные | Произошла непредвиденная ошибка |

Ошибки хранятся в `error` / `deleteError` MST-полях (не бросаются наружу).
`MetersTable` читает эти поля и рендерит соответствующий UI. `deleteError` auto-dismiss через 5 с.

| Состояние | UI |
|---|---|
| `meters.error` | Вместо таблицы — иконка + текст ошибки + кнопка "Повторить" |
| `meters.deleteError` | Красный баннер над таблицей |
| `areas.error` | Передаётся в MeterRow как `areaError` — ячейка адреса показывает "Ошибка загрузки адреса" |

---

## Flow удаления счётчика

```
Пользователь hover → DeleteButton виден
Клик → MetersTable.handleDeleteRequest → modal.open(...)
ConfirmModal → «Удалить» → meters.deleteMeter(id)
  1. isDeleting = true, deleteError = null
  2. items.splice(index, 1)          — элемент исчезает мгновенно (оптимистично)
  3. DELETE /meters/:id/
  4. silentRefetch()                 — тихое обновление без скелетона
  5. isDeleting = false
  При ошибке: items.splice(index, 0, snapshot) — откат
             deleteError = getHttpErrorMessage(e) — баннер (auto-dismiss 5 с)
```

---

## SVG-иконки (sprite pattern)

Все иконки из Figma встроены как `<symbol>` в единый скрытый `<svg>` (IconSprite), монтируемый один раз в App. Использование: `<svg><use href="#icon-trash" /></svg>`.

| ID символа | Назначение | Цвет |
|---|---|---|
| `icon-counter-hot` | ГВС | #F46B4D |
| `icon-counter-cold` | ХВС | #3698FA |
| `icon-counter-electric` | ЭЛДТ | #FFB82C |
| `icon-counter-heat` | ТПЛ | #E62E05 |
| `icon-trash` | Удалить | `currentColor` |

Иконка `icon-trash` использует `currentColor` — цвет задаётся через CSS `color` кнопки (#C53030 при hover, #CED5DE при disabled).

---

## Маппинг типов счётчиков

| Значение `_type` в API | Отображение | Цвет | Иконка |
|---|---|---|---|
| `HotWaterAreaMeter` | ГВС | #F46B4D | icon-counter-hot |
| `ColdWaterAreaMeter` | ХВС | #3698FA | icon-counter-cold |

Поле `_type` — массив; используется первый элемент, не равный `AreaMeter`.

---

## Пагинация

Алгоритм `buildPages(current, total)` всегда показывает первые 3 и последние 3 страницы, плюс текущую ± 1. Между несмежными группами вставляется `...`.

```
Page 1:  [1]  2  3  ...  66  67  68
Page 3:   1   2 [3]  4  ...  66  67  68   ← страница 4 появляется
Page 5:   1   2  3   4  [5]  6  ...  66  67  68
Page 35:  1   2  3  ...  34 [35] 36  ...  66  67  68
Page 66:  1   2  3  ...  65 [66] 67  68
```

---

## Prettier

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "printWidth": 80
}
```
