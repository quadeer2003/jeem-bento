"use client";

import { BentoItem } from "@/lib/types";
import { useState } from "react";
import { Mail, Plus, Trash2, User } from "lucide-react";

interface QuickMailItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

interface MailContact {
  id: string;
  name: string;
  email: string;
}

export default function QuickMailItem({ item, onUpdate, editable }: QuickMailItemProps) {
  const [contacts, setContacts] = useState<MailContact[]>(item.content?.contacts || []);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newContact, setNewContact] = useState<Partial<MailContact>>({
    name: "",
    email: ""
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const addContact = () => {
    if (!newContact.name?.trim()) {
      setError("Name is required");
      return;
    }

    if (!newContact.email?.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(newContact.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const contact: MailContact = {
      id: Math.random().toString(36).substring(2, 9),
      name: newContact.name.trim(),
      email: newContact.email.trim()
    };

    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    onUpdate({ ...item.content, contacts: updatedContacts });
    
    // Reset form
    setNewContact({
      name: "",
      email: ""
    });
    setIsAddingContact(false);
    setError(null);
  };

  const removeContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    onUpdate({ ...item.content, contacts: updatedContacts });
  };

  const openGmail = (email: string) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`, '_blank');
  };

  return (
    <div className="w-full h-full p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <Mail size={16} /> Quick Mail
        </h3>
      </div>
      
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 max-h-[calc(100%-3rem)] overflow-y-auto">
          {contacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => openGmail(contact.email)}
              className="flex items-center justify-between p-2 bg-secondary/20 rounded hover:bg-secondary/40 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <User size={16} className="text-primary" />
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-xs text-muted-foreground">{contact.email}</div>
                </div>
              </div>
              
              {editable && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeContact(contact.id);
                  }}
                  className="text-destructive p-1 hover:bg-destructive/10 rounded"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-secondary/20 rounded">
          {editable ? "Add email contacts" : "No contacts added"}
        </div>
      )}

      {editable && (
        <div className="mt-3">
          {isAddingContact ? (
            <div className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={newContact.name || ''}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Contact name"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={newContact.email || ''}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full p-2 border rounded"
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