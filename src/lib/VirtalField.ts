import type VirtalCell from './VirtaulCell'
interface VirtualField {
    groupLabel?: string | Node;
    groupKey?: string | Symbol;
    title: string | Node;
    titleCell?: string | Node;
    value: string | Symbol;
    fieldKey: string | Symbol;
    resizeWidth?: Function;
    style?: HTMLStyleElement;
    component: VirtalCell

}

export default VirtualField