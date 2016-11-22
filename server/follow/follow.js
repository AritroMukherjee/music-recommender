'use strict';

class Follow {
	constructor(from, to) {
		this.from = from;
		this.to = to;
		// datetime
	}
	equals(other) {
		return this.from === other.from && this.to === other.to;
	}
}

module.exports = Follow;
