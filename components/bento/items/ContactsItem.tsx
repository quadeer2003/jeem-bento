"use client";

import { BentoItem, Contact } from "@/lib/types";
import { useState } from "react";
import { Mail, Phone, Plus, Trash2, User } from "lucide-react";

interface ContactsItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function ContactsItem({ item, onUpdate, editable }: ContactsItemProps) {
  const [contacts, setContacts] = useState<Contact[]>(item.content?.contacts || []);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const addContact = () => {
    if (!newContact.name?.trim()) {
      setError("Name is required");
      return;
    }

    const contact: Contact = {
      id: Math.random().toString(36).substring(2, 9),
      name: newContact.name.trim(),
      email: newContact.email?.trim() || undefined,
      phone: newContact.phone?.trim() || undefined,
      notes: newContact.notes?.trim() || undefined,
      bentoItemId: item.id
    };

    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    onUpdate({ ...item.content, contacts: updatedContacts });
    
    // Reset form
    setNewContact({
      name: "",
      email: "",
      phone: "",
      notes: ""
    });
    setIsAddingContact(false);
    setError(null);
  };

  const removeContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    onUpdate({ ...item.content, contacts: updatedContacts });
  };

  return (
    <div className="w-full">
      {contacts.length > 0 ? (
        <div className="space-y-3">
          {contacts.map(contact => (
            <div key={contact.id} className="p-3 bg-secondary/30 rounded">
              <div className="flex justify-between items-start">
                <div className="font-medium">{contact.name}</div>
                {editable && (
                  <button 
                    onClick={() => removeContact(contact.id)}
                    className="text-destructive p-1 hover:bg-destructive/10 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="mt-1 space-y-1 text-sm">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.notes && (
                  <div className="mt-2 text-muted-foreground">
                    {contact.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-secondary/20 rounded">
          {editable ? "Add contacts" : "No contacts added"}
        </div>
      )}

      {editable && (
        <div className="mt-4">
          {isAddingContact ? (
            <div className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Name *</label>
                <div className="flex items-center border rounded overflow-hidden">
                  <div className="p-2 bg-secondary">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full p-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Email</label>
                <div className="flex items-center border rounded overflow-hidden">
                  <div className="p-2 bg-secondary">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="Email address"
                    className="w-full p-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <div className="flex items-center border rounded overflow-hidden">
                  <div className="p-2 bg-secondary">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full p-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Notes</label>
                <textarea
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  placeholder="Additional notes"
                  className="w-full p-2 border rounded"
                  rows={2}
                />
              </div>
              
              {error && <p className="text-destructive text-sm">{error}</p>}
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddingContact(false);
                    setError(null);
                  }}
                  className="px-3 py-1 bg-secondary rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={addContact}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
                >
                  Add Contact
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingContact(true)}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus size={16} /> Add Contact
            </button>
          )}
        </div>
      )}
    </div>
  );
} 