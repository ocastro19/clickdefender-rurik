import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, X, DollarSign, AlertTriangle, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface Notification {
  id: string
  type: 'payment_today' | 'payment_tomorrow' | 'account_debt' | 'account_suspended' | 'invoice_due'
  title: string
  message: string
  amount?: number
  date?: string
  platform?: string
  account?: string
  read: boolean
  createdAt: string
}

interface NotificationSystemProps {
  notifications: Notification[]
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
  onRemoveNotification: (notificationId: string) => void
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemoveNotification
 }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_today':
      case 'payment_tomorrow':
        return <DollarSign className="h-4 w-4 text-success" />
      case 'account_debt':
      case 'invoice_due':
        return <CreditCard className="h-4 w-4 text-destructive" />
      case 'account_suspended':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment_today':
      case 'payment_tomorrow':
        return 'border-success/20 bg-success/5'
      case 'account_debt':
      case 'account_suspended':
      case 'invoice_due':
        return 'border-destructive/20 bg-destructive/5'
      default:
        return 'border-border bg-card'
    }
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-white border-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              <Bell className="h-4 w-4 inline mr-1.5" />
              {t('notifications.title')} {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                {t('notifications.markAllAsRead')}
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${getNotificationColor(notification.type)} ${
                    !notification.read ? 'ring-1 ring-primary/20' : ''
                  } transition-all hover:shadow-md`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            
                            {notification.amount && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-success">
                                  {formatCurrency(notification.amount)}
                                </Badge>
                              </div>
                            )}
                            
                            {notification.date && (
                              <div className="text-xs text-muted-foreground mt-1">
                                📅 {formatDate(notification.date)}
                              </div>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveNotification(notification.id)}
                            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {!notification.read && (
                          <div className="mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMarkAsRead(notification.id)}
                              className="h-6 text-xs text-primary hover:text-primary/80"
                            >
                              {t('notifications.markAsRead')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationSystem