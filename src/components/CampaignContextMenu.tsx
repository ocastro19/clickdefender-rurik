
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Settings, Pin, PinOff, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface CampaignContextMenuProps {
  isPinned: boolean
  onCustomizeMetrics: () => void
  onTogglePin: () => void
  onEdit: () => void
  onDelete: () => void
}

const CampaignContextMenu: React.FC<CampaignContextMenuProps> = ({
  isPinned,
  onCustomizeMetrics,
  onTogglePin,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onCustomizeMetrics}>
          <Settings className="h-4 w-4 mr-2" />
          {t('metricsConfig.customizeMetrics')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onTogglePin}>
          {isPinned ? (
            <>
              <PinOff className="h-4 w-4 mr-2" />
              {t('metricsConfig.unpinCampaign')}
            </>
          ) : (
            <>
              <Pin className="h-4 w-4 mr-2" />
              {t('metricsConfig.pinCampaign')}
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          {t('metricsConfig.editCampaign')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          {t('metricsConfig.deleteCampaign')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CampaignContextMenu
