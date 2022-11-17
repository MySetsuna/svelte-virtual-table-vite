import VirtalCell from './VirtaulCell'
class VirtaulRow {
    domRef: HTMLElement;
    cellList: VirtalCell[]
    constructor(domRef: HTMLElement, cellList: VirtalCell[]) {
        this.domRef = domRef
        this.cellList = cellList
    }
}

export default VirtaulRow