import { uniqueId } from 'lodash';
import type VirtualField from './VirtalField'

class VirtualList {
  /** the list instance dom */
  domRef: HTMLElement;
  dataList: { id: string | Symbol, height?: number }[];
  dataMap: Map<string, Object>;
  fieldList: VirtualField[];
  getRowUniqKey: Function;
  rowHeight: number;
  scrollTop: number = 0;
  scrollLeft: number = 0;
  rowList: { id: string | Symbol, data: { id: string | Symbol }, rowdom: HTMLDivElement, height?: number }[];


  constructor(options: { rowHeight?: number, height?: number, domRef?: HTMLElement, dataList?: { id: string }[], dataMap?: Map<string, Object>, fieldList?: VirtualField[], getRowUniqKey?: Function, tableClass?: string, tableId?: string }) {
    const { domRef, dataList, fieldList, dataMap, getRowUniqKey, tableClass, tableId, height, rowHeight } = options
    if (!domRef) this.domRef = document.createElement('div')
    if (domRef) this.domRef = domRef;
    if (height) this.domRef.style.height = height + 'px'
    if (tableClass) this.domRef.className += ' ' + tableClass
    this.domRef.setAttribute("id", tableId || 'VirtualTableId__' + uniqueId());
    this.domRef.style.overflow = 'auto'
    this.dataList = dataList;
    this.fieldList = fieldList
    this.dataMap = dataMap
    this.getRowUniqKey = getRowUniqKey;
    this.rowHeight = rowHeight;
    let top = 0
    const rowList = this.dataList.map((data) => {
      const id = this.getRowUniqKey?.({ data }) || data.id
      const rowdom = document.createElement('div')
      const height = data.height || rowHeight;
      rowdom.setAttribute("id", id);
      rowdom.style.height = height + 'px'
      rowdom.style.width = '100%'
      rowdom.style.backgroundColor = 'pink'

      const rowTop = top;
      top += height;
      rowdom.innerHTML = 'Row' + id + '     rowTop:' + rowTop
      return { id, data, rowdom, height, top: rowTop }
    })
    this.rowList = rowList
    this.mount()
  }

  mount() {
    console.log('99999');
    this.domRef.append(...this.rowList.map(({ rowdom }) => rowdom))
  }

  update() {

  }

  scroll(scrollTop: number) {
    this.scrollTop = scrollTop

  }

  get rows() {
    // this.rowList.forEach(({ top }) => {

    // })
    return this.dataList;
  }
  set rows(options) { }

}

export default VirtualList