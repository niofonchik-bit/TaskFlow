/** способ выбора анимации */
export type AnimationChoice<TName extends string> = TName | 'random';

/** непустая коллекция вариантов анимации */
export type AnimationCollection<TValue> = readonly [TValue, ...TValue[]];
