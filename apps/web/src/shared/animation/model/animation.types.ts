/** вариант выбора анимации */
export type AnimationChoice<TName extends string> = TName | 'random';

/** коллекция гарантирует наличие минимум пяти вариантов */
export type AnimationCollection<TValue> = readonly [TValue, TValue, TValue, TValue, TValue, ...TValue[]];
