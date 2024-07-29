# google-timeline-json-to-kml-converter

## Summary

This is a simple converter that parses your `location-history.json` file into KML.

Idea to create such a thing found me when I tried to export data for
Fog Of World application, so that I could track where I've been to.
I searched the web and there were only some tutorials to get KML
files from Google Timeline directly. 
But in early 2024 Google decided to move Timeline into your device to make it more secure.

As the update began rolling out to all Google accounts, 
the access to Timeline from web browser was deprecated,
disabling the ability to download KML timeline for all time or even one day. 
This lead to making obsolete a lot of different applications,
that normally used that data.

After a while of searching web without finding answer I decided to make my own parser :)

## How to use

1. You have to get `location-history.json` file from Timeline.
You can do so by opening Google Maps from your phone 
or other device that stores timeline data and finding it in the Timeline options.
*Note: your file can be found in your phone, **NOT from Google Takeout***
2. Clone repo (obvious)
3. Run `npm install`
4. Put your `location-history.json` in the root of the project
5. Run `generate`
6. If everything is done properly you should get your files in `./kml` folder
7. ????????????
8. Enjoy!

## Working principle

Firstly it creates folders `json` and `kml` in root directory.

Secondly, it separates data from `location-history.json` into JSON chunks by year and month.

For example, your timeline looks like this:

In June 2024 (`2024-06-25`) you went to a Nice (France), then suddenly got to San Marino 
and from there went to travel to Stuttgart (Germany) 

In July 2025 (`2025-07-25`) you have visited Kaunas (Lithuania)

 ```json
{
  "semanticSegments": [
    {
      "startTime": "2024-06-25T19:00:00.000+03:00",
      "endTime": "2024-06-25T21:00:00.000+03:00",
      "timelinePath": [
        {
          "point": "43.7101590°, 7.26116323°",
          "time": "2024-06-25T20:24:00.000+03:00"
        },
        {
          "point": "43.9407384°, 12.4574775°",
          "time": "2024-06-25T20:46:00.000+03:00"
        },
        {
          "point": "48.775989°, 9.1828452°",
          "time": "2024-06-25T20:48:00.000+03:00"
        }
      ]
    },
    {
      "startTime": "2025-07-25T20:23:35.000+03:00",
      "endTime": "2025-07-25T22:39:54.000+03:00",
      "startTimeTimezoneUtcOffsetMinutes": 180,
      "endTimeTimezoneUtcOffsetMinutes": 180,
      "visit": {
        "hierarchyLevel": 0,
        "probability": 0.69,
        "topCandidate": {
          "placeId": "",
          "semanticType": "INFERRED_WORK",
          "probability": 0.999,
          "placeLocation": {
            "latLng": "54.8973255°, 23.9139920°"
          }
        }
      }
    }
  ]
}
```

Created `json` folder structure will look like this:
```
project 
│
└───json
│   └───2024
│   │    │   2024-06.json
│   │
│   └───2025
│        │   2025-07.json
```
Files are grouped by month, which means all monthly data will be contained in one file.

If there is no entry for month (eg `2024-01`), then the file creation is skipped. 

After all JSON files are created, they are rewritten into KML.

