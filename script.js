
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: loadEvents(),
        dateClick: function(info) {
            openModal(info.dateStr);
        },
        eventClick: function(info) {
            openModal(info.event.startStr, info.event);
        }
    });

    calendar.render();

    var modal = document.getElementById('event-modal');
    var span = document.getElementsByClassName('close')[0];
    var saveButton = document.getElementById('save-event');

    span.onclick = function() {
        closeModal();
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    saveButton.onclick = function() {
        saveEvent(calendar);
    };

    function openModal(date, event = null) {
        document.getElementById('event-title').value = event ? event.title : '';
        document.getElementById('event-date-time').value = event ? event.startStr.slice(0, 16) : date;
        modal.style.display = 'block';
        modal.currentEvent = event;
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function saveEvent(calendar) {
        var title = document.getElementById('event-title').value;
        var dateTime = document.getElementById('event-date-time').value;

        if (title && dateTime) {
            if (modal.currentEvent) {
                modal.currentEvent.setProp('title', title);
                modal.currentEvent.setStart(dateTime);
                updateEvent(modal.currentEvent);
            } else {
                var event = {
                    title: title,
                    start: dateTime,
                    allDay: false
                };
                calendar.addEvent(event);
                saveEventToStorage(event);
            }
            closeModal();
        }
    }

    function saveEventToStorage(event) {
        var events = loadEvents();
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
    }

    function updateEvent(event) {
        var events = loadEvents();
        var eventIndex = events.findIndex(e => e.start === event.startStr);
        events[eventIndex] = event;
        localStorage.setItem('events', JSON.stringify(events));
    }

    function loadEvents() {
        var events = localStorage.getItem('events');
        return events ? JSON.parse(events) : [];
    }
});