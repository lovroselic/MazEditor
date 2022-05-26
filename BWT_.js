/*jshint browser: true */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W061 */
"use strict";

/*
Burrows-Wheeler, text compression
*/

var BWT = {
    VERSION: "0.01",
    CSS: "color: #47A",
    bwt(text) {
        text = "ananas_is_ananas_or_else"; //debug
        text += "$";
        console.log("BWT text", text);
        let bwtArray = [];
        for (let i = 0; i < text.length; i++) {
            let cycle = text.substring(i) + text.substring(0, i);
            bwtArray.push(cycle);
        }
        bwtArray.sort();
        let bwt = "";
        for (let e of bwtArray) {
            bwt += e.substring(e.length - 1);
        }
        return bwt;
    },
    inverseBwt(bwt) {
        let string = "";
        let bwtSorted = {};
        let nodeList = {};
        let L_Shift = [];

        for (let i = 0; i < bwt.length; i++) {
            let c = bwt[i];
            if (!Object.hasOwn(nodeList, c)) {
                nodeList[c] = [];
                bwtSorted[c] = 0;
            }
            nodeList[c].push(i);
            bwtSorted[c] += 1;
        }
        let index = Object.keys(bwtSorted).sort();
        for (let c of index) {
            L_Shift = L_Shift.concat(nodeList[c]);
        }
        let x = L_Shift[0];
        for (let i = 0; i < bwt.length; i++) {
            x = L_Shift[x];
            string += bwt[x];
        }
        return string.substring(0, string.length - 1);
    }
};

//END
console.log(`%cBWT ${BWT.VERSION} loaded.`, BWT.CSS);