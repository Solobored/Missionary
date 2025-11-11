import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import MapPicker from '@/components/MapPicker';
import { ArrowLeft, Save, Trash2, Plus, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Contact {
  _id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  address?: string;
  status?: string;
  tags?: string[];
  lat?: number;
  lng?: number;
}

interface Note {
  _id: string;
  text: string;
  author: { name: string };
  createdAt: string;
}

interface Visit {
  _id: string;
  datetime: string;
  notes?: string;
}

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [newVisit, setNewVisit] = useState({ datetime: '', notes: '' });

  useEffect(() => {
    if (id) {
      fetchContact();
      fetchNotes();
      fetchVisits();
    }
  }, [id]);

  const fetchContact = async () => {
    try {
      const data = await apiFetch(`/contacts/${id}`) as Contact;
      setContact(data);
    } catch (err) {
      toast.error('Failed to load contact');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const data = await apiFetch(`/contacts/${id}/notes`) as Note[];
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes');
    }
  };

  const fetchVisits = async () => {
    try {
      const data = await apiFetch(`/contacts/${id}/visits`) as Visit[];
      setVisits(data);
    } catch (err) {
      console.error('Failed to load visits');
    }
  };

  const handleSaveContact = async () => {
    if (!contact) return;
    try {
      await apiFetch(`/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(contact)
      });
      toast.success('Contact updated successfully');
    } catch (err) {
      const error = err as { data?: { error?: string } };
      toast.error(error.data?.error || 'Failed to update contact');
    }
  };

  const handleDeleteContact = async () => {
    try {
      await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
      toast.success('Contact deleted successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    
    try {
      await apiFetch(`/contacts/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ text: noteText })
      });
      setNoteText('');
      fetchNotes();
      toast.success('Note added');
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await apiFetch(`/contacts/${id}/notes/${noteId}`, { method: 'DELETE' });
      fetchNotes();
      toast.success('Note deleted');
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const handleAddVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch(`/contacts/${id}/visits`, {
        method: 'POST',
        body: JSON.stringify(newVisit)
      });
      setVisitDialogOpen(false);
      setNewVisit({ datetime: '', notes: '' });
      fetchVisits();
      toast.success('Visit scheduled');
    } catch (err) {
      toast.error('Failed to schedule visit');
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    try {
      await apiFetch(`/contacts/${id}/visits/${visitId}`, { method: 'DELETE' });
      fetchVisits();
      toast.success('Visit deleted');
    } catch (err) {
      toast.error('Failed to delete visit');
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    if (!contact) return;
    try {
      await apiFetch(`/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...contact, lat, lng })
      });
      setContact({ ...contact, lat, lng });
      setMapDialogOpen(false);
      toast.success('Location updated');
    } catch (err) {
      toast.error('Failed to update location');
    }
  };

  if (loading || !contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleSaveContact}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this contact and all associated notes and visits.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteContact}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
            <TabsTrigger value="visits">Visits ({visits.length})</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={contact.firstName}
                      onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={contact.lastName || ''}
                      onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={contact.address || ''}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={contact.status} 
                    onValueChange={(value) => setContact({ ...contact, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">Unknown</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="teaching">Teaching</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        {contact.lat && contact.lng ? 'Update Location' : 'Set Location on Map'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Select Location</DialogTitle>
                        <DialogDescription>
                          Click on the map to set the contact&apos;s location
                        </DialogDescription>
                      </DialogHeader>
                      <MapPicker
                        lat={contact.lat}
                        lng={contact.lng}
                        onLocationSelect={handleLocationSelect}
                      />
                    </DialogContent>
                  </Dialog>
                  {contact.lat && contact.lng && (
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {contact.lat.toFixed(6)}, {contact.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notes & Visit History</CardTitle>
                <CardDescription>Record details about visits and interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <Textarea
                    placeholder="Add a note about your visit or interaction..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                  />
                  <Button type="submit" disabled={!noteText.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </form>

                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No notes yet</p>
                  ) : (
                    notes.map((note) => (
                      <Card key={note._id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-muted-foreground">
                            {note.author?.name || 'Demo Admin'} • {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNote(note._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visits Tab */}
          <TabsContent value="visits">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Visits</CardTitle>
                <CardDescription>Plan and track your visits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleAddVisit}>
                      <DialogHeader>
                        <DialogTitle>Schedule a Visit</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="datetime">Date & Time *</Label>
                          <Input
                            id="datetime"
                            type="datetime-local"
                            value={newVisit.datetime}
                            onChange={(e) => setNewVisit({ ...newVisit, datetime: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="visitNotes">Notes</Label>
                          <Textarea
                            id="visitNotes"
                            placeholder="Purpose of visit, topics to discuss..."
                            value={newVisit.notes}
                            onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setVisitDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Schedule</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="space-y-3">
                  {visits.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No visits scheduled</p>
                  ) : (
                    visits.map((visit) => (
                      <Card key={visit._id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">
                                {format(new Date(visit.datetime), 'EEEE, MMMM d, yyyy')}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(new Date(visit.datetime), 'h:mm a')}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVisit(visit._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {visit.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{visit.notes}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}