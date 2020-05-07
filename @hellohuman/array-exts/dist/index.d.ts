interface ArrayFlattenConfig {
    excludeKey?: boolean;
    includedFields?: string[];
    fieldAsValue?: string;
    keyIfNotExists?: string;
    keyValToLower?: boolean;
}

interface Array<T> {
    /**
     * Flattens a property in an array
     *   e.g.
     *   [{ a: 'a', b: ['b'] }, { a: 'a', b: ['c'] }]
     *   becomes ['b', 'c']
     *   using flatMap((x) => x.b)
     * @param callback
     */
    flatMap<E>(callback: (t: T) => E[]): E[];

    /**
     * Computes the properties in the arrays that are equivalent
     *   e.g.
     *   ['a', 'b'] and ['b', 'c'] will produce ['b']
     * @param other
     */
    intersection(other: T[]): T[];

    /**
     * Computes the duplicate elements in the array
     *   e.g.
     *   ['a', 'a', 'b'] will produce ['a']
     */
    duplication(): T[];

    /**
     * Flattens an array to an object
     * e.g.
     *  [{ key: 'val', a: b }, { key: 'val2', a: b }]
     *  becomes
     *  {
     *      val: { key: val, a: b },
     *      val2: { key: val2, a: b }
     *  }
     * @param key
     * @param options
     */
    flattenToObject(key: string, options?: ArrayFlattenConfig): any;

    /**
     * Computes the unique objects inside the array
     *   e.g.
     *   ['a', 'b', 'c', 'c'] becomes ['a', 'b', 'c']
     */
    uniqueMap(): T[];

    /**
     * Computes the difference between this array and the other array.
     *
     * NOTE: This may not produce what you expect if you want the complete difference i.e. all values in this array mayu exist in other and as such it will not return any values as there are no differences. Use Array#allDifference for that.
     * @param other
     */
    difference(other: T[]): T[];

    /**
     * Computes all differences between this array and the other. This accounts for differences between the other and this array also.
     * @param other
     */
    allDifference(other: T[]): T[];

    /**
     * Removes all null or undefined objects in the array
     */
    notNullOrUndefined(): Array<NonNullable<T>>;

    /**
     * Safely get the first element of the array
     */
    first(): T | undefined;

    /**
     * Apply a filter operation only if the condition is satisfied
     * @param condition
     * @param fn
     */
    filterIf(condition: boolean, fn: (arg?: any) => boolean): T[];

    /**
     * Groups items in array
     * @param fn
     */
    groupBy<K>(keyGetter: (item: T) => K): Map<K, T[]>;
}

interface Set<T> {
    /**
     * Computes the diffence between this set and the other
     *
     * Note: This does not compute the difference between the other set and this. Use Set#allDifference for that
     * @param other
     */
    difference(other: Set<T>): Set<T>;

    /**
     * Computes the diffence between this set and the other inclusive of all values
     *
     * @param other
     */
    allDifference(other: Set<T>): Set<T>;

    /**
     * Computes the similarities between this set and the other
     * @param other
     */
    intersection(other: Set<T>): Set<T>;
}
