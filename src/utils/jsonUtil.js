export const _find = (collection, key, value) => {
    for (const o of collection) {
        for (const [k, v] of Object.entries(o)) {
            if (k === key && v === value) {
                return o;
            }
            if (Array.isArray(v)) {
                const _o = _find(v, key, value);
                if (_o) {
                    return _o;
                }
            }
        }
    }
};

export const _cloneDeep = array=>{
    return JSON.parse(JSON.stringify(array))
}

export const _swap = (array, x, y) =>{
    var b = array[y];
    array[y] = array[x];
    array[x] = b; 
    return array;
} 