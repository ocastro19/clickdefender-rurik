import React from 'react';
import { Globe, Target, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Campaign } from '@/contexts/CampaignContext';

interface CampaignPresellInfoProps {
  campaign: Campaign;
  onUpdate?: (field: keyof Campaign, value: string) => void;
}

export default function CampaignPresellInfo({ campaign, onUpdate }: CampaignPresellInfoProps) {
  const [isEditingDomain, setIsEditingDomain] = React.useState(false);
  const [isEditingConversion, setIsEditingConversion] = React.useState(false);
  const [isEditingCheckout, setIsEditingCheckout] = React.useState(false);
  
  const [domainValue, setDomainValue] = React.useState(campaign.domain || '');
  const [conversionValue, setConversionValue] = React.useState(campaign.conversionGoal || '');
  const [checkoutValue, setCheckoutValue] = React.useState(campaign.checkoutGoal || '');

  const handleSave = (field: keyof Campaign, value: string, setEditing: (val: boolean) => void) => {
    if (onUpdate) {
      onUpdate(field, value);
    }
    setEditing(false);
  };

  const InfoButton = ({ 
    icon: Icon, 
    label, 
    value, 
    isEditing, 
    editValue, 
    onEditChange, 
    onEdit, 
    onSave,
    field 
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
    isEditing: boolean;
    editValue: string;
    onEditChange: (val: string) => void;
    onEdit: () => void;
    onSave: () => void;
    field: keyof Campaign;
  }) => (
    <div className="flex-1">
      {isEditing ? (
        <div className="flex gap-1">
          <Input
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            placeholder={label}
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave();
              if (e.key === 'Escape') {
                onEditChange(value);
                onEdit();
              }
            }}
          />
          <Button size="sm" variant="ghost" onClick={onSave} className="h-8 px-2">
            ✓
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 justify-start gap-2 text-xs"
          onClick={onEdit}
        >
          <Icon className="h-3 w-3" />
          <span className="truncate">{value || label}</span>
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex gap-2 flex-wrap mt-2">
      <InfoButton
        icon={Globe}
        label="Domínio"
        value={domainValue}
        isEditing={isEditingDomain}
        editValue={domainValue}
        onEditChange={setDomainValue}
        onEdit={() => setIsEditingDomain(!isEditingDomain)}
        onSave={() => handleSave('domain', domainValue, setIsEditingDomain)}
        field="domain"
      />
      <InfoButton
        icon={Target}
        label="Meta de Conversão"
        value={conversionValue}
        isEditing={isEditingConversion}
        editValue={conversionValue}
        onEditChange={setConversionValue}
        onEdit={() => setIsEditingConversion(!isEditingConversion)}
        onSave={() => handleSave('conversionGoal', conversionValue, setIsEditingConversion)}
        field="conversionGoal"
      />
      <InfoButton
        icon={ShoppingCart}
        label="Meta de Checkout"
        value={checkoutValue}
        isEditing={isEditingCheckout}
        editValue={checkoutValue}
        onEditChange={setCheckoutValue}
        onEdit={() => setIsEditingCheckout(!isEditingCheckout)}
        onSave={() => handleSave('checkoutGoal', checkoutValue, setIsEditingCheckout)}
        field="checkoutGoal"
      />
    </div>
  );
}
