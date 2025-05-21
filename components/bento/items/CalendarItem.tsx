"use client";

import { BentoItem, CalendarEvent } from "@/lib/types";
import { useEffect, useState } from "react";
import { getCalendarEvents } from "@/lib/db";

interface CalendarItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function CalendarItem({ item, onUpdate, editable }: CalendarItemProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchEvents = async () => {
      if (item.content?.events) {
        setEvents(item.content.events);
      } else if (item.id) {
        // If stored in database
        const fetchedEvents = await getCalendarEvents(item.id);
        setEvents(fetchedEvents);
        // Update the item content with fetched events
        onUpdate({ ...item.content, events: fetchedEvents });
      }
    };

    fetchEvents();
  }, [item.id, item.content]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const hasEventsOnDate = (dateStr: string) => {
    return events.some(event => event.date.startsWith(dateStr));
  };

  const eventsForSelectedDate = selectedDate 
    ? events.filter(event => event.date.startsWith(selectedDate))
    : [];

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      const newEvents = [
        ...events,
        {
          id: Math.random().toString(36).substring(2, 9),
          title: newEvent.title,
          description: newEvent.description || "",
          date: newEvent.date,
          bentoItemId: item.id
        } as CalendarEvent
      ];
      
      setEvents(newEvents);
      onUpdate({ ...item.content, events: newEvents });
      setNewEvent({
        title: "",
        description: "",
        date: selectedDate || new Date().toISOString().split('T')[0]
      });
      setShowEventModal(false);
    }
  };

  const deleteEvent = (eventId: string) => {
    const newEvents = events.filter(event => event.id !== eventId);
    setEvents(newEvents);
    onUpdate({ ...item.content, events: newEvents });
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = startOfMonth(currentDate);
    
    // Empty cells for days before the 1st of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-6 w-6 text-center text-gray-400"></div>);
    }
    
    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasEvents = hasEventsOnDate(dateStr);
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`
            h-6 w-6 flex items-center justify-center rounded-full cursor-pointer text-xs
            ${hasEvents ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}
            ${selectedDate === dateStr ? 'ring-2 ring-primary' : ''}
          `}
          onClick={() => setSelectedDate(dateStr)}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="flex h-full">
      {/* Calendar on the left */}
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-7 gap-1 p-1">
          <div className="col-span-7 flex justify-between items-center mb-1">
            <button onClick={prevMonth} className="p-0.5 rounded hover:bg-secondary text-xs">&lt;</button>
            <div className="font-medium text-">
              {currentDate.toLocaleString('default', { month: 'short' })} {currentDate.getFullYear()}
            </div>
            <button onClick={nextMonth} className="p-0.5 rounded hover:bg-secondary text-xs">&gt;</button>
          </div>
          
          <div className="text-center text-xs">S</div>
          <div className="text-center text-xs">M</div>
          <div className="text-center text-xs">T</div>
          <div className="text-center text-xs">W</div>
          <div className="text-center text-xs">T</div>
          <div className="text-center text-xs">F</div>
          <div className="text-center text-xs">S</div>
          
          {renderCalendar()}
        </div>
      </div>

      {/* Events on the right */}
      <div className="w-1/2 min-w-0 border-l pl-1 flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium text-md truncate">
            {selectedDate ? `Events (${selectedDate})` : 'Events'}
          </h4>
          {editable && selectedDate && (
            <button 
              className="text-xs px-1 py-0.5 bg-primary text-primary-foreground rounded"
              onClick={() => setShowEventModal(true)}
            >
              +
            </button>
          )}
        </div>
        
        {!selectedDate ? (
          <div className="text-xs text-gray-500 italic">Select a date</div>
        ) : eventsForSelectedDate.length === 0 ? (
          <div className="text-md text-gray-500 italic">No events</div>
        ) : (
          <div className="space-y-1 overflow-y-auto flex-1">
            {eventsForSelectedDate.map(event => (
              <div key={event.id} className="p-1 rounded text-md">
                <div className="flex justify-between items-center">
                  <div className="font-medium truncate">{event.title}</div>
                  {editable && (
                    <button 
                      onClick={() => deleteEvent(event.id)}
                      className="text-xs text-destructive ml-1"
                    >
                      ×
                    </button>
                  )}
                </div>
                {event.description && (
                  <div className="text-xs truncate mt-0.5">{event.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Add New Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Description (optional)</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  className="px-3 py-1 bg-secondary rounded"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-3 py-1 bg-primary text-primary-foreground rounded"
                  onClick={addEvent}
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 