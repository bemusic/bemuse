declare module 'data-structure' {
  module DataStructure {
    export interface Façade<T> {
      (value: T, ...bogus: any[]): T
    }
  }
  const DataStructure: {
    <T>(spec: any): DataStructure.Façade<T>
    maybe<T>(spec: any): any
  }
  export = DataStructure
}

declare module 'bemuse-chardet/bemuse-chardet' {
  const BemuseChardet: {
    detect(buffer: Buffer): string
  }
  export = BemuseChardet
}
