

I was looking for a calendar to use in a React project and found the [React-Calendar](https://www.npmjs.com/package/react-calendar) component. It had all the functionality that I was looking for, but I wanted to customize its styling to fit my project. Here's what I came up with!

The examples here are based on the following components:
- react (v17.0.2)
- react-calendar (v3.5.0)
- styled-components (v5.3.3)

## Initial Styles

I will be using the [styled-components](https://styled-components.com/) package to add styles to my project, but this could all be done in a CSS file if that's your preferred method. Here's my starter code:

```jsx
import Calendar from 'react-calendar';
import styled from 'styled-components';

function App() {
  return (
    <CalendarContainer>
      <Calendar calendarType='US' />
    </CalendarContainer>
  );
}

export default App;

const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  max-width: 600px;
  margin: auto;
  margin-top: 20px;
  background-color: #d4f7d4;
  padding: 10px;
  border-radius: 3px;
`;
```

I have some styles started for the `<div>` that holds the calendar just so the calendar is not floating in the void.

> Note: I also applied the `calendarType` property to the calendar that sets the first day of the week to Sunday. This is how I'm used to seeing calendars, but by leaving this property off the week should start with Monday.

Here's what it looks like before any styling has been applied to the `<Calendar />` component:

![](https://i.imgur.com/2R7f05L.png)

## Default Stylesheet

The react-calendar component also has the option to import a default stylesheet. It can be imported by adding this line to the top of your file:

```jsx
import 'react-calendar/dist/Calendar.css';
```

Here's what the calendar looks like with these styles:

![](https://i.imgur.com/1phKNfG.png)

Looks much better! However I want to really make it my own for some consistency with the rest of my app. Luckily we can add our own styles!

## Custom Styling

Since we can nest selectors with styled-components, we can add all of our custom styles into the `CalendarContainer` component. The react-calendar creates elements with certain classes already applied, so we can use those as our selectors. 

### Navigation

Let's start by updating the navigation. Here's what I want to do:

- Have the navigation take the full width of the calendar
- Make the text in the center button bold
- Make the arrow buttons larger

Here's how we can do that:

```jsx
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    display: flex;

    .react-calendar__navigation__label {
      font-weight: bold;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }
`;
```

![](https://i.imgur.com/nUPumMu.png)

### Labels

Next I want to center the labels for the days of the week:

```jsx
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    /* ... */
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
  }
`;
```

![](https://i.imgur.com/nzNYIXF.png)

### Buttons

The layout is looking good, but we still need to apply some styles to the buttons:

```jsx
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    /* ... */
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    /* ... */
  }

  /* ~~~ button styles ~~~ */
  button {
    margin: 3px;
    background-color: #6f876f;
    border: 0;
    border-radius: 3px;
    color: white;
    padding: 5px 0;

    &:hover {
      background-color: #556b55;
    }

    &:active {
      background-color: #a5c1a5;
    }
  }
`;
```

![](https://i.imgur.com/f2VHrxP.png)

The buttons look a little better, but now the layout is all messed up! There are only six days in a row now. Let's fix that!

### Grid

So by default the views have the style `display: flex;` applied, which unfortunately leads to items spilling over to other rows instead of ensuring that there are always 7 days in a week. Luckily we can overwrite this behavior:

```jsx
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    /* ... */
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    /* ... */
  }

  /* ~~~ button styles ~~~ */
  button {
    /* ... */
  }

  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%; 
    
    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`;
```

![](https://i.imgur.com/K8t6mFU.png)

Awesome, by creating a grid with seven columns (each at 14.2%), we're back to seven days a week! 

### Neighboring Months and Weekends

The days of neighboring months look identical to the days of the active month right now, but we can change that as well. We can also change styles of days on the weekend.

```jsx
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    /* ... */
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    /* ... */
  }

  /* ~~~ button styles ~~~ */
  button {
    /* ... */
  }

  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    /* ... */
  }

  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #dfdfdf;
  }
`;
```

![](https://i.imgur.com/jM2jT7v.png)

### Active Day

There's now way for the user to tell which day is currently selected, so let's address that now:

```jsx
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    /* ... */
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    /* ... */
  }

  /* ~~~ button styles ~~~ */
  button {
    /* ... */
  }

  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    /* ... */
  }

  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    /* ... */
  }
  .react-calendar__month-view__days__day--weekend {
    /* ... */
  }

  /* ~~~ active day styles ~~~ */
  .react-calendar__tile--range {
      box-shadow: 0 0 6px 2px black;
  }
`;
```

![](https://i.imgur.com/hdjA962.png)

### Other Views

Our month view is looking good, but what about the other views? Let's take a look:

![](https://i.imgur.com/76QTPGA.png)

So the year view could use some improvement. Since we added our own styles to the buttons, some buttons are being pushed to the next row. Similar issues occur in the decade and century views too. Luckily we can fix this like we did before. We'll show the list of months in a grid of 3 columns by 4 rows. The 10 buttons in the decade and century views will be in a grid of 5 columns by 2 rows.

```jsx
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    /* ... */
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    /* ... */
  }

  /* ~~~ button styles ~~~ */
  button {
    /* ... */
  }

  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    /* ... */
  }

  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    /* ... */
  }
  .react-calendar__month-view__days__day--weekend {
    /* ... */
  }

  /* ~~~ active day styles ~~~ */
  .react-calendar__tile--range {
    /* ... */
  }

  /* ~~~ other view styles ~~~ */
  .react-calendar__year-view__months, .react-calendar__decade-view__years, .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;

    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }
    
    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`;
```

![](https://i.imgur.com/wPAGdiQ.png)