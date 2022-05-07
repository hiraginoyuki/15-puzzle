"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnedEventEmitter = void 0;
const events_1 = require("events");
class OwnedEventEmitter extends events_1.EventEmitter {
    constructor(owner, options) {
        super(options);
        this.owner = owner;
    }
}
exports.OwnedEventEmitter = OwnedEventEmitter;
//# sourceMappingURL=events.js.map