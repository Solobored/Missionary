import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ContactCard from '@/components/ContactCard';
import { Plus, Search, LogOut, User, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initializingDemo, setInitializingDemo] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    status: 'unknown'
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isDemo = (user as { isDemo?: boolean })?.isDemo;

  const fetchContacts = async (query = '') => {
    try {
      setLoading(true);
      const data = await apiFetch(`/contacts${query ? `?q=${encodeURIComponent(query)}` : ''}`) as Contact[];
      setContacts(data);
    } catch (err) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts(searchQuery);
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/contacts', {
        method: 'POST',
        body: JSON.stringify(newContact)
      });
      toast.success('Contact created successfully');
      setDialogOpen(false);
      setNewContact({ firstName: '', lastName: '', phone: '', address: '', status: 'unknown' });
      fetchContacts(searchQuery);
    } catch (err) {
      const error = err as { data?: { error?: string } };
      toast.error(error.data?.error || 'Failed to create contact');
    }
  };

  const handleInitializeDemo = async () => {
    setInitializingDemo(true);
    try {
      const result = await apiFetch('/demo/init', { method: 'POST' }) as { message: string; contactCount: number };
      toast.success(result.message);
      fetchContacts();
    } catch (err) {
      const error = err as { data?: { error?: string } };
      toast.error(error.data?.error || 'Failed to initialize demo data');
    } finally {
      setInitializingDemo(false);
    }
  };

  const handleClearDemo = async () => {
    try {
      await apiFetch('/demo/clear', { method: 'DELETE' });
      toast.success('Demo data cleared');
      fetchContacts();
    } catch (err) {
      toast.error('Failed to clear demo data');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary">MissionConnect</h1>
              {isDemo && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  Demo Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Demo Admin Alert */}
        {isDemo && contacts.length === 0 && (
          <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <AlertDescription className="ml-2">
              <div className="font-semibold text-blue-900 mb-2">Welcome, Admin! 👋</div>
              <p className="text-sm text-blue-800 mb-3">
                You&apos;re logged in as the demo admin. Click the button below to populate the app with sample contacts, notes, and scheduled visits to test all features.
              </p>
              <Button 
                onClick={handleInitializeDemo} 
                disabled={initializingDemo}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {initializingDemo ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Load Demo Data
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search contacts by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </form>
          
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleCreateContact}>
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <DialogDescription>
                      Create a new contact for your missionary work
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newContact.firstName}
                        onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newContact.lastName}
                        onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newContact.address}
                        onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={newContact.status} onValueChange={(value) => setNewContact({ ...newContact, status: value })}>
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
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Contact</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {isDemo && contacts.length > 0 && (
              <Button variant="outline" onClick={handleClearDemo}>
                Clear Demo
              </Button>
            )}
          </div>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No contacts found matching your search' : 'No contacts yet'}
            </p>
            {!searchQuery && !isDemo && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Contact
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.map((contact) => (
              <ContactCard
                key={contact._id}
                contact={contact}
                onClick={() => navigate(`/contact/${contact._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}