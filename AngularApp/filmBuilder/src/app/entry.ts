export class Entry {

    constructor(
        public file: string,
        public type: string,
        public category: string,
        public name: string,
        public language?: string,
    ) { }
}
