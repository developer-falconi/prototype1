import React from 'react';
import PropTypes from 'prop-types';
import './event-card.scss';

export default function EventCard({ event }) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const formatDate = (date) => date.toLocaleDateString();
  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="event-card shadow-sm">
      <div className="event-card__header">
        <h3 className="event-card__title">{event.name}</h3>
        <span className={`badge ${event.status === 'COMPLETED' ? 'badge--active' : 'badge--inactive'}`}>
          {event.status}
        </span>
      </div>

      <p className="event-card__description">{event.description}</p>

      <ul className="event-card__info">
        <li>
          <strong>Fecha:</strong> {formatDate(start)}
        </li>
        <li>
          <strong>Inicia:</strong> {formatTime(start)}
        </li>
        <li>
          <strong>Finaliza:</strong> {formatTime(end)}
        </li>
        <li>
          <strong>Ubicación:</strong> {event.location}
        </li>
      </ul>
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    location: PropTypes.string,
    status: PropTypes.string,
    prevents: PropTypes.array,
  }).isRequired,
};
