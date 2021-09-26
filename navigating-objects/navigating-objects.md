# Navigating Objects

## Who is this for?

This blog is meant for those brand new to coding and looking for ways to better grasp how to navigate complex object structure.

## The Sample Data

For the purpose of the examples here, we'll be looking at some real world (and beyond) data from NASA. They provide a number of free APIs that anyone can access to fetch data, so this will be a good example of what a complex object could look like. Due to the size of the sample data, I have just included a simplified schema of what the results look like. You can [click here](./sample-data.json) for a full sample of what the object could look like. The examples below will assume that a variable `fetchResults` has already been declared and set to these results.

A couple notes:
- There could be any number of key/value pairs under `near_earth_objects`, depending on how many days of data is requested through the API.
- The array for each date could also contain any number of items.

https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY

```json
{
	"links": {},
	"element_count": 0,
	"near_earth_objects": {
		"yyyy-mm-dd": [
			{
				"links": {},
				"id": "",
				"neo_reference_id": "",
				"name": "",
				"nasa_jpl_url": "",
				"absolute_magnitude_h": 0,
				"estimated_diameter": {},
				"is_potentially_hazardous_asteroid": true,
				"close_approach_data": [],
				"is_sentry_object": true
			}
		]
	}
}
```

## Accessing the Data

Let's say we wanted to read the `is_potentially_hazardous_asteroid` property of the first element returned for the date `"2015-09-07"`. How do we go about doing it?

```jsx
 
//           ┌ access the 'near_earth_objects' object
//           │                 ┌ access the desired date
//           │                 │             ┌ acccess the first object in the array
//           │                 │             │   ┌ access the desired property
fetchResults.near_earth_objects['2015-09-07'][0].is_potentially_hazardous_asteroid;
// => false
```

Let's break this down:
1. `fetchResults` is the object returned from the API request as described above
1. `.near_earth_objects` accesses the object that contains all the dates
1. `['2015-09-07']` accesses the array of objects for the desired date. Note that bracket notation is required here for two reasons:
	- The key starts with a number
	- The key contains a hyphen
1. `[0]` accesses the first object of the array. Bracket notation is required here since
1. `.is_potentially_hazardous_asteroid` finally gets us to the property we wanted to retrieve.

The property we're trying to get to is four levels deep in the `fetchResults` object, so we have to use four [property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) in order to get to it. Accessing this property can also be done purely with bracket notation as shown below, however I prefer using dot notation where possible for its readability.

```jsx
fetchResults['near_earth_objects']['2015-09-07'][0]['is_potentially_hazardous_asteroid'];
```

## Visualizing

When you're first learning about objects, accessing these nested properties can seem abstract and might be hard to grasp. Another way to visualize this may be to imagine this as a folder tree on your computer. When you want to access a file, you sometimes have to navigate through multiple levels of directories first. For each 

```bash
.
├── element_count
├── links
│   ├── next
│   ├── prev
│   └── self
└── near_earth_objects
    ├── 2015-09-07
    │   └── 0
    │       ├── absolute_magnitude_h
    │       ├── close_approach_data
    │       │   ├── close_approach_date
    │       │   ├── close_approach_date_full
    │       │   ├── epoch_date_close_approach
    │       │   ├── miss_distance
    │       │   │   ├── astronomical
    │       │   │   ├── kilometers
    │       │   │   ├── lunar
    │       │   │   └── miles
    │       │   ├── orbiting_body
    │       │   └── relative_velocity
    │       │       ├── kilometers_per_hour
    │       │       ├── kilometers_per_second
    │       │       └── miles_per_hour
    │       ├── estimated_diameter
    │       │   ├── feet
    │       │   │   ├── estimated_diameter_max
    │       │   │   └── estimated_diameter_min
    │       │   ├── kilometers
    │       │   │   ├── estimated_diameter_max
    │       │   │   └── estimated_diameter_min
    │       │   ├── meters
    │       │   │   ├── estimated_diameter_max
    │       │   │   └── estimated_diameter_min
    │       │   └── miles
    │       │       ├── estimated_diameter_max
    │       │       └── estimated_diameter_min
    │       ├── id
    │       ├── is_potentially_hazardous_asteroid
    │       ├── is_sentry_object
    │       ├── links
    │       │   └── self
    │       ├── name
    │       ├── nasa_jpl_url
    │       └── neo_reference_id
    └── 2015-09-08
```