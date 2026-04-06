import React from 'react';

const WeeklyCalendar = ({ 
    currentDate, 
    selectedDate, 
    events, 
    weeks, 
    currentWeekNumber, 
    navigateMonth, 
    navigateWeek, 
    formatMonth, 
    setSelectedDate 
}) => {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div id="mec_skin_42773" className="mec-wrap colorskin-custom">
            <div className="mec-calendar mec-calendar-daily mec-calendar-weekly">
                <div className="mec-skin-weekly-view-month-navigator-container mec-calendar-a-month mec-clear">
                    <div className="mec-month-navigator">
                        <div className="mec-previous-month mec-load-month mec-color" onClick={() => navigateMonth(-1)}>
                            <button type="button" className="mec-load-month-link" onClick={(e) => e.preventDefault()}>
                                <i className="mec-sl-angle-left" />
                            </button>
                        </div>
                        <h4 className="mec-month-label">{formatMonth(currentDate)}</h4>
                        <div className="mec-next-month mec-load-month mec-color" onClick={() => navigateMonth(1)}>
                            <button type="button" className="mec-load-month-link" onClick={(e) => e.preventDefault()}>
                                <i className="mec-sl-angle-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mec-skin-weekly-view-events-container" id="mec_skin_events_42773">
                    <div className="mec-month-container" id="mec_weekly_view_month_42773_202506">
                        <div className="mec-calendar-d-top">
                            <div className="mec-previous-month mec-load-week mec-color" onClick={() => navigateWeek(-1)}>
                                <i className="mec-sl-angle-left" />
                            </div>
                            <div className="mec-next-month mec-load-week mec-color" onClick={() => navigateWeek(1)}>
                                <i className="mec-sl-angle-right" />
                            </div>
                            <h3 className="mec-current-week">Week <span>{currentWeekNumber}</span></h3>
                        </div>
                        <div className="mec-weeks-container mec-calendar-d-table">
                            {weeks.map((week, weekIndex) => (
                                <dl key={weekIndex} className={`mec-weekly-view-week ${weekIndex === Math.floor(weeks.length / 2) ? 'mec-weekly-view-week-active' : ''}`} data-week-number={weekIndex + 1} data-max-weeks={6}>
                                    {week.map((day, dayIndex) => (
                                        <dt 
                                            key={dayIndex}
                                            data-events-count={day.eventsCount}
                                            className={`${!day.isCurrentMonth || day.eventsCount === 0 ? 'mec-weekly-disabled mec-table-nullday' : ''}`}
                                            onClick={() => setSelectedDate(day.date)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span className="mec-weekly-view-weekday">{weekDays[dayIndex]}</span>
                                            <span className="mec-weekly-view-monthday">{day.date.getDate()}</span>
                                        </dt>
                                    ))}
                                </dl>
                            ))}
                        </div>
                        <div className="mec-week-events-container">
                            <ul className="mec-weekly-view-dates-events">
                                {events && events.length > 0 ? (
                                    events.map((event) => (
                                        <li key={event.id} className="mec-weekly-view-date-events mec-calendar-day-events mec-clear mec-weekly-view-week-42773-2025063" data-week-number={3}>
                                            <article className="mec-event-article">
                                                <div className="mec-event-list-weekly-date mec-color">
                                                    <span className="mec-date-day">{new Date(event.post_date).getDate()}</span>
                                                    {new Date(event.post_date).toLocaleDateString('en-US', { month: 'long' })}
                                                </div>
                                                <div className="mec-weekly-contents-wrapper">
                                                    <div className="mec-event-image">
                                                        <img
                                                            loading="lazy"
                                                            decoding="async"
                                                            width={150}
                                                            height={150}
                                                            src={event.image}
                                                            className="attachment-thumbnail size-thumbnail wp-post-image"
                                                            alt={event.title}
                                                            data-mec-postid={event.id}
                                                        />
                                                    </div>
                                                    <div className="mec-weekly-contents">
                                                        <div className="mec-event-time mec-color">
                                                            <i className="mec-sl-clock-o" /> All Day
                                                        </div>
                                                        <h4 className="mec-event-title">
                                                            <a
                                                                className="mec-color-hover"
                                                                data-event-id={event.id}
                                                                href={event.link || '#'}
                                                                target="_self"
                                                                rel="noopener"
                                                            >
                                                                {event.title}
                                                            </a>
                                                        </h4>
                                                        <div className="mec-event-detail">
                                                            <div className="mec-event-loc-place" />
                                                        </div>
                                                        <div className="mec-categories-wrapper">
                                                            <i className="mec-sl-folder" />
                                                            <ul className="mec-categories">
                                                                <li className="mec-category">
                                                                    <button type="button" className="mec-color-hover" target="_blank">
                                                                        {event.category_id}
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        </li>
                                    ))
                                ) : (
                                    <li className="mec-weekly-view-date-events mec-calendar-day-events mec-clear">
                                        <article className="mec-event-article">
                                            <h4 className="mec-event-title">No Events</h4>
                                            <div className="mec-event-detail" />
                                        </article>
                                    </li>
                                )}
                            </ul>
                            <div className="mec-event-footer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyCalendar;
