/**
 *  main.js
 *
 *  Created by Junichi Kitano on 2013/05/15.
 * 
 *  Copyright (c) 2013, Fixstars Corporation
 *  All rights reserved.
 *  Released under the BSD 2-Clause license.
 *   http://flashair-developers.com/documents/license.html
 */
// Judge the card is V1 or V2.
function isV1(wlansd) {
	if ( wlansd.length == undefined || wlansd.length == 0 ) {
		// List is empty so the card version is not detectable. Assumes as V2.
		return false;
	} else if ( wlansd[0].length != undefined ) {
		// Each row in the list is array. V1.
		return true;
	} else {
		// Otherwise V2.
		return false;
	}
}
// Convert data format from V1 to V2.
function convertFileList(wlansd) {
	for (var i = 0; i < wlansd.length; i++) {
		var elements = wlansd[i].split(",");
		wlansd[i] = new Array();
		wlansd[i]["r_uri"] = elements[0];
		wlansd[i]["fname"] = elements[1];
		wlansd[i]["fsize"] = Number(elements[2]);
		wlansd[i]["attr"]  = Number(elements[3]);
		wlansd[i]["fdate"] = Number(elements[4]);
		wlansd[i]["ftime"] = Number(elements[5]);
	}
}
// Callback Function for sort()
function cmptime(a, b) {
    if( a["attr"] & 0x10 == b["attr"] & 0x10) {
            if( a["fdate"] == b["fdate"] ) {
                return a["ftime"] - b["ftime"];
            }
            else 
            {
                return a["fdate"] - b["fdate"];
            }
    }
    else {
        return (b["attr"] & 0x10) - (a["attr"] & 0x10) ;
    }
}

// Callback Function for sort()
function cmpname(a, b) {
    var aName = a['fname'].toLowerCase();
    var bName = b['fname'].toLowerCase();

    console.log("Comparing " + aName + " and " + bName);
    if( (a["attr"] & 0x10) == (b["attr"] & 0x10) ) {
        console.log("...both are directories or not");
        return aName.localeCompare(bName);
    }
    else {
        console.log("...choosing the directory");
        return (b["attr"] & 0x10) - (a["attr"] & 0x10) ;
    }
}
// Show file list
function showFileList(path) {
	// Clear box.
	$("#list").html('');

    // Print table headers
    $("#list").append(
        $('<tr><th></th><th>Name</th><th style="text-align: right;">Size</th><th>Date</th></tr>')
    );
    // Output a link to the parent directory if it is not the root directory.
    if ( path != "/" ) {
		// Make parent path
		var parentpath = path;
		if ( parentpath[parentpath.length - 1] != '/' ) {
			parentpath += '/';
		}
		parentpath += '..';
		// Make a link to the parent path.
        $("#list").append(
            $('<tr></tr>')
                .append($('<td colspan="99"></td>'))
                .append($('<a href="' + parentpath + '" class="list"></a>')
                    .append($('<img class="img-rounded" src="/SD_WLAN/img/folder.png">'))
                    .append($('<div class="img-caption">..</div>')))
        );
    }
    $.each(wlansd, function() {
        var file = this;

        // TODO: Impliment a delete file feature:
        // https://flashair-developers.com/en/documents/api/uploadcgi/

        // Skip hidden file
        if ( file["attr"] & 0x02 ) {
            return;
        }

		// Make a link to directories and files.
        var filelink = $('<a class=""></a>').attr('href', file["r_uri"] + '/' + file["fname"]);
		var caption = $('<span class="img-caption" style=""></span>').html(file["fname"]);
        var img = $('<img class="img-rounded">');
        if ( file["attr"] & 0x10 ) {
            img.attr("src", "/SD_WLAN/img/folder.png");
        } else {
			var array = file["fname"].split(".");
			var ext = array.length >= 2 ? array[array.length - 1] : '';
			if ( ext.toUpperCase() == "JPG" ) {
				img.attr("src", "/thumbnail.cgi?" + file["r_uri"] + '/' + file["fname"]);
			} 
            else if ( ext.toUpperCase() == "X3G" ) {
				img.attr("src", "/SD_WLAN/img/flashprint.png");
			} 
            else {
				img.attr("src", "/SD_WLAN/img/other.png");
			}
			filelink.addClass("file").attr("target","_blank");
		}

        // Year: bit 15-9 value 0 = 1980
        var fyear = 1980 + (127 & file['fdate'] >> 9);
        // Month: bit 8-5 value from 1 to 12
        var fmonth = 15 & file['fdate'] >> 5;
        // Day: bit 4-0 value 1 to 31
        var fday = 31 & file['fdate'];

        // Hour: bit 15-11 
        var fhour = 31 & file['ftime'] >> 11;
        // Minute: bit 10-5
        var fminute = 31 & file['ftime'] >> 5;
        // Second: bit 4-0
        var fsecond = 15 & file['ftime'];

        var fdatetime = new Date(fmonth + '/' + fday + '/' + fyear + ' ' + fhour + ':' + fminute + ':' + fsecond + " UTC");


        // Create a new row
        var row = $('<tr class=""></tr>').append(
                (
                    $('<td></td>').append(
                        filelink.clone().append(
                            img
                        )
                    )
                ), 
                (
                    $('<td></td>').append(
                        filelink.append(
                            caption
                        )
                    )
                ),
                (   
                    $('<td class="text-right"></td>').append(
                        $('<p class="text-right"></p>').append(
                            file['fsize']
                        )
                    )
                    
                ),
                (   
                    $('<td></td>').append(
                        $('<p class="small text-left"></p>').append(
                            /*'('+file["fdate"]+')'+ ' '+ fyear + '-' + fmonth + '-' + fday 
                            + ' ' + fhour + ':' + fminute + ':' + fsecond + ' UTC'
                            */
                            $.format.date(fdatetime, 'yyyy/MM/dd H:mma')
                        )
                    )
                )
			)
		// Append a file entry or directory to the end of the list.
        $("#list").append(
            $('<tbody></tbody>').append(
                row
            )
        );
    });     
}
//Document Ready
$(function() {
	if ( isV1(wlansd) ) {
		convertFileList(wlansd);
	}
    //wlansd.sort(cmptime);
    wlansd.sort(cmpname);
    showFileList(location.pathname);
});
