export class Entry {

    constructor(
        public type: string,
        public category: string,
        public name: string,
        public fileUrl: string,
        public language?: string,
    ) { }
}
