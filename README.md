# Flash(Forge|Air)

This is a replacement for the built-in website user-interface on Toshiba FlashAir wireless SSD cards.

It is designed for use with Flashforge Creator Pro 3d printers.

The UI shows better file listing from the card including time, filesize etc, and there is an interface to upload files to the card from the main screen.

## How it works

The Toshiba FlashAir cards allow you to save files to a folder called 'SD_WLAN'. If certain files exist there, they override the built in behavior of the cards internal webserver.  Primarily 'SD_WLAN/List.htm'.

## Install

Mount the flashair and create SD_WLAN. Edit your CONFIG file and make sure 'UPLOAD=1' is there.

Then copy this repository to it inside the SD_WLAN directory. Navigate to the device in your browser!

## To Do

  * Add drag and drop uploading support similar to imgur
  * Fix upload button to upload in the background using ajax instead of submitting a form
  * Add support for configuring a webcam URL for a live-stream of your printer
  * Add support for deleting files
  * Figure out why some filenames dont show in the FFCP GUI and do something about it (warn or fix)
  * Add config checking to provide good feedback if uploading is disabled in CONFIG etc

