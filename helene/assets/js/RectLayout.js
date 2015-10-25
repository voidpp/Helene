
export default class RectLayout {
    constructor(top = null, left = null, width = null, height = null) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }

    get right() {
        return this.left + this.width;
    }

    get bottom() {
        return this.top + this.height;
    }

    get style() {
        return {
            top: this.top + 'px',
            left: this.left + 'px',
            width: this.width + 'px',
            height: this.height + 'px',
        }
    }
}
