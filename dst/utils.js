"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractResolutionsFromManifest = void 0;
function extractResolutionsFromManifest(manifestContent) {
    const regex = /RESOLUTION=(\d+x\d+)/g;
    const matches = manifestContent.match(regex);
    if (matches) {
        return matches.map((match) => match.split('=')[1]);
    }
    return [];
}
exports.extractResolutionsFromManifest = extractResolutionsFromManifest;
