# google-timeline-json-to-kml-converter

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

[KML tutorial](https://developers.google.com/kml/documentation/kml_tut)

## How to use

1. You have to get `location-history.json` file from Timeline.
You can do so by opening Google Maps from your phone 
or other device that stores timeline data and finding it in the Timeline options.
*Note: your file can be found in your phone, **NOT from Google Takeout***
2. Clone repo (obvious)
3. Run `npm install`
4. Put your `location-history.json` in the root of the project
5. Run `generate`
6. Wait for a bit
7. If everything is done properly you should get your files in `./kml` folder
8. ????????????
9. Enjoy!

## Working principle

### Setup

Folders `json` and `kml` are created in root directory.

### JSON separation

Data from `location-history.json` are separated into JSON chunks by year and month.

For example, your timeline may be described as:

> In June 2024 (`2024-06-25`) you went to a Nice (France), then suddenly got to San Marino 
and from there went to travel to Stuttgart (Germany)
> 
> In July 2025 (`2025-07-25`) you have visited Kaunas (Lithuania)

In JSON it looks like this:

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

### KML generation 

#### TimelinePath

After all JSON files are created, they are rewritten into KML.
Each JSON file corresponds to 1 or 2 KML files.

From the above `json` folder structure the next `kml` structure is created:

```
project 
│
└───kml
│   └───2024
│   │    │   Timeline-Path-2024-06.kml
│   │
│   └───2025
│        │   Visits-2025-07.kml
```
If presented location history included visit segments in 2024-06
and timeline path segments in 2025-07, structure would look like this:

```
project 
│
└───kml
│   └───2024
│   │    │   Timeline-Path-2024-06.kml
│   │    │   Visits-2024-06.kml
│   │
│   └───2025
│        │   Timeline-Path-2025-07.kml
│        │   Visits-2025-07.kml
```

`Timeline-Path-2024-06.kml` corresponds to the first semantic segment of location history.
For each `TimelinePath` segment that was found in current file of current folder,
a `Placemark` is created.

A [Placemark](https://developers.google.com/kml/documentation/kmlreference#placemark)
is an element that contains part of your map,
for example a 
[single location marker](https://developers.google.com/kml/documentation/kmlreference#point)
(`<Point>`) or a 
[path](https://developers.google.com/kml/documentation/kmlreference#linestring)
(`<LineString>`)


```xml
<Placemark id="B1HAEA235JKF">
    <name>2025-07</name>
    <LookAt>
        <longitude>7.26116323</longitude>
        <latitude>43.7101590</latitude>
        <heading>0</heading>
        <tilt>0</tilt>
        <gx:fovy>35</gx:fovy>
        <altitudeMode>absolute</altitudeMode>
    </LookAt>
    <styleUrl>#__managed_style_0B628CDDC0322E7B1F84</styleUrl>
    <LineString>
        <coordinates>
            7.26116323,43.7101590,0 
            12.4574775,43.9407384,0
            9.1828452,48.775989,0
        </coordinates>
    </LineString>
</Placemark>
```
Line contains `<coordinates>` element which is filled with coordinate tuples.
Also `Placemark` has 
[`<LookAt>` element](https://developers.google.com/kml/documentation/kmlreference#lookat)
that has its own coordinates. 
They are set from the first tuple of coordinates array. 

> Pay attention, that in `location-history.json`
> coordinates look this way `"43.7101590°, 7.26116323°"`, where the first value is
> latitude and the second is longitude.
> 
> But in `<coordinates>` element the coordinates values are reversed

#### TimelineVisits

Visit files are generated simultaneously with path files,
with respect to synchronous IO operations.

`<Placemark>` for visit segment looks like this 

```xml
<Placemark id="02299570C5322EA2FE7F">
    <name>Untitled placemark</name>
    <LookAt>
        <longitude>54.8973255</longitude>°, 
        <latitude>23.9139920</latitude>
        <altitude>69.42000000000000</altitude>
        <heading>0</heading>
        <tilt>0</tilt>
        <gx:fovy>35</gx:fovy>
        <range>250.0000000000000</range>
        <altitudeMode>absolute</altitudeMode>
    </LookAt>
    <styleUrl>#__managed_style_0B628CDDC0322E7B1F84</styleUrl>
    <Point>
        <coordinates>54.8973255,23.9139920,69.42000000000000</coordinates>
    </Point>
</Placemark>
```

As altitude is not exported with timeline data it was decided to make it
69.42000000000000 as it is a funny number. Remember, if you use this numbers,
then you are instantly funny.

## Afterword

When all your files are ready, you can import them to whatever app you like
and manually edit them there.

I guess this is it! 

Thank you for staying here