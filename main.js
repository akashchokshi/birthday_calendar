const DAYS_OF_WEEK = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
};
const BIRTHDAY_COLORS = [
    '#555d7b', '#9fd53c', '#c97d99', '#79cae5', '#e84933', '#0055d0', '#ec47aa', '#53ccf9'
];
let namesAndBirthdays;
let currentBirthdayYear;
let birthdaysDayWise = {
    'sunday': {
        'birthdays': []
    },
    'monday': {
        'birthdays': []
    },
    'tuesday': {
        'birthdays': []
    },
    'wednesday': {
        'birthdays': []
    },
    'thursday': {
        'birthdays': []
    },
    'friday': {
        'birthdays': []
    },
    'saturday': {
        'birthdays': []
    },
};

function populateNamesAndBirthdaysDayWise() {
    namesAndBirthdays = JSON.parse(document.getElementById('namesAndBirthdays').value);
    // remove previous birthdays
    const existingBirthdays = document.querySelectorAll('.birthday');
    if (existingBirthdays.length > 0) {
        for (let index = 0; index < existingBirthdays.length; index++) {
            const element = existingBirthdays[index];
            element.remove();
        }
        resetBirthdaysDayWise();
    }
    // get birthdays for given year
    namesAndBirthdays = namesAndBirthdays.filter(person => parseInt(new Date(person['birthday']).getFullYear(), 10) === currentBirthdayYear);
    // sort datewise in ascending order
    namesAndBirthdays = namesAndBirthdays.sort((a, b) => a.birthday.localeCompare(b.birthday));
    // youngest to oldest
    namesAndBirthdays.reverse();
    namesAndBirthdays.forEach(obj => {
        const name = obj['name'];
        const dayOfWeek = getDayOfTheWeek(obj['birthday']);
        sortBirthdaysDayWise(name, dayOfWeek);
    });
    appendBirthdaysToDaysWrapper();
}

function resetBirthdaysDayWise() {
    birthdaysDayWise = {
        'sunday': {
            'birthdays': []
        },
        'monday': {
            'birthdays': []
        },
        'tuesday': {
            'birthdays': []
        },
        'wednesday': {
            'birthdays': []
        },
        'thursday': {
            'birthdays': []
        },
        'friday': {
            'birthdays': []
        },
        'saturday': {
            'birthdays': []
        },
    };
}

function getDayOfTheWeek(date) {
    const input = new Date(date);
    return DAYS_OF_WEEK[input.getDay()];
}

function sortBirthdaysDayWise(name, dayOfWeek) {
    const [firstName, lastName] = name.split(" ");
    birthdaysDayWise[dayOfWeek]['birthdays'].push(firstName.slice(0, 1).toUpperCase() + (lastName || '').slice(0, 1).toUpperCase());
}

function appendBirthdaysToDaysWrapper() {
    for (const day in birthdaysDayWise) {
        if (birthdaysDayWise.hasOwnProperty(day)) {
            const personsInitialsArray = birthdaysDayWise[day]['birthdays'];
            const personsInitialsArrayLength = personsInitialsArray.length;
            // get the particular day's wrapper
            const dayWrapper = document.getElementById(day);
            if (personsInitialsArrayLength > 0) {
                let delta = 0;
                // check if the number of birthdays for a weekday is not a perfect square to change delta
                if (Math.sqrt(personsInitialsArrayLength) % 1 !== 0) {
                    delta = 1;
                }
                // calculate height width required for a birthday div
                const heightWidthForBirthdays = 100 / (Math.floor(Math.sqrt(personsInitialsArrayLength)) + delta);
                let colorIndex = 0;
                for (let index = 0; index < personsInitialsArrayLength; index++) {
                    const initials = personsInitialsArray[index];
                    const birthday = createDivForBirthdays(initials, heightWidthForBirthdays, colorIndex);
                    colorIndex++;
                    // reset colorIndex
                    if (colorIndex > BIRTHDAY_COLORS.length) {
                        colorIndex = 0;
                    }
                    dayWrapper.appendChild(birthday);
                    dayWrapper.classList.add('has-birthday');
                    dayWrapper.classList.remove('has-no-birthday');
                }
            } else {
                dayWrapper.classList.remove('has-birthday');
                dayWrapper.classList.add('has-no-birthday');
            }
        }
    }
}

function createDivForBirthdays(initials, heightWidthForBirthdays, colorIndex) {
    const birthday = document.createElement('div');
    birthday.innerHTML = initials;
    birthday.classList.add('birthday');
    birthday.style.width = heightWidthForBirthdays + '%';
    birthday.style.height = heightWidthForBirthdays + '%';
    birthday.style.backgroundColor = BIRTHDAY_COLORS[colorIndex];
    return birthday;
}

function setUpdateButtonState() {
    const input = document.getElementById('birthday-year');
    const updateButton = document.querySelector('.update-cta');
    const inputFieldLength = input.value.trim().length;
    if (input.validity.valid && inputFieldLength === 4) {
        currentBirthdayYear = parseInt(input.value, 10);
        updateButton.removeAttribute('disabled');
    } else {
        updateButton.setAttribute('disabled', true);
    }
}