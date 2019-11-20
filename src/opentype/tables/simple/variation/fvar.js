import { SimpleTable } from "../simple-table.js";
import lazy from "../../../lazy.js";

/**
 * The OpenType `fvar` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/fvar
 */
class fvar extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`fvar`, dict, dataview);

        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.axesArrayOffset = p.uint16;
        p.uint16;
        this.axisCount = p.uint16;
        this.axisSize = p.uint16;
        this.instanceCount = p.uint16;
        this.instanceSize = p.uint16;

        const getter = () => [... new Array(this.axisCount)].map(_ =>  new VariationAxisRecord(p));
        lazy(this, `axes`, getter);
    }

    getSupportedAxes() {
        return (this.axes).map(a => a.tag);
    }

    getAxis(name) {
        return (this.axes).find(a => a.tag === name);
    }
}

/**
 * The fvar variation axis record class
 */
class VariationAxisRecord {
    constructor(p) {
        this.tag = p.tag;
        this.minValue = p.fixed;
        this.defaultValue = p.fixed;
        this.maxValue = p.fixed;
        this.flags = p.flags(16);
        this.axisNameID = p.uint16;
    }
}

export { fvar };