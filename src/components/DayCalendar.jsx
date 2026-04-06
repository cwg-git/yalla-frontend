import React from 'react';

const DayCalendar = ({ 
    currentDate, 
    selectedDate, 
    events, 
    weeks, 
    navigateMonth, 
    formatMonth, 
    setSelectedDate, 
    getOrdinalSuffix 
}) => {
    return (
        <div id="mec_skin_40820" className="mec-wrap colorskin-custom">
            <div className="mec-calendar mec-box-calendar" id="mec_skin_events_40820_full">
                <div className="mec-calendar-topsec">
                    <div className="mec-calendar-side mec-clear">
                        <div className="mec-skin-monthly-view-month-navigator-container">
                            <div className="mec-month-navigator">
                                <div className="mec-previous-month mec-load-month mec-previous-month" onClick={() => navigateMonth(-1)}>
                                    <button type="button" className="mec-load-month-link" onClick={(e) => e.preventDefault()}>
                                        <i className="mec-sl-angle-left" />
                                        {new Date(currentDate.getFullYear(), currentDate.getMonth() - 1).toLocaleDateString('en-US', { month: 'long' })}
                                    </button>
                                </div>
                                <div className="mec-calendar-header">
                                    <h2>{formatMonth(currentDate)}</h2>
                                </div>
                                <div className="mec-next-month mec-load-month mec-next-month" onClick={() => navigateMonth(1)}>
                                    <button type="button" className="mec-load-month-link" onClick={(e) => e.preventDefault()}>
                                        {new Date(currentDate.getFullYear(), currentDate.getMonth() + 1).toLocaleDateString('en-US', { month: 'long' })}
                                        <i className="mec-sl-angle-right" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mec-calendar-table" id="mec_skin_events_40820">
                            <div className="mec-month-container mec-month-container-selected" data-month-id={currentDate.getFullYear() * 100 + currentDate.getMonth() + 1}>
                                <dl className="mec-calendar-table-head">
                                    {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(day => (
                                        <dt key={day} className="mec-calendar-day-head">{day}</dt>
                                    ))}
                                </dl>
                                {weeks.map((week, weekIndex) => (
                                    <dl key={weekIndex} className="mec-calendar-row">
                                        {week.map((day, dayIndex) => (
                                            <dt 
                                                key={dayIndex}
                                                className={`${day.isCurrentMonth ? 'mec-calendar-day' : 'mec-table-nullday'} ${day.eventsCount > 0 ? 'mec-has-event' : ''} ${day.date.toDateString() === selectedDate.toDateString() ? 'mec-selected-day' : ''}`}
                                                data-mec-cell={parseInt(day.date.getFullYear().toString() + (day.date.getMonth() + 1).toString().padStart(2, '0') + day.date.getDate().toString().padStart(2, '0'))}
                                                data-day={day.date.getDate()}
                                                data-month={day.date.getFullYear() * 100 + day.date.getMonth() + 1}
                                                onClick={() => setSelectedDate(day.date)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {day.eventsCount > 0 && day.isCurrentMonth ? (
                                                    <button type="button" className="mec-has-event-a" onClick={(e) => e.preventDefault()}>{day.date.getDate()}</button>
                                                ) : (
                                                    day.date.getDate()
                                                )}
                                            </dt>
                                        ))}
                                    </dl>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mec-calendar-events-side mec-clear">
                        <div className="mec-month-side">
                            <div className="mec-calendar-events-sec" style={{ display: 'block' }}>
                                <h6 className="mec-table-side-title">
                                    Events for <span className="mec-color mec-table-side-day"> {selectedDate.getDate()}{getOrdinalSuffix(selectedDate.getDate())}</span>
                                    {' '}{selectedDate.toLocaleDateString('en-US', { month: 'long' })}
                                </h6>
                                {(() => {
                                    const selectedDateEvents = events.filter(event => {
                                        const eventDate = new Date(event.post_date);
                                        return eventDate.toDateString() === selectedDate.toDateString();
                                    });
                                    
                                    return selectedDateEvents.length > 0 ? (
                                        selectedDateEvents.map(event => (
                                            <article key={event.id} className="mec-event-article">
                                                <div className="mec-event-image">
                                                    <img 
                                                        loading="lazy" 
                                                        decoding="async" 
                                                        width={300} 
                                                        height={300} 
                                                        src={event.image} 
                                                        className="attachment-thumblist size-thumblist wp-post-image" 
                                                        alt={event.title}
                                                        data-mec-postid={event.id} 
                                                    />
                                                </div>
                                                <div className="mec-monthly-contents" style={{ width: 'calc(100% - 85px)' }}>
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
                                                </div>
                                                <div style={{ clear: 'both' }} />
                                            </article>
                                        ))
                                    ) : (
                                        <article className="mec-event-article">
                                            <div className="mec-event-detail">No Events</div>
                                        </article>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mec-event-footer" />
            </div>
            <div className="mec-modal-result" />
        </div>
    );
};

export default DayCalendar;
