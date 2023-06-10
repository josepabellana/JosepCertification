"use strict";
function extractResolutionsFromManifest(manifestContent) {
    var regex = /RESOLUTION=(\d+x\d+)/g;
    var matches = manifestContent.match(regex);
    if (matches) {
        return matches.map(function (match) { return match.split('=')[1]; });
    }
    return [];
}
function parsePlaylistContent(playlistContent) {
    var lines = playlistContent.split('\n');
    var targetDuration = 0;
    var fragmentCount = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.startsWith('#EXT-X-TARGETDURATION:')) {
            var durationStr = line.split(':')[1];
            targetDuration = parseInt(durationStr, 10);
        }
        else if (line.startsWith('#EXTINF:')) {
            fragmentCount++;
        }
    }
    return { targetDuration: targetDuration, fragmentCount: fragmentCount };
}
