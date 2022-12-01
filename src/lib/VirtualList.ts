import { cloneDeep, uniqueId } from 'lodash';
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
  backHidden: { id: string | Symbol, data: { id: string | Symbol }, rowdom: HTMLDivElement, height?: number }[];
  preHidden: { id: string | Symbol, data: { id: string | Symbol }, rowdom: HTMLDivElement, height?: number }[];
  startIndex: number = -1;
  preHiddenHeight: number = 0;
  backHiddenHeight: number = 0;
  preHiddenDom: HTMLDivElement;
  backHiddenDom: HTMLDivElement;




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
    if (dataMap) this.dataMap = dataMap
    this.getRowUniqKey = getRowUniqKey;
    this.rowHeight = rowHeight;
    let backHiddenStartHeight = 0;
    let top = 0
    // const observer = new IntersectionObserver(this.deleteSelf, { threshold: 0 });
    const preHidden = [];
    const backHidden = []
    const rowList = []
    this.dataList.forEach((data) => {
      const id = this.getRowUniqKey?.({ data }) || data.id
      const rowdom = document.createElement('div')
      const curRowheight = data.height || rowHeight;
      rowdom.setAttribute("id", id);
      rowdom.style.height = curRowheight + 'px'
      rowdom.style.width = '100%'
      rowdom.style.backgroundColor = 'pink'

      const rowTop = top;
      rowdom.innerHTML = 'Row' + id + '     rowTop:' + rowTop
      const row = { id, data, rowdom, height: curRowheight, top: rowTop }
      if (top <= height) rowList.push(row)
      if (top > height) {
        backHidden.push(row)
        if (!backHiddenStartHeight) backHiddenStartHeight = top
      }
      top += curRowheight;
    })
    console.log(top, 'top');
    this.rowList = rowList
    this.backHidden = backHidden
    this.preHidden = preHidden
    this.preHiddenHeight = 0
    this.backHiddenHeight = top - backHiddenStartHeight;
    this.mount()
  }

  get observer() {
    return new IntersectionObserver(this.addChild, { threshold: 0, root: this.domRef });
  }

  mount() {

    this.preHiddenDom = document.createElement('div')
    this.backHiddenDom = document.createElement('div')
    this.preHiddenDom.style.height = this.preHiddenHeight + 'px'
    this.backHiddenDom.style.height = this.backHiddenHeight + 'px'
    const rowDomList = []
    const visibleContext = this.rowList.map(({ rowdom }) => {
      rowDomList.push(rowdom)
      return rowdom
    })
    const allContext = [this.preHiddenDom, ...visibleContext, this.backHiddenDom]
    this.domRef.append(...allContext)
    rowDomList.forEach((rowdom) => this.observer.observe(rowdom))
  }

  deleteSelf(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    console.log(entries);
    entries.forEach(entry => {
      this.domRef.removeChild(entry.target)
    })

  }

  addChild = (entries: (IntersectionObserverEntry & { isVisible: boolean, target: HTMLElement })[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.backgroundColor = 'red'
      } else if (!entry.isVisible) {
        // todo 
        // 1.判断是加入前隐藏还是后隐藏
        if (entry.boundingClientRect.bottom < entry.rootBounds.top) {
          const toHiddenRow = this.rowList.shift()
          this.preHidden.unshift(toHiddenRow)
          const toShowRow = this.backHidden.shift()
          this.rowList.push(toShowRow)
          this.preHiddenHeight += toHiddenRow.height
          this.preHiddenDom.style.height = this.preHiddenHeight + 'px';
          this.backHiddenHeight -= toHiddenRow.height
          this.backHiddenDom.style.height = this.backHiddenHeight + 'px';
          this.observer.unobserve(entry.target)
          this.domRef.removeChild(entry.target)
          this.domRef.insertBefore(toShowRow.rowdom, this.backHiddenDom)
          this.observer.observe(toShowRow.rowdom)
        }
        console.log(this.preHidden.length, this.backHidden.length);

        entry.target.style.backgroundColor = 'pink'

      }
    })
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