import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { useEvents } from '@/hooks/useEvents';
import { formatDate, formatTime, formatDateTime } from '@/utils/dateHelpers';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

const EventModal = ({ isOpen, onClose, event, onSave }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    start: event?.start ? event.start.slice(0, 16) : '',
    end: event?.end ? event.end.slice(0, 16) : '',
    type: event?.type || 'meeting',
    location: event?.location || '',
    attendees: event?.attendees?.join(', ') || '',
    relatedContact: event?.relatedContact || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
      attendees: formData.attendees.split(',').map(a => a.trim()).filter(Boolean)
    };
    onSave(eventData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-display">
            {event ? 'Edit Event' : 'Add New Event'}
          </h2>
          <Button variant="ghost" size="sm" icon="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              required
              value={formData.start}
              onChange={(e) => setFormData({ ...formData, start: e.target.value })}
            />
            <Input
              label="End Date & Time"
              type="datetime-local"
              required
              value={formData.end}
              onChange={(e) => setFormData({ ...formData, end: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                <option value="meeting">Meeting</option>
                <option value="showing">Property Showing</option>
                <option value="call">Phone Call</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <Input
            label="Attendees (comma-separated)"
            value={formData.attendees}
            onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
            placeholder="john@email.com, sarah@email.com"
          />

          <Input
            label="Related Contact"
            value={formData.relatedContact}
            onChange={(e) => setFormData({ ...formData, relatedContact: e.target.value })}
          />

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Calendar = () => {
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentDate]);

  const dayEvents = useMemo(() => {
    const eventsByDay = {};
    events.forEach(event => {
      const eventDate = format(new Date(event.start), 'yyyy-MM-dd');
      if (!eventsByDay[eventDate]) {
        eventsByDay[eventDate] = [];
      }
      eventsByDay[eventDate].push(event);
    });
    return eventsByDay;
  }, [events]);

  const todayEvents = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return dayEvents[today] || [];
  }, [dayEvents]);

  const handleCreateEvent = async (eventData) => {
    await createEvent(eventData);
  };

  const handleUpdateEvent = async (eventData) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent.Id, eventData);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  if (loading) return <Loading type="calendar" />;
  if (error) return <Error title="Failed to load calendar" message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage your appointments and schedule with Gmail integration.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button
            variant="secondary"
            icon="Sync"
            onClick={() => window.alert('Gmail sync feature would be implemented here')}
          >
            Sync Gmail
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => {
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
          >
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <Card>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-display text-neutral-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" icon="ChevronLeft" onClick={prevMonth} />
                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="ghost" size="sm" icon="ChevronRight" onClick={nextMonth} />
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-neutral-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(day => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const dayEventsCount = dayEvents[dayKey]?.length || 0;
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={dayKey}
                    className={`
                      min-h-24 p-2 border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors
                      ${isCurrentDay ? 'bg-primary-50 border-primary-200' : 'bg-white'}
                    `}
                    onClick={() => {
                      // Handle day click - could open day view or create event
                    }}
                  >
                    <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-primary-700' : 'text-neutral-900'}`}>
                      {format(day, 'd')}
                    </div>
                    
                    {dayEventsCount > 0 && (
                      <div className="space-y-1">
                        {dayEvents[dayKey].slice(0, 2).map(event => (
                          <div
                            key={event.Id}
                            className="text-xs p-1 rounded bg-primary-100 text-primary-700 truncate cursor-pointer hover:bg-primary-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setIsModalOpen(true);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEventsCount > 2 && (
                          <div className="text-xs text-neutral-500">
                            +{dayEventsCount - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Today's Events */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold font-display text-neutral-900 mb-4">
              Today's Events
            </h3>
            
            {todayEvents.length === 0 ? (
              <Empty
                icon="Calendar"
                title="No events today"
                message="Your schedule is clear."
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div
                    key={event.Id}
                    className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition-colors"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsModalOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-neutral-900 text-sm">
                        {event.title}
                      </h4>
                      <Badge variant={event.type === 'showing' ? 'showing' : 'default'}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-600 mb-1">
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </p>
                    {event.location && (
                      <p className="text-xs text-neutral-500 flex items-center">
                        <ApperIcon name="MapPin" className="w-3 h-3 mr-1" />
                        {event.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold font-display text-neutral-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                icon="Calendar"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedEvent(null);
                  setIsModalOpen(true);
                }}
              >
                Schedule Meeting
              </Button>
              <Button
                variant="secondary"
                icon="Home"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedEvent({
                    title: 'Property Showing',
                    type: 'showing',
                    start: new Date().toISOString(),
                    end: new Date(Date.now() + 3600000).toISOString()
                  });
                  setIsModalOpen(true);
                }}
              >
                Schedule Showing
              </Button>
              <Button
                variant="ghost"
                icon="Phone"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedEvent({
                    title: 'Follow-up Call',
                    type: 'call',
                    start: new Date().toISOString(),
                    end: new Date(Date.now() + 1800000).toISOString()
                  });
                  setIsModalOpen(true);
                }}
              >
                Schedule Call
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSave={selectedEvent?.Id ? handleUpdateEvent : handleCreateEvent}
      />
    </div>
  );
};

export default Calendar;