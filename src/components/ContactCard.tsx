import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin } from 'lucide-react';

interface Contact {
  _id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  address?: string;
  status?: string;
  tags?: string[];
}

interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
}

const statusColors: Record<string, string> = {
  interested: 'bg-green-100 text-green-800',
  teaching: 'bg-blue-100 text-blue-800',
  not_interested: 'bg-gray-100 text-gray-800',
  unknown: 'bg-yellow-100 text-yellow-800'
};

const statusLabels: Record<string, string> = {
  interested: 'Interested',
  teaching: 'Teaching',
  not_interested: 'Not Interested',
  unknown: 'Unknown'
};

export default function ContactCard({ contact, onClick }: ContactCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">
              {contact.firstName} {contact.lastName || ''}
            </h3>
            {contact.status && (
              <Badge className={`${statusColors[contact.status]} mt-1`} variant="secondary">
                {statusLabels[contact.status]}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{contact.phone}</span>
          </div>
          {contact.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{contact.address}</span>
            </div>
          )}
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {contact.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}